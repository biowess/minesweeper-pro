import { useState, useEffect, useRef, MutableRefObject } from 'react';

export function useMeasure<T extends HTMLElement>(): { ref: MutableRefObject<T | null>, bounds: { width: number, height: number } } {
  const ref = useRef<T>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const current = ref.current;
    
    const rect = current.getBoundingClientRect();
    setBounds({ width: rect.width, height: rect.height });
    
    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    
    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  return { ref, bounds };
}
