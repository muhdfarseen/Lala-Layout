import React, { createContext, useContext } from 'react';
import type { SpacingScale, BreakpointScale, ContainerSizeScale } from './types';

// ─── Default Scales ─────────────────────────────────────────────────────────────

export const DEFAULT_SPACING: SpacingScale = {
  xs: '0.625rem',  // 10px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.25rem',   // 20px
  xl: '2rem',      // 32px
};

export const DEFAULT_BREAKPOINTS: BreakpointScale = {
  xs: '36em',    // 576px
  sm: '48em',    // 768px
  md: '62em',    // 992px
  lg: '75em',    // 1200px
  xl: '88em',    // 1408px
};

export const DEFAULT_CONTAINER_SIZES: ContainerSizeScale = {
  xs: '33.75rem',  // 540px
  sm: '45rem',     // 720px
  md: '60rem',     // 960px
  lg: '71.25rem',  // 1140px
  xl: '82.5rem',   // 1320px
};

// ─── Context ────────────────────────────────────────────────────────────────────

export interface LayoutConfig {
  /** Spacing scale. Keys: xs, sm, md, lg, xl. Values: CSS length strings. */
  spacing: SpacingScale;
  /** Breakpoint scale. Keys: xs, sm, md, lg, xl. Values: CSS width strings (em). */
  breakpoints: BreakpointScale;
  /** Container size scale. Keys: xs, sm, md, lg, xl. Values: CSS max-width strings. */
  containerSizes: ContainerSizeScale;
}

const defaultConfig: LayoutConfig = {
  spacing: DEFAULT_SPACING,
  breakpoints: DEFAULT_BREAKPOINTS,
  containerSizes: DEFAULT_CONTAINER_SIZES,
};

const LayoutContext = createContext<LayoutConfig>(defaultConfig);

export interface LayoutProviderProps {
  children: React.ReactNode;
  /** Override spacing scale (merged with defaults) */
  spacing?: Partial<SpacingScale>;
  /** Override breakpoints (merged with defaults) */
  breakpoints?: Partial<BreakpointScale>;
  /** Override container sizes (merged with defaults) */
  containerSizes?: Partial<ContainerSizeScale>;
}

/**
 * Provider to customize spacing, breakpoints, and container sizes.
 * Wraps your app (or part of it) to override defaults.
 *
 * @example
 * ```tsx
 * <LayoutProvider spacing={{ md: '1.5rem' }}>
 *   <App />
 * </LayoutProvider>
 * ```
 */
export function LayoutProvider({
  children,
  spacing,
  breakpoints,
  containerSizes,
}: LayoutProviderProps) {
  const config: LayoutConfig = {
    spacing: { ...DEFAULT_SPACING, ...spacing },
    breakpoints: { ...DEFAULT_BREAKPOINTS, ...breakpoints },
    containerSizes: { ...DEFAULT_CONTAINER_SIZES, ...containerSizes },
  };

  return React.createElement(LayoutContext.Provider, { value: config }, children);
}

/** Hook to access the current layout config */
export function useLayoutConfig(): LayoutConfig {
  return useContext(LayoutContext);
}
