import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Section({ children, className, id }: PropsWithChildren<{ className?: string; id?: string }>) { return <section id={id} className={cn("py-16 sm:py-24", className)}>{children}</section>; }
