"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;

export const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className = "", ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={`sheet-overlay ${className}`}
      {...props}
    />
  );
});

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "right" | "left";
  }
>(function SheetContent({ className = "", side = "right", children, ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={`sheet-content sheet-content--${side} ${className}`}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
