import React from 'react';
import type { LalaSpacing } from './types';
import { useLayoutConfig } from './context';
import { resolveSpacing, filterFalsyChildren } from './utils';

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controls `justify-content` CSS property @default 'flex-start' */
  justify?: React.CSSProperties['justifyContent'];
  /** Controls `align-items` CSS property @default 'center' */
  align?: React.CSSProperties['alignItems'];
  /** Controls `flex-wrap` CSS property @default 'wrap' */
  wrap?: React.CSSProperties['flexWrap'];
  /** Key of spacing or any valid CSS value for `gap` @default 'md' */
  gap?: LalaSpacing;
  /** If true, each child gets `flex-grow: 1` @default false */
  grow?: boolean;
  /** Prevents children from growing beyond content when `grow` is true @default true */
  preventGrowOverflow?: boolean;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Horizontal flex group — arranges children in a row with configurable gap, wrapping, and grow behavior.
 * Automatically filters out falsy children (null, undefined, false).
 *
 * @example
 * ```tsx
 * <Group gap="lg" justify="space-between">
 *   <Button>Left</Button>
 *   <Button>Right</Button>
 * </Group>
 *
 * <Group grow>
 *   <Button>Equal</Button>
 *   <Button>Width</Button>
 *   <Button>Buttons</Button>
 * </Group>
 * ```
 */
export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  (
    {
      children,
      justify = 'flex-start',
      align = 'center',
      wrap = 'wrap',
      gap = 'md',
      grow = false,
      preventGrowOverflow = true,
      style,
      ...rest
    },
    ref
  ) => {
    const config = useLayoutConfig();
    const resolvedGap = resolveSpacing(gap, config.spacing);
    const filteredChildren = filterFalsyChildren(children);

    const groupStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      gap: resolvedGap,
      ...style,
    };

    // If grow is enabled, wrap each child to apply flex-grow
    const wrappedChildren = grow
      ? filteredChildren.map((child, index) =>
          React.createElement(
            'div',
            {
              key: (child as React.ReactElement).key ?? index,
              style: {
                flexGrow: 1,
                ...(preventGrowOverflow
                  ? {
                      maxWidth: `calc(${100 / filteredChildren.length}% - (${resolvedGap} - ${resolvedGap} / ${filteredChildren.length}))`,
                    }
                  : {}),
              },
            },
            child
          )
        )
      : children;

    return React.createElement(
      'div',
      { ref, style: groupStyle, ...rest },
      wrappedChildren
    );
  }
);

Group.displayName = 'Group';
