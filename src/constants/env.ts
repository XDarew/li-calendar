import { isTauri } from '../utils/platform.ts';

interface SoftInfo {
  appName: string;
  appVersion: string;
  tauriVersion: string;
  os: string;
  osArch: string;
  osVersion: string;
}

export let SOFT_INFO: SoftInfo;

export async function initEnv() {
  if (!isTauri) {
    SOFT_INFO = {
      appName: 'li-calendar',
      appVersion: '0.0.0',
      tauriVersion: '',
      os: navigator.platform || 'unknown',
      osArch: navigator.userAgent || 'unknown',
      osVersion: '',
    };
    return;
  }

  const { getName, getVersion, getTauriVersion } = await import('@tauri-apps/api/app');
  const { arch, platform, version } = await import('@tauri-apps/plugin-os');

  SOFT_INFO = {
    appName: await getName(),
    appVersion: await getVersion(),
    tauriVersion: await getTauriVersion(),
    os: platform(),
    osArch: arch(),
    osVersion: version(),
  };
}
