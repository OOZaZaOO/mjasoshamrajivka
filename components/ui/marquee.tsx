"use client";

import { useEffect, useState, type ReactNode } from "react";
import FastMarquee from "react-fast-marquee";

type MarqueeProps = {
  children: ReactNode;
  label: string;
  className?: string;
  speed?: number;
};

export function Marquee({ children, label, className = "", speed = 45 }: MarqueeProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const content = <span className="marquee__item" aria-hidden="true">{children}</span>;

  return (
    <div className={`marquee ${className}`} role="img" aria-label={label}>
      {reducedMotion ? (
        <div className="marquee__static">{content}</div>
      ) : (
        <FastMarquee autoFill direction="left" gradient={false} pauseOnHover={false} speed={speed}>
          {content}
        </FastMarquee>
      )}
    </div>
  );
}
