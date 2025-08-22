import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      // Check screen width
      const isSmallScreen = window.innerWidth <= 768;

      // Check user agent for mobile devices
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Consider it mobile if either condition is true
      setIsMobile(isSmallScreen || isMobileUserAgent);
    };

    // Check initially
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return { isMobile, isClient };
}
