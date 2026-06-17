import { isTauri } from '../../utils/platform.ts';
import { create } from 'zustand';

/** 延迟加载 Tauri 事件 API，避免在浏览器环境下顶层调用崩溃。 */
async function getTauriEvent() {
  if (!isTauri) return null;
  return await import('@tauri-apps/api/event');
}

/** 延迟加载 Tauri Store 插件。 */
async function getTauriStore() {
  if (!isTauri) return null;
  return await import('@tauri-apps/plugin-store');
}

const setupMap = new Map<string, boolean>();
const pendingInits = new Map<string, Promise<void>>();

export function createSync<V extends object>(key: string, initialValues: V) {
  type StoreType = {
    data: V;
    initialized: boolean;
    sync: ((patch: Partial<V>) => Promise<void>) &
      ((key: keyof V, value: V[keyof V]) => Promise<void>);
    syncAll: (next: V, persistLocal?: boolean) => Promise<void>;
    reset: () => Promise<void>;
  };

  const shouldPersist = !!key?.trim();
  const store = create<StoreType>((set, get) => {
    async function apply(partial: Partial<StoreType>, persistLocal: boolean = true): Promise<void> {
      set(partial);
      const tauriEvent = await getTauriEvent();
      if (tauriEvent) {
        await tauriEvent.emit(`sync:${key}`, partial);
      }
      await saveLocal(key, shouldPersist && persistLocal, { data: get().data });
    }

    async function syncImpl(
      patchOrKey: Partial<V> | keyof V,
      maybeValue?: V[keyof V],
    ): Promise<void> {
      let delta: Partial<V>;
      let next: V;
      if (patchOrKey !== null && typeof patchOrKey === 'object' && !Array.isArray(patchOrKey)) {
        delta = patchOrKey as Partial<V>;
        next = { ...get().data, ...delta };
      } else {
        const k = patchOrKey as keyof V;
        delta = { [k]: maybeValue } as Partial<V>;
        next = { ...get().data, [k]: maybeValue };
      }
      set({ data: next });
      const tauriEvent = await getTauriEvent();
      if (tauriEvent) {
        await tauriEvent.emit(`sync:${key}`, { delta });
      }
      await saveLocal(key, shouldPersist, { data: next });
    }

    return {
      data: initialValues,
      initialized: !shouldPersist,
      sync: syncImpl as StoreType['sync'],
      syncAll: async (next: V, persistLocal: boolean = true) => {
        await apply({ data: next }, persistLocal);
      },
      reset: async () => {
        await apply({ data: initialValues });
      },
    };
  });

  if (!setupMap.get(key)) {
    setupMap.set(key, true);

    // 仅在 Tauri 环境下监听跨窗口同步事件
    if (isTauri) {
      void getTauriEvent().then((tauriEvent) => {
        if (!tauriEvent) return;
        void tauriEvent.listen(`sync:${key}`, async (event) => {
          const payload = event.payload as Record<string, unknown>;
          if (payload.delta && typeof payload.delta === 'object' && !Array.isArray(payload.delta)) {
            const current = store.getState().data as Record<string, unknown>;
            store.setState({
              data: { ...current, ...(payload.delta as Record<string, unknown>) } as V,
            });
          } else if (payload.data) {
            store.setState({ data: payload.data as V });
          }
        });
      });
    }

    if (shouldPersist) {
      const initPromise = (async function initFromFile() {
        const obj = await getLocal(key);
        if (obj) {
          store.setState({ data: { ...initialValues, ...obj } as V, initialized: true });
        } else {
          store.setState({ initialized: true });
        }
      })();
      pendingInits.set(key, initPromise);
    }
  }

  return store;
}

export async function prepareSync(): Promise<void> {
  await Promise.all(pendingInits.values());
}

async function getStore(key: string) {
  if (!isTauri) return null;
  const tauriStore = await getTauriStore();
  if (!tauriStore) return null;
  return await tauriStore.load(`${key}.json`);
}

async function saveLocal(key: string, persist: boolean, payload: { data: unknown }): Promise<void> {
  if (!persist) return;
  const v = payload.data;
  if (!(v && typeof v === 'object' && !Array.isArray(v))) return;
  const record = v as Record<string, unknown>;

  if (isTauri) {
    const inst = await getStore(key);
    if (inst) {
      for (const nk of Object.keys(record)) {
        await inst.set(nk, record[nk]);
      }
      await inst.save();
    }
  } else {
    // 浏览器回退：使用 localStorage 持久化
    try {
      localStorage.setItem(`li-calendar:${key}`, JSON.stringify(record));
    } catch {
      // quota exceeded or private browsing
    }
  }
}

async function getLocal(key: string): Promise<Record<string, unknown> | null> {
  if (isTauri) {
    const inst = await getStore(key);
    if (!inst) return null;
    const entries = await inst.entries<[string, unknown]>();
    if (!(entries && entries.length > 0)) {
      return null;
    }
    return Object.fromEntries(entries) as Record<string, unknown>;
  }
  // 浏览器回退：从 localStorage 读取
  try {
    const raw = localStorage.getItem(`li-calendar:${key}`);
    if (raw) {
      return JSON.parse(raw) as Record<string, unknown>;
    }
  } catch {
    // parse error
  }
  return null;
}
