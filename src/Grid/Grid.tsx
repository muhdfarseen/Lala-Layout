import React from 'react';
import type { LalaSpacing, StyleProp } from '../types';
import { useLayoutConfig } from '../context';
import { GridProvider, type GridContextValue } from './GridContext';
import { GridCol } from './GridCol';
import {
  resolveSpacing,
  getBaseValue,
  isResponsive,
  useResponsiveStyles,
  cx,
  type ResponsiveRule,
} from '../utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns in each row @default 12 */
  columns?: number;
  /** Gap between columns and rows @default 'md' */
  gap?: StyleProp<LalaSpacing>;
  /** Row gap, overrides `gap` for vertical spacing */
  rowGap?: StyleProp<LalaSpacing>;
  /** Column gap, overrides `gap` for horizontal spacing */
  columnGap?: StyleProp<LalaSpacing>;
  /** If set, columns in the last row expand to fill available space @default false */
  grow?: boolean;
  /** `justify-content` CSS property @default 'flex-start' */
  justify?: React.CSSProperties['justifyContent'];
  /** `align-items` CSS property @default 'stretch' */
  align?: React.CSSProperties['alignItems'];
  /** Content overflow @default 'visible' */
  overflow?: 'visible' | 'hidden';
  /** Children — should be `<Grid.Col>` elements */
  children?: React.ReactNode;
}

/**
 * 12-column responsive grid system using flexbox.
 * Use `<Grid.Col>` as children to define columns.
 *
 * @example
 * ```tsx
 * <Grid>
 *   <Grid.Col span={4}>One third</Grid.Col>
 *   <Grid.Col span={4}>One third</Grid.Col>
 *   <Grid.Col span={4}>One third</Grid.Col>
 * </Grid>
 *
 * <Grid columns={24} gap="lg">
 *   <Grid.Col span={8}>One third of 24</Grid.Col>
 *   <Grid.Col span={16}>Two thirds of 24</Grid.Col>
 * </Grid>
 * ```
 */
const GridRoot = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      columns = 12,
      gap = 'md',
      rowGap,
      columnGap,
      grow = false,
      justify = 'flex-start',
      align = 'stretch',
      overflow = 'visible',
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const config = useLayoutConfig();
    const spacingTransform = (v: string | number) =>
      resolveSpacing(v as LalaSpacing, config.spacing) || String(v);

    // Build responsive rules for the inner flex container
    const rules: ResponsiveRule[] = [
      { property: 'gap', value: gap as StyleProp<string | number | undefined>, transform: spacingTransform },
      { property: 'row-gap', value: rowGap as StyleProp<string | number | undefined>, transform: spacingTransform },
      { property: 'column-gap', value: columnGap as StyleProp<string | number | undefined>, transform: spacingTransform },
    ];

    const responsiveClassName = useResponsiveStyles(rules, config.breakpoints);

    // Context for Grid.Col children
    const ctxValue: GridContextValue = {
      columns,
      gap,
      grow,
      overflow,
    };

    const gridStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: justify,
      alignItems: align,
      overflow,
      ...(getBaseValue(gap) !== undefined && {
        gap: resolveSpacing(getBaseValue(gap) as LalaSpacing, config.spacing),
      }),
      ...(getBaseValue(rowGap) !== undefined && {
        rowGap: resolveSpacing(getBaseValue(rowGap) as LalaSpacing, config.spacing),
      }),
      ...(getBaseValue(columnGap) !== undefined && {
        columnGap: resolveSpacing(getBaseValue(columnGap) as LalaSpacing, config.spacing),
      }),
      ...style,
    };

    return React.createElement(
      GridProvider,
      { value: ctxValue },
      React.createElement(
        'div',
        {
          ref,
          style: gridStyle,
          className: cx(responsiveClassName, className),
          ...rest,
        },
        children
      )
    );
  }
);

GridRoot.displayName = 'Grid';

// Compound component pattern: Grid.Col
export const Grid = Object.assign(GridRoot, { Col: GridCol });
export type { GridColProps } from './GridCol';
