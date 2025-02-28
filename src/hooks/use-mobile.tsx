
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Avoid server-side rendering issues
    if (typeof window === 'undefined') return;
    
    // Create the media query once
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Initial check
    setIsMobile(mediaQuery.matches);
    
    // Handler function
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}
