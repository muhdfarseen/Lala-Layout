import React from 'react';

// ─── Spacing ────────────────────────────────────────────────────────────────────

/** Named spacing sizes */
export type LalaSpacingName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Spacing value: named size, number (converted to rem), or arbitrary CSS string */
export type LalaSpacing = LalaSpacingName | number | (string & {});

/** Default spacing scale */
export type SpacingScale = Record<LalaSpacingName, string>;

// ─── Responsive Style Props ─────────────────────────────────────────────────────

/** Breakpoint names */
export type LalaBreakpointName = 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Breakpoint pixel values */
export type BreakpointScale = Record<Exclude<LalaBreakpointName, 'base'>, string>;

/** A value that can be responsive — either a single value or an object keyed by breakpoint */
export type StyleProp<T> = T | Partial<Record<LalaBreakpointName, T>>;

// ─── Container Sizes ────────────────────────────────────────────────────────────

export type ContainerSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ContainerSizeScale = Record<ContainerSizeName, string>;

// ─── Grid ───────────────────────────────────────────────────────────────────────

/** Column span value */
export type ColSpan = number | 'auto' | 'content';

// ─── Polymorphic ────────────────────────────────────────────────────────────────

/**
 * Props for polymorphic components (supports `component` prop to change element type)
 */
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = Props &
  Omit<React.ComponentPropsWithRef<C>, keyof Props | 'component'> & {
    /** HTML element or React component to render as */
    component?: C;
  };

// ─── Common ─────────────────────────────────────────────────────────────────────

/** Common layout props shared by most components */
export interface CommonLayoutProps {
  /** Additional CSS class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Children */
  children?: React.ReactNode;
}
