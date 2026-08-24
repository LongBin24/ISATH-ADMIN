"use client";

import { createElement, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return createElement(
    Provider as unknown as React.ComponentType<{ store: typeof store }>,
    { store },
    children
  );
}
