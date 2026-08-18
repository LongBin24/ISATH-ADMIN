"use client";

import * as React from "react";

let activeModalCount = 0;
let originalOverflow = "";
let originalPaddingRight = "";

/**
 * Custom hook to lock body scrolling when a popup modal, dialog, or sheet is open.
 * Supports multiple nested modals without prematurely unlocking body scroll.
 */
export function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    if (activeModalCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }
    activeModalCount += 1;

    return () => {
      activeModalCount = Math.max(0, activeModalCount - 1);
      if (activeModalCount === 0) {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);
}
