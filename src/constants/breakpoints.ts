export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1280,
} as const;

export const MEDIA_QUERIES = {
  mobile: `(min-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  largeDesktop: `(min-width: ${BREAKPOINTS.largeDesktop}px)`,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
