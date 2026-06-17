import type { CalendarViewStyleContext } from './types.ts';

export function createCalendarNavStyles(ctx: CalendarViewStyleContext) {
  const { css, isDark } = ctx;

  return {
    calendarNav: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 0 2px;
    `,
    navTitle: css`
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-main);
    `,
    navBtns: css`
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 10px;
      color: var(--text-sec);
    `,
    /** 仅使用本文件生成的 class（`&&` 提权），不写字面量 `ant-btn`，避免「类名未使用」静态检查误报 */
    navBtn: css`
      && {
        color: var(--text-main);
      }

      &&:not(:disabled):hover {
        color: var(--text-main);
        background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
      }
    `,
    todayBtn: css`
      && {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-bold);
      }
    `,
  };
}
