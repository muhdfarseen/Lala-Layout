import React, { useRef, useEffect } from 'react';
import type {
  LalaSpacing,
  LalaSpacingName,
  LalaBreakpointName,
  StyleProp,
  SpacingScale,
  BreakpointScale,
} from './types';
import { DEFAULT_SPACING, DEFAULT_BREAKPOINTS } from './context';

// ─── Spacing Resolution ─────────────────────────────────────────────────────────

const SPACING_NAMES: LalaSpacingName[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Resolves a LalaSpacing value to a CSS string.
 * - Named sizes ('xs' → '0.625rem') are looked up in the spacing scale.
 * - Numbers are converted to rem.
 * - Strings are passed through as-is.
 */
export function resolveSpacing(
  value: LalaSpacing | undefined,
  spacing: SpacingScale = DEFAULT_SPACING
): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value / 16}rem`;
  if (SPACING_NAMES.includes(value as LalaSpacingName)) {
    return spacing[value as LalaSpacingName];
  }
  return value;
}

// ─── Rem Helper ─────────────────────────────────────────────────────────────────

/** Converts a number to rem, or passes a string through */
export function rem(value: number | string | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value / 16}rem`;
  return value;
}

// ─── Filter Falsy Children ──────────────────────────────────────────────────────

/**
 * Filters out null, undefined, false, and empty string children.
 * Returns an array of valid React elements.
 */
export function filterFalsyChildren(
  children: React.ReactNode
): React.ReactElement[] {
  return React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child)
  );
}

// ─── Responsive Style Props ─────────────────────────────────────────────────────

const BREAKPOINT_ORDER: LalaBreakpointName[] = ['base', 'xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Checks if a StyleProp value is a responsive object (has breakpoint keys).
 */
export function isResponsive<T>(value: StyleProp<T>): value is Partial<Record<LalaBreakpointName, T>> {
  if (value === null || value === undefined || typeof value !== 'object') return false;
  if (Array.isArray(value)) return false;
  // React elements are objects too — filter them out
  if (React.isValidElement(value)) return false;
  const keys = Object.keys(value);
  return keys.some((key) => BREAKPOINT_ORDER.includes(key as LalaBreakpointName));
}

/**
 * Extracts the "base" (non-responsive) value from a StyleProp.
 * If the value is not responsive, returns it directly.
 * If responsive, returns the 'base' key value (or undefined).
 */
export function getBaseValue<T>(value: StyleProp<T> | undefined): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (isResponsive(value)) {
    return (value as Partial<Record<LalaBreakpointName, T>>).base;
  }
  return value as T;
}

// ─── Responsive CSS Injection ───────────────────────────────────────────────────

export interface ResponsiveRule {
  /** CSS property name (e.g. 'gap', 'grid-template-columns') */
  property: string;
  /** StyleProp value (could be responsive) */
  value: StyleProp<string | number | undefined> | undefined;
  /** Optional transform function for the value */
  transform?: (val: string | number) => string;
}

/**
 * Generates CSS text for responsive style props.
 * Returns a string of CSS with media queries, scoped to the given className.
 */
export function generateResponsiveCSS(
  className: string,
  rules: ResponsiveRule[],
  breakpoints: BreakpointScale = DEFAULT_BREAKPOINTS
): string {
  // Collect rules per breakpoint
  const breakpointRules: Record<string, string[]> = {};

  for (const rule of rules) {
    if (rule.value === undefined || rule.value === null) continue;

    if (isResponsive(rule.value)) {
      const responsiveValue = rule.value as Partial<Record<LalaBreakpointName, string | number>>;

      for (const bp of BREAKPOINT_ORDER) {
        const val = responsiveValue[bp];
        if (val === undefined || val === null) continue;
        const cssVal = rule.transform ? rule.transform(val) : String(val);
        if (!breakpointRules[bp]) breakpointRules[bp] = [];
        breakpointRules[bp].push(`${rule.property}:${cssVal}`);
      }
    }
    // Non-responsive values handled via inline styles, skip here
  }

  // Build CSS string
  let css = '';

  // Base rules (no media query)
  if (breakpointRules.base?.length) {
    css += `.${className}{${breakpointRules.base.join(';')}}\n`;
  }

  // Breakpoint rules
  for (const bp of BREAKPOINT_ORDER) {
    if (bp === 'base') continue;
    if (!breakpointRules[bp]?.length) continue;
    const minWidth = breakpoints[bp as Exclude<LalaBreakpointName, 'base'>];
    css += `@media(min-width:${minWidth}){.${className}{${breakpointRules[bp].join(';')}}}\n`;
  }

  return css;
}

// ─── useResponsiveStyles Hook ───────────────────────────────────────────────────

let styleIdCounter = 0;

/**
 * Hook that injects responsive CSS into the document head and returns a
 * unique className. Only injects a <style> tag when responsive values are present.
 */
export function useResponsiveStyles(
  rules: ResponsiveRule[],
  breakpoints: BreakpointScale = DEFAULT_BREAKPOINTS
): string | undefined {
  const classNameRef = useRef<string | undefined>(undefined);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Check if any rules actually use responsive syntax
  const hasResponsive = rules.some((r) => r.value !== undefined && isResponsive(r.value));

  if (hasResponsive && !classNameRef.current) {
    classNameRef.current = `ll-${(++styleIdCounter).toString(36)}`;
  }

  useEffect(() => {
    if (!hasResponsive || !classNameRef.current) return;

    const css = generateResponsiveCSS(classNameRef.current, rules, breakpoints);
    if (!css) return;

    const style = document.createElement('style');
    style.setAttribute('data-lala-layout', classNameRef.current);
    style.textContent = css;
    document.head.appendChild(style);
    styleRef.current = style;

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  });

  return hasResponsive ? classNameRef.current : undefined;
}

// ─── Class Name Merge ───────────────────────────────────────────────────────────

/** Merges multiple className values, filtering out falsy values */
export function cx(...classes: (string | undefined | null | false)[]): string | undefined {
  const result = classes.filter(Boolean).join(' ');
  return result || undefined;
}
