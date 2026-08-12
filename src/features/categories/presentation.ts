export const categoryIconAssets: Record<string, string> = {
  Utensils: "/categories/utensils.svg",
  House: "/categories/home.svg",
  Home: "/categories/home.svg",
  Truck: "/categories/transport.svg",
  Car: "/categories/transport.svg",
  Film: "/categories/entertainment.svg",
  Heart: "/categories/health.svg",
  HeartPulse: "/categories/health.svg",
  Tickets: "/categories/sports.svg",
  Plane: "/categories/travel.svg",
  GraduationCap: "/categories/education.svg",
  ShoppingBag: "/categories/form-shopping.svg",
  Coffee: "/categories/form-coffee.svg",
  Music: "/categories/form-music.svg",
  BriefcaseBusiness: "/categories/form-briefcase.svg",
  Smartphone: "/categories/form-phone.svg",
  Globe: "/categories/form-globe.svg",
  Zap: "/categories/form-zap.svg",
  Box: "/categories/form-box.svg",
};

export const categoryColorStyles: Record<
  string,
  { icon: string; badge: string; accent: string }
> = {
  "bg-amber-100 text-amber-700": {
    icon: "bg-amber-100/70",
    badge: "bg-amber-100/70",
    accent: "#facc15",
  },
  "bg-cyan-100 text-cyan-600": {
    icon: "bg-cyan-100/70",
    badge: "bg-cyan-100/70",
    accent: "#06b6d4",
  },
  "bg-green-100 text-green-600": {
    icon: "bg-green-100/70",
    badge: "bg-green-100/70",
    accent: "#22c55e",
  },
  "bg-red-100 text-red-500": {
    icon: "bg-red-100/70",
    badge: "bg-red-100/70",
    accent: "#ef4444",
  },
  "bg-emerald-100 text-emerald-500": {
    icon: "bg-emerald-100/70",
    badge: "bg-emerald-100/70",
    accent: "#10b981",
  },
  "bg-blue-100 text-blue-500": {
    icon: "bg-blue-100/70",
    badge: "bg-blue-100/70",
    accent: "#3b82f6",
  },
  "bg-orange-100 text-orange-500": {
    icon: "bg-orange-100/70",
    badge: "bg-orange-100/70",
    accent: "#f59e0b",
  },
  "bg-violet-100 text-violet-500": {
    icon: "bg-violet-100/70",
    badge: "bg-violet-100/70",
    accent: "#8b5cf6",
  },
  "bg-pink-100 text-pink-500": {
    icon: "bg-pink-100/70",
    badge: "bg-pink-100/70",
    accent: "#ec4899",
  },
  "bg-amber-100 text-amber-600": {
    icon: "bg-amber-100/70",
    badge: "bg-amber-100/70",
    accent: "#d97706",
  },
  "bg-indigo-100 text-indigo-500": {
    icon: "bg-indigo-100/70",
    badge: "bg-indigo-100/70",
    accent: "#6366f1",
  },
  "bg-slate-100 text-slate-500": {
    icon: "bg-slate-100",
    badge: "bg-slate-100",
    accent: "#64748b",
  },
};

Object.assign(categoryColorStyles, {
  "#facc15": categoryColorStyles["bg-amber-100 text-amber-700"],
  "#ef4444": categoryColorStyles["bg-red-100 text-red-500"],
  "#22c55e": categoryColorStyles["bg-green-100 text-green-600"],
  "#06b6d4": categoryColorStyles["bg-cyan-100 text-cyan-600"],
  "#8b5cf6": categoryColorStyles["bg-violet-100 text-violet-500"],
  "#f59e0b": categoryColorStyles["bg-orange-100 text-orange-500"],
  "#ec4899": categoryColorStyles["bg-pink-100 text-pink-500"],
  "#10b981": categoryColorStyles["bg-emerald-100 text-emerald-500"],
  "#3b82f6": categoryColorStyles["bg-blue-100 text-blue-500"],
  "#d97706": categoryColorStyles["bg-amber-100 text-amber-600"],
  "#6366f1": categoryColorStyles["bg-indigo-100 text-indigo-500"],
  "#64748b": categoryColorStyles["bg-slate-100 text-slate-500"],
});

export const defaultCategoryStyle = {
  icon: "bg-blue-100/70",
  badge: "bg-blue-100/70",
  accent: "#3b82f6",
};

export const formatCategoryCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
