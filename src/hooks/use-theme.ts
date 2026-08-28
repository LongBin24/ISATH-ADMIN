"use client";

import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";

export interface ToggleThemeOptions {
  x?: number;
  y?: number;
  target?: HTMLElement | null;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme: Theme =
      storedTheme === "dark" || storedTheme === "light"
        ? (storedTheme as Theme)
        : systemPrefersDark
          ? "dark"
          : "light";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(initialTheme);
    setMounted(true);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const changeTheme = useCallback(
    async (
      targetTheme: Theme,
      trigger?:
        | React.MouseEvent
        | MouseEvent
        | HTMLElement
        | ToggleThemeOptions
        | null
    ) => {
      if (typeof window === "undefined") return;
      if (isToggling) return;

      // Extract radial origin coordinates originating from the click/element
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (trigger) {
        if (
          "clientX" in trigger &&
          typeof trigger.clientX === "number" &&
          (trigger.clientX > 0 || trigger.clientY > 0)
        ) {
          x = trigger.clientX;
          y = trigger.clientY;
        } else if (
          "currentTarget" in trigger &&
          trigger.currentTarget instanceof HTMLElement
        ) {
          const rect = trigger.currentTarget.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else if (
          "target" in trigger &&
          trigger.target instanceof HTMLElement
        ) {
          const rect = trigger.target.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else if (
          "getBoundingClientRect" in trigger &&
          typeof (trigger as HTMLElement).getBoundingClientRect === "function"
        ) {
          const rect = (trigger as HTMLElement).getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else if (
          "x" in trigger &&
          typeof trigger.x === "number" &&
          "y" in trigger &&
          typeof trigger.y === "number"
        ) {
          x = trigger.x;
          y = trigger.y;
        }
      }

      setIsToggling(true);

      const updateDOM = () => {
        document.documentElement.classList.toggle("dark", targetTheme === "dark");
        document.documentElement.setAttribute("data-theme", targetTheme);
        window.localStorage.setItem("theme", targetTheme);
        setThemeState(targetTheme);
      };

      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (
        typeof doc.startViewTransition === "function" &&
        !prefersReducedMotion
      ) {
        try {
          document.documentElement.classList.add("theme-transitioning");

          const transition = doc.startViewTransition(() => {
            updateDOM();
          });

          await transition.ready;

          // Calculate radius to the furthest corner of viewport
          const right = window.innerWidth - x;
          const bottom = window.innerHeight - y;
          const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

          // Smooth circular radial reveal originating from the theme-toggle button (600-800ms)
          const animation = document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 700, // 700ms smooth reveal
              easing: "cubic-bezier(0.4, 0, 0.2, 1)", // ease-in-out curve
              pseudoElement: "::view-transition-new(root)",
            }
          );

          await animation.finished;
        } catch {
          updateDOM();
        } finally {
          document.documentElement.classList.remove("theme-transitioning");
          setIsToggling(false);
        }
      } else {
        // Instant/smooth fallback for environments without View Transitions API
        updateDOM();
        setIsToggling(false);
      }
    },
    [isToggling]
  );

  const toggleTheme = useCallback(
    (
      trigger?:
        | React.MouseEvent
        | MouseEvent
        | HTMLElement
        | ToggleThemeOptions
        | null
    ) => {
      const nextTheme: Theme = theme === "dark" ? "light" : "dark";
      return changeTheme(nextTheme, trigger);
    },
    [theme, changeTheme]
  );

  const setTheme = useCallback(
    (
      newTheme: Theme,
      trigger?:
        | React.MouseEvent
        | MouseEvent
        | HTMLElement
        | ToggleThemeOptions
        | null
    ) => {
      if (newTheme === theme) return Promise.resolve();
      return changeTheme(newTheme, trigger);
    },
    [theme, changeTheme]
  );

  return {
    theme,
    mounted,
    isToggling,
    toggleTheme,
    setTheme,
  };
}
