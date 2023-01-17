const { useEffect, useState } = require("react");

export function useIntersectionObserver(ref, handleIntersecting) {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        handleIntersecting(entry.isIntersecting)
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, handleIntersecting]);

  return { isIntersecting }
}