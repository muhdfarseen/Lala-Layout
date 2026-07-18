import React from 'react';
import type { LalaSpacing } from './types';
import { useLayoutConfig } from './context';
import { resolveSpacing } from './utils';

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the space element */
  w?: LalaSpacing;
  /** Height of the space element */
  h?: LalaSpacing;
}

/**
 * Adds empty space between elements.
 * Use `h` for vertical space and `w` for horizontal space.
 *
 * @example
 * ```tsx
 * <div>Above</div>
 * <Space h="md" />
 * <div>Below (16px gap)</div>
 *
 * <span>Left</span>
 * <Space w="xl" />
 * <span>Right (32px gap)</span>
 * ```
 */
export const Space = React.forwardRef<HTMLDivElement, SpaceProps>(
  ({ w, h, style, ...rest }, ref) => {
    const config = useLayoutConfig();

    const spaceStyle: React.CSSProperties = {
      ...(w !== undefined && {
        width: resolveSpacing(w, config.spacing),
        minWidth: resolveSpacing(w, config.spacing),
      }),
      ...(h !== undefined && {
        height: resolveSpacing(h, config.spacing),
        minHeight: resolveSpacing(h, config.spacing),
      }),
      ...style,
    };

    return React.createElement('div', { ref, style: spaceStyle, ...rest });
  }
);

Space.displayName = 'Space';
