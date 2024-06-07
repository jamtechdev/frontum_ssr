import { useEffect } from "react";
import { useState } from "react";

const useScreenSize = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width <= 992; // Adjust breakpoint as needed
  const isSmallDevice = width <= 768;

  return { width, isMobile, isSmallDevice };
};

export default useScreenSize;
