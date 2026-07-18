import React from 'react';
import type { LalaSpacing } from './types';
import { useLayoutConfig } from './context';
import { resolveSpacing } from './utils';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Key of spacing or any valid CSS value for `gap` @default 'md' */
  gap?: LalaSpacing;
  /** Controls `align-items` CSS property @default 'stretch' */
  align?: React.CSSProperties['alignItems'];
  /** Controls `justify-content` CSS property @default 'flex-start' */
  justify?: React.CSSProperties['justifyContent'];
  /** Children */
  children?: React.ReactNode;
}

/**
 * Vertical flex stack — arranges children in a column with configurable gap.
 *
 * @example
 * ```tsx
 * <Stack gap="lg">
 *   <div>First</div>
 *   <div>Second</div>
 *   <div>Third</div>
 * </Stack>
 *
 * <Stack align="center" gap="xl">
 *   <h1>Title</h1>
 *   <p>Subtitle</p>
 * </Stack>
 * ```
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      gap = 'md',
      align = 'stretch',
      justify = 'flex-start',
      style,
      ...rest
    },
    ref
  ) => {
    const config = useLayoutConfig();

    const stackStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align,
      justifyContent: justify,
      gap: resolveSpacing(gap, config.spacing),
      ...style,
    };

    return React.createElement(
      'div',
      { ref, style: stackStyle, ...rest },
      children
    );
  }
);

Stack.displayName = 'Stack';
