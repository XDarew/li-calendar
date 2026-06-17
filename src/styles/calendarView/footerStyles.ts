import type { CalendarViewStyleContext } from './types.ts';

export function createCalendarFooterStyles(ctx: CalendarViewStyleContext) {
  const { css, isDark } = ctx;

  return {
    footerInfo: css`
      margin-top: 14px;
      padding: 14px 16px;
      background: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-width: 0;
    `,
    footerMain: css`
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-width: 0;
    `,
    lunarInfo: css`
      display: flex;
      flex-direction: column;
      gap: 2px;
    `,
    lunarDay: css`
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    `,
    lunarYear: css`
      font-size: var(--font-size-sm);
      color: var(--text-sec);
      margin-top: 2px;
    `,
    yiJiContainer: css`
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    `,
    yiJiItem: css`
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: var(--font-size-base);
      min-width: 0;
    `,
    yiJiBadge: css`
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
      margin-top: 1px;
      border-radius: 50%;
    `,
    yiBadge: css`
      background: #e6f4ea;
      color: #1e8e3e;
      ${
        isDark &&
        css`
        background: #1e3a2f;
        color: #81c784;
      `
      }
    `,
    jiBadge: css`
      background: #fce8e6;
      color: #d93025;
      ${
        isDark &&
        css`
        background: #3c1e1e;
        color: #f28b82;
      `
      }
    `,
    yiJiText: css`
      color: var(--text-main);
      line-height: 1.5;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    `,
    footerDivider: css`
      height: 1px;
      background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
      margin: 0 -4px;
    `,
    countdown: css`
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-base);
      color: var(--text-sec);
      line-height: 1.5;
    `,
    countdownIcon: css`
      font-size: 16px;
      opacity: 0.7;
      flex-shrink: 0;
    `,
  };
}
