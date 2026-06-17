import { trayClockDateFormats, trayClockTimeFormats } from '../enums/trayClockEnum.ts';
import { createSync } from './base/crossWindowSync.ts';
import type {
  CalendarFooterVisible,
  CalendarFontConfig,
  ConfigItem,
  ConfigMacos,
  ConfigWindows,
  SystemConfig,
} from './type/configTypes.ts';

/** `satisfies`：字面量须符合对应类型，写错字符串会在编译期报错，无需 `as` 断言 */
const systemConfigDefaults = {
  autostart: false,
  theme: 'light',
  calendarPinned: false,
  windowWidth: 320,
  windowHeight: 0,
} satisfies SystemConfig;

const calendarFooterVisibleDefaults = {
  calendarFooterVisible: true,
  footerFestivalVisible: true,
  footerYiJiVisible: false,
  footerCountdownVisible: true,
} satisfies CalendarFooterVisible;

export const calendarFontDefaults = {
  fontSize: 13,
  fontFamily: 'system-ui',
  fontWeight: 400,
  fontWeightBold: 600,
  textColor: '',
  textColorSecondary: '',
} satisfies CalendarFontConfig;

const configWindowsDefaults = {
  desktopWidgetEnabled: true,
  taskbarWidgetEnabled: true,
  desktopWindowPosition: null,
  customTrayClockEnabled: true,
  timeFormat: trayClockTimeFormats.HhMm,
  dateFormat: trayClockDateFormats.DddYmd,
} satisfies ConfigWindows;

const configMacosDefaults = {
  isWindowsEffect: false,
  macosEffect: 'vibrancy',
  frontendWindowEffectEnabled: false,
  frontendWindowEffect: 'transparent',
  frontendWindowTransparency: 20,
  macosTrayTitleTemplate: '',
  macosTrayBarIcon: 'date',
  macosTrayDateIconStyle: 'filled',
  macosTrayIconWidth: 42,
  macosTrayIconHeight: 36,
} satisfies ConfigMacos;

const configDefaults: ConfigItem = {
  ...systemConfigDefaults,
  ...calendarFooterVisibleDefaults,
  ...calendarFontDefaults,
  ...configWindowsDefaults,
  ...configMacosDefaults,
};

export const useConfigSync = createSync<ConfigItem>('liConfig', configDefaults);
