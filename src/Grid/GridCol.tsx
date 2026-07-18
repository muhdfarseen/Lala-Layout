import React from 'react';
import type { ColSpan, StyleProp } from '../types';
import { useGridContext } from './GridContext';
import { useLayoutConfig } from '../context';
import {
  resolveSpacing,
  getBaseValue,
  isResponsive,
  useResponsiveStyles,
  cx,
  type ResponsiveRule,
} from '../utils';
import type { LalaSpacing } from '../types';

export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span @default 12 */
  span?: StyleProp<ColSpan>;
  /** Column order */
  order?: StyleProp<number>;
  /** Number of empty columns before this column */
  offset?: StyleProp<number>;
  /** Children */
  children?: React.ReactNode;
}

function resolveSpan(span: ColSpan, columns: number): string {
  if (span === 'auto') return 'auto';
  if (span === 'content') return 'max-content';
  if (typeof span === 'number') {
    // Percentage based on column count
    return `${(span / columns) * 100}%`;
  }
  return 'auto';
}

function resolveOffset(offset: number, columns: number): string {
  return `${(offset / columns) * 100}%`;
}

/**
 * Grid column — must be a direct child of `<Grid>`.
 *
 * @example
 * ```tsx
 * <Grid>
 *   <Grid.Col span={6}>Half width</Grid.Col>
 *   <Grid.Col span={6}>Half width</Grid.Col>
 * </Grid>
 *
 * <Grid>
 *   <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>Responsive</Grid.Col>
 * </Grid>
 * ```
 */
export const GridCol = React.forwardRef<HTMLDivElement, GridColProps>(
  ({ children, span = 12, offset, order, style, className, ...rest }, ref) => {
    const gridCtx = useGridContext();
    const config = useLayoutConfig();
    const { columns, grow } = gridCtx;

    // Build responsive rules for span, offset, order
    const responsiveRules: ResponsiveRule[] = [];

    if (isResponsive(span)) {
      const spanObj = span as Partial<Record<string, ColSpan>>;
      // Convert span responsive to flex/width responsive
      const widthResponsive: Record<string, string> = {};
      const flexResponsive: Record<string, string> = {};
      for (const [bp, val] of Object.entries(spanObj)) {
        if (val !== undefined) {
          if (val === 'auto') {
            widthResponsive[bp] = 'auto';
            flexResponsive[bp] = '1 0 0px';
          } else if (val === 'content') {
            widthResponsive[bp] = 'max-content';
            flexResponsive[bp] = '0 0 auto';
          } else {
            const pct = `${(val / columns) * 100}%`;
            widthResponsive[bp] = pct;
            flexResponsive[bp] = grow ? `1 0 ${pct}` : `0 0 ${pct}`;
          }
        }
      }
      responsiveRules.push({ property: 'max-width', value: widthResponsive as any });
      responsiveRules.push({ property: 'flex', value: flexResponsive as any });
    }

    if (offset !== undefined && isResponsive(offset)) {
      const offsetObj = offset as Partial<Record<string, number>>;
      const mlResponsive: Record<string, string> = {};
      for (const [bp, val] of Object.entries(offsetObj)) {
        if (val !== undefined) {
          mlResponsive[bp] = resolveOffset(val, columns);
        }
      }
      responsiveRules.push({ property: 'margin-left', value: mlResponsive as any });
    }

    if (order !== undefined && isResponsive(order)) {
      responsiveRules.push({ property: 'order', value: order as any });
    }

    const responsiveClassName = useResponsiveStyles(responsiveRules, config.breakpoints);

    // Base values
    const baseSpan = getBaseValue(span) ?? 12;
    const baseOffset = getBaseValue(offset);
    const baseOrder = getBaseValue(order);

    const resolvedSpan = resolveSpan(baseSpan, columns);
    const isAuto = baseSpan === 'auto';
    const isContent = baseSpan === 'content';

    const colStyle: React.CSSProperties = {
      boxSizing: 'border-box',
      ...(isAuto
        ? { flex: '1 0 0px', maxWidth: 'auto' }
        : isContent
          ? { flex: '0 0 auto', maxWidth: 'max-content' }
          : {
              flex: grow ? `1 0 ${resolvedSpan}` : `0 0 ${resolvedSpan}`,
              maxWidth: resolvedSpan,
            }),
      ...(baseOffset !== undefined && {
        marginLeft: resolveOffset(baseOffset, columns),
      }),
      ...(baseOrder !== undefined && { order: baseOrder }),
      ...style,
    };

    return React.createElement(
      'div',
      {
        ref,
        style: colStyle,
        className: cx(responsiveClassName, className),
        ...rest,
      },
      children
    );
  }
);

GridCol.displayName = 'Grid.Col';
