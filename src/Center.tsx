import React from 'react';

export interface CenterProps extends React.HTMLAttributes<HTMLElement> {
  /** Content to center */
  children?: React.ReactNode;
  /** If set, `inline-flex` display is used instead of `flex` @default false */
  inline?: boolean;
  /** HTML element or React component to render as @default 'div' */
  component?: React.ElementType;
}

/**
 * Centers content vertically and horizontally using flexbox.
 *
 * @example
 * ```tsx
 * <Center style={{ width: 400, height: 200 }}>
 *   <span>Centered content</span>
 * </Center>
 *
 * <Center inline>
 *   <span>Inline centered</span>
 * </Center>
 * ```
 */
export const Center = React.forwardRef<HTMLElement, CenterProps>(
  ({ children, inline = false, component, style, ...rest }, ref) => {
    const Element = component || 'div';

    const centerStyle: React.CSSProperties = {
      display: inline ? 'inline-flex' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    };

    return React.createElement(
      Element,
      { ref, style: centerStyle, ...rest },
      children
    );
  }
);

Center.displayName = 'Center';
