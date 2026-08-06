import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = "inline-flex min-h-11 items-center justify-center rounded-token bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60";
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) { return <button {...props} className={cn(styles, props.className)} />; }
export function ButtonLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) { return <Link {...props} className={cn(styles, className)} />; }
