"use client";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, y = 16 }: PropsWithChildren<{ className?: string; y?: number }>) {
  const ref = useRef<HTMLDivElement>(null); const [visible, setVisible] = useState(false);
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 }); observer.observe(node); return () => observer.disconnect(); }, []);
  return <div ref={ref} className={cn("transition-[opacity,transform] duration-700 motion-reduce:!transform-none motion-reduce:!transition-none", visible ? "translate-y-0 opacity-100" : "opacity-0", className)} style={{ transform: visible ? undefined : `translateY(${y}px)` }}>{children}</div>;
}
