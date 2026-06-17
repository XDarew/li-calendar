import type { CalendarViewStyleContext } from './types.ts';

export function createCalendarGridStyles(ctx: CalendarViewStyleContext) {
  const { css, cx, isDark } = ctx;

  const lunar = css`
    font-size: var(--font-size-sm);
    color: ${isDark ? '#999999' : '#707070'};
    line-height: 1.2;
    margin-top: 2px;
  `;
  const term = css`
    color: ${isDark ? '#81c784' : '#2e7d32'};
    font-weight: 600;
  `;

  return {
    calendarGrid: css`
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      justify-items: center;
      align-items: center;
      padding: 4px 0;
    `,
    weekday: css`
      text-align: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--text-sec);
      padding: 6px 0;
      opacity: 0.85;
    `,
    cell: css`
      width: 100%;
      aspect-ratio: 1;
      max-width: 44px;
      max-height: 44px;
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 50%;
      transition: background 0.15s ease;
      cursor: pointer;
      position: relative;
      padding: 2px;
      color: var(--text-main);

      &:hover {
        background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
      }
    `,
    otherMonth: css`
      color: ${isDark ? '#666666' : '#bfbfbf'};
    `,
    today: css`
      background: var(--accent);
      color: ${isDark ? '#000000' : '#ffffff'};

      .${cx(lunar)} {
        color: ${isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)'};
      }

      .${cx(term)} {
        color: ${isDark ? '#000000' : '#ffffff'};
      }

      /* 覆盖 .cell 的灰底 hover：保持强调色底，整体略提亮作为反馈（不叠灰底） */
      &:hover {
        background: var(--accent);
        filter: brightness(1.07);
      }
    `,
    selected: css`
      box-shadow: inset 0 0 0 1px var(--accent);
      border-radius: 50%;
    `,
    dateText: css`
      font-size: var(--font-size-base);
      font-weight: 500;
      line-height: 1.2;
    `,
    lunar,
    term,
    tag: css`
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: var(--font-size-xs);
      min-width: 14px;
      height: 14px;
      padding: 0 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      z-index: 1;
      border-radius: 7px;
      line-height: 1;
    `,
    tagWork: css`
      background: ${isDark ? '#4d2d2f' : '#fde7e9'};
      color: ${isDark ? '#ff9999' : '#a80000'};
    `,
    tagRest: css`
      background: ${isDark ? '#2d4d2d' : '#dff6dd'};
      color: ${isDark ? '#99ff99' : '#107c10'};
    `,
  };
}
