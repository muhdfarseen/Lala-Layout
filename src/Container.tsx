import React from 'react';
import type { LalaSpacing } from './types';
import { useLayoutConfig } from './context';
import { resolveSpacing } from './utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `max-width` of the container. Named sizes ('xs'|'sm'|'md'|'lg'|'xl'), numbers (rem), or CSS strings. @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | (string & {});
  /** If set, container takes 100% width and `size` is ignored @default false */
  fluid?: boolean;
  /** Centering strategy @default 'block' */
  strategy?: 'block' | 'grid';
  /** Children */
  children?: React.ReactNode;
}

/**
 * Centers content horizontally with `max-width` and optional padding.
 *
 * @example
 * ```tsx
 * <Container size="lg">
 *   <p>Centered content with max-width</p>
 * </Container>
 *
 * <Container fluid>
 *   <p>Full width container</p>
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, size = 'md', fluid = false, strategy = 'block', style, ...rest }, ref) => {
    const config = useLayoutConfig();

    // Resolve container size
    let maxWidth: string | undefined;
    if (!fluid) {
      if (typeof size === 'number') {
        maxWidth = `${size / 16}rem`;
      } else if (size in config.containerSizes) {
        maxWidth = config.containerSizes[size as keyof typeof config.containerSizes];
      } else {
        maxWidth = size;
      }
    }

    const containerStyle: React.CSSProperties =
      strategy === 'grid'
        ? {
            display: 'grid',
            justifyContent: 'center',
            maxWidth: fluid ? '100%' : maxWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            ...style,
          }
        : {
            maxWidth: fluid ? '100%' : maxWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            ...style,
          };

    return React.createElement(
      'div',
      { ref, style: containerStyle, ...rest },
      children
    );
  }
);

Container.displayName = 'Container';
