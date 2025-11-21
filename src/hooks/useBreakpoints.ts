import { useState, useEffect } from "react";
import { BREAKPOINTS, Breakpoint } from "../constants/breakpoints";

export function useBreakpoints(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => 
    getCurrentBreakpoint()
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    
    handleResize();

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return breakpoint;
}

function getCurrentBreakpoint(): Breakpoint {
  const width = window.innerWidth;

  if (width >= BREAKPOINTS.largeDesktop) {
    return "largeDesktop";
  }
  if (width >= BREAKPOINTS.desktop) {
    return "desktop";
  }
  if (width >= BREAKPOINTS.tablet) {
    return "tablet";
  }
  if (width >= BREAKPOINTS.mobile) {
    return "mobile";
  }
  
  return "mobile";
}
