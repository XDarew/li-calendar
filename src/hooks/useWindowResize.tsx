import { type CallbackRef, useCallback, useRef } from 'react';
import { isTauri } from '../utils/platform.ts';
import { useConfigSync } from '../sync/configStore.ts';

/** 拖拽调整方向的枚举 */
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/** 拖拽手柄尺寸 */
const HANDLE_SIZE = 6;
/** 拖拽手柄的 hover 区域 */
const HANDLE_HOVER = 8;

interface ResizeState {
  direction: ResizeDirection;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

/**
 * 提供容器边缘 / 角落拖拽调整大小的能力。
 * 拖拽过程中实时更新容器尺寸，松手后持久化到 configStore。
 * Tauri 环境下同步调用 setSize。
 */
export function useWindowResize(): {
  containerRef: CallbackRef<HTMLDivElement>;
  handleElements: React.ReactNode;
} {
  const { sync } = useConfigSync();
  const stateRef = useRef<ResizeState | null>(null);
  const containerElRef = useRef<HTMLDivElement | null>(null);

  const onPointerDown = useCallback(
    (direction: ResizeDirection) => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = containerElRef.current;
      if (!el) return;

      stateRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: el.offsetWidth,
        startHeight: el.offsetHeight,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s) return;
    const el = containerElRef.current;
    if (!el) return;

    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    let nextW = s.startWidth;
    let nextH = s.startHeight;

    if (s.direction.includes('e')) nextW = s.startWidth + dx;
    if (s.direction.includes('w')) nextW = s.startWidth - dx;
    if (s.direction.includes('s')) nextH = s.startHeight + dy;
    if (s.direction.includes('n')) nextH = s.startHeight - dy;

    nextW = Math.max(240, Math.min(600, nextW));
    nextH = Math.max(0, nextH);

    el.style.width = `${nextW}px`;
    if (nextH > 0) {
      el.style.height = `${nextH}px`;
    } else {
      el.style.height = '';
    }
  }, []);

  const onPointerUp = useCallback(
    async (e: React.PointerEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const el = containerElRef.current;
      if (!el) return;

      const finalW = el.offsetWidth;
      const finalH = el.offsetHeight;

      sync('windowWidth', finalW);
      sync('windowHeight', finalH);

      // Tauri 环境下同步原生窗口尺寸
      if (isTauri) {
        try {
          const { getCurrentWindow } = await import('@tauri-apps/api/window');
          const { PhysicalSize } = await import('@tauri-apps/api/dpi');
          const win = getCurrentWindow();
          const factor = await win.scaleFactor();
          await win.setSize(new PhysicalSize(Math.ceil(finalW * factor), Math.ceil(finalH * factor)));
        } catch {
          // ignore
        }
      }

      stateRef.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    },
    [sync],
  );

  const ref = useCallback((el: HTMLDivElement | null) => {
    containerElRef.current = el;
  }, []);

  /** 拖拽手柄的光标映射 */
  const cursorMap: Record<ResizeDirection, string> = {
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
    ne: 'nesw-resize',
    nw: 'nwse-resize',
    se: 'nwse-resize',
    sw: 'nesw-resize',
  };

  /** 8 个拖拽手柄的位置样式 */
  const handleStyles: Record<ResizeDirection, React.CSSProperties> = {
    n: { top: -HANDLE_HOVER / 2, left: HANDLE_HOVER, right: HANDLE_HOVER, height: HANDLE_SIZE },
    s: { bottom: -HANDLE_HOVER / 2, left: HANDLE_HOVER, right: HANDLE_HOVER, height: HANDLE_SIZE },
    e: { right: -HANDLE_HOVER / 2, top: HANDLE_HOVER, bottom: HANDLE_HOVER, width: HANDLE_SIZE },
    w: { left: -HANDLE_HOVER / 2, top: HANDLE_HOVER, bottom: HANDLE_HOVER, width: HANDLE_SIZE },
    ne: { top: -HANDLE_HOVER / 2, right: -HANDLE_HOVER / 2, width: HANDLE_SIZE * 2, height: HANDLE_SIZE * 2 },
    nw: { top: -HANDLE_HOVER / 2, left: -HANDLE_HOVER / 2, width: HANDLE_SIZE * 2, height: HANDLE_SIZE * 2 },
    se: { bottom: -HANDLE_HOVER / 2, right: -HANDLE_HOVER / 2, width: HANDLE_SIZE * 2, height: HANDLE_SIZE * 2 },
    sw: { bottom: -HANDLE_HOVER / 2, left: -HANDLE_HOVER / 2, width: HANDLE_SIZE * 2, height: HANDLE_SIZE * 2 },
  };

  const directions: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  const handleElements = directions.map((dir) => (
    <div
      key={dir}
      onPointerDown={onPointerDown(dir)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute',
        zIndex: 10,
        cursor: cursorMap[dir],
        ...handleStyles[dir],
      }}
    />
  ));

  return { containerRef: ref, handleElements };
}
