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

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  /** `gap` CSS property */
  gap?: StyleProp<LalaSpacing>;
  /** `row-gap` CSS property */
  rowGap?: StyleProp<LalaSpacing>;
  /** `column-gap` CSS property */
  columnGap?: StyleProp<LalaSpacing>;
  /** `align-items` CSS property */
  align?: StyleProp<React.CSSProperties['alignItems']>;
  /** `justify-content` CSS property */
  justify?: StyleProp<React.CSSProperties['justifyContent']>;
  /** `flex-wrap` CSS property */
  wrap?: StyleProp<React.CSSProperties['flexWrap']>;
  /** `flex-direction` CSS property */
  direction?: StyleProp<React.CSSProperties['flexDirection']>;
  /** Children */
  children?: React.ReactNode;
  /** HTML element or React component to render as @default 'div' */
  component?: React.ElementType;
}

/**
 * Flexbox container with convenient shorthand props.
 * All layout props support responsive values.
 *
 * @example
 * ```tsx
 * <Flex gap="md" align="center" justify="space-between">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Flex>
 *
 * // Responsive
 * <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: 'sm', md: 'lg' }}>
 *   <div>A</div>
 *   <div>B</div>
 * </Flex>
 * ```
 */
export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  (
    {
      children,
      gap,
      rowGap,
      columnGap,
      align,
      justify,
      wrap,
      direction,
      component,
      style,
      className,
      ...rest
    },
    ref
  ) => {
    const Element = component || 'div';
    const config = useLayoutConfig();
    const spacingTransform = (v: string | number) => resolveSpacing(v as LalaSpacing, config.spacing) || String(v);

    // Build responsive rules
    const rules: ResponsiveRule[] = [
      { property: 'gap', value: gap as StyleProp<string | number | undefined>, transform: spacingTransform },
      { property: 'row-gap', value: rowGap as StyleProp<string | number | undefined>, transform: spacingTransform },
      { property: 'column-gap', value: columnGap as StyleProp<string | number | undefined>, transform: spacingTransform },
      { property: 'align-items', value: align as StyleProp<string | number | undefined> },
      { property: 'justify-content', value: justify as StyleProp<string | number | undefined> },
      { property: 'flex-wrap', value: wrap as StyleProp<string | number | undefined> },
      { property: 'flex-direction', value: direction as StyleProp<string | number | undefined> },
    ];

    const responsiveClassName = useResponsiveStyles(rules, config.breakpoints);

    // Build inline styles from base/non-responsive values
    const flexStyle: React.CSSProperties = {
      display: 'flex',
      ...(getBaseValue(gap) !== undefined && {
        gap: resolveSpacing(getBaseValue(gap) as LalaSpacing, config.spacing),
      }),
      ...(getBaseValue(rowGap) !== undefined && {
        rowGap: resolveSpacing(getBaseValue(rowGap) as LalaSpacing, config.spacing),
      }),
      ...(getBaseValue(columnGap) !== undefined && {
        columnGap: resolveSpacing(getBaseValue(columnGap) as LalaSpacing, config.spacing),
      }),
      ...(getBaseValue(align) !== undefined && { alignItems: getBaseValue(align) }),
      ...(getBaseValue(justify) !== undefined && { justifyContent: getBaseValue(justify) }),
      ...(getBaseValue(wrap) !== undefined && { flexWrap: getBaseValue(wrap) }),
      ...(getBaseValue(direction) !== undefined && { flexDirection: getBaseValue(direction) }),
      ...style,
    };

    return React.createElement(
      Element,
      {
        ref,
        style: flexStyle,
        className: cx(responsiveClassName, className),
        ...rest,
      },
      children
    );
  }
);

Flex.displayName = 'Flex';
