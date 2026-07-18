import React from 'react';
import type { LalaSpacing, StyleProp } from './types';
import { useLayoutConfig } from './context';
import {
  resolveSpacing,
  getBaseValue,
  isResponsive,
  useResponsiveStyles,
  cx,
  type ResponsiveRule,
} from './utils';

export interface SimpleGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns @default 1 */
  cols?: StyleProp<number>;
  /** Spacing between columns @default 'md' */
  spacing?: StyleProp<LalaSpacing>;
  /** Spacing between rows. Falls back to `spacing` if not set */
  verticalSpacing?: StyleProp<LalaSpacing>;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Simple equal-width grid using CSS Grid.
 * All props support responsive values.
 *
 * @example
 * ```tsx
 * <SimpleGrid cols={3} spacing="lg">
 *   <div>1</div>
 *   <div>2</div>
 *   <div>3</div>
 * </SimpleGrid>
 *
 * // Responsive
 * <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
 *   <div>A</div>
 *   <div>B</div>
 *   <div>C</div>
 *   <div>D</div>
 * </SimpleGrid>
 * ```
 */
export const SimpleGrid = React.forwardRef<HTMLDivElement, SimpleGridProps>(
  (
    {
      children,
      cols = 1,
      spacing = 'md',
      verticalSpacing,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const config = useLayoutConfig();
    const spacingTransform = (v: string | number) =>
      resolveSpacing(v as LalaSpacing, config.spacing) || String(v);
    const colsTransform = (v: string | number) =>
      `repeat(${v}, minmax(0, 1fr))`;

    // Build responsive rules
    const rules: ResponsiveRule[] = [
      {
        property: 'grid-template-columns',
        value: cols as StyleProp<string | number | undefined>,
        transform: colsTransform,
      },
      {
        property: 'column-gap',
        value: spacing as StyleProp<string | number | undefined>,
        transform: spacingTransform,
      },
      {
        property: 'row-gap',
        value: (verticalSpacing ?? spacing) as StyleProp<string | number | undefined>,
        transform: spacingTransform,
      },
    ];

    const responsiveClassName = useResponsiveStyles(rules, config.breakpoints);

    // Base values
    const baseCols = getBaseValue(cols) ?? 1;
    const baseSpacing = resolveSpacing(getBaseValue(spacing) as LalaSpacing, config.spacing);
    const baseVerticalSpacing = verticalSpacing
      ? resolveSpacing(getBaseValue(verticalSpacing) as LalaSpacing, config.spacing)
      : baseSpacing;

    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${baseCols}, minmax(0, 1fr))`,
      columnGap: baseSpacing,
      rowGap: baseVerticalSpacing,
      ...style,
    };

    return React.createElement(
      'div',
      {
        ref,
        style: gridStyle,
        className: cx(responsiveClassName, className),
        ...rest,
      },
      children
    );
  }
);

SimpleGrid.displayName = 'SimpleGrid';
