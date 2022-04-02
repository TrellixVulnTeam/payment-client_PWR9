import { CHECK_BOX_WIDTH, ColumnSticky, TableHeaderProps } from '.';

export function getCellStyle(
  stickyColumn: boolean,
  header: TableHeaderProps[],
  width: number | string,
  sticky: ColumnSticky,
  columnIdx: number,
  hasCheckboxes?: boolean,
) {
  if (typeof width === 'string') return {};

  let offset = 0;
  if (sticky === 'left') {
    for (let i = 0; i < columnIdx; i++) {
      let col = header[i];
      if (col.sticky === sticky && typeof col.width === 'number') {
        let width = col.width || 0;
        offset += width;
      }
    }

    if (stickyColumn && hasCheckboxes) {
      offset += CHECK_BOX_WIDTH;
    }
  }

  if (sticky === 'right') {
    for (let i = columnIdx + 1; i < header.length; i++) {
      let col = header[i];
      if (col.sticky === sticky && typeof col.width === 'number') {
        let width = col.width || 0;
        offset += width;
      }
    }
  }

  let widthStyle: React.CSSProperties = {
    width: width,
    maxWidth: width,
  };
  let stickyStyle: React.CSSProperties = {
    left: sticky === 'left' && stickyColumn ? offset : undefined,
    right: sticky === 'right' && stickyColumn ? offset : undefined,
  };
  return { ...widthStyle, ...stickyStyle };
}
