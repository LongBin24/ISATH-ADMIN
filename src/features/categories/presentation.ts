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
};

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
