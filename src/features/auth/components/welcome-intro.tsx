"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  FileText,
  LayoutGrid,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCog,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/features/profile/api";
import { useTheme } from "@/hooks/use-theme";
import { useLocale, type Locale } from "@/hooks/use-locale";
import { useSignOut } from "@/features/auth/hook";
import { LanguageFlag } from "@/components/ui/LanguageFlag";
import styles from "./welcome-intro.module.css";

function checkAdminRole(): boolean {
  if (typeof window === "undefined") return true;
  const token =
    window.localStorage.getItem("accessToken") ||
    window.localStorage.getItem("token") ||
    window.sessionStorage.getItem("accessToken") ||
    window.sessionStorage.getItem("token");

  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));
    const realmRoles = (decoded.realm_access?.roles || []).map((r: unknown) =>
      String(r).toUpperCase(),
    );
    const clientRoles = Object.values(decoded.resource_access || {})
      .flatMap((resource) => {
        const roles = (resource as { roles?: unknown[] })?.roles;
        return Array.isArray(roles) ? roles : [];
      })
      .map((r: unknown) => String(r).toUpperCase());
    const allRoles = [...realmRoles, ...clientRoles];
    return (
      allRoles.includes("ADMIN") ||
      allRoles.includes("ADMINISTRATOR") ||
      allRoles.includes("SUPER_ADMIN") ||
      allRoles.includes("MANAGE-USERS")
    );
  } catch {
    return true;
  }
}

type LocalizedText = Record<Locale, string>;

type FeatureCard = {
  title: LocalizedText;
  description: LocalizedText;
  href: string;
  icon: LucideIcon;
  angle: number;
  iconClass: string;
  forceIconLeft?: boolean;
};

const copy = {
  fallbackName: { en: "Admin", km: "អ្នកគ្រប់គ្រង" },
  chip: { en: "Signed in successfully", km: "ចូលប្រើដោយជោគជ័យ" },
  heading: { en: "Welcome back", km: "សូមស្វាគមន៍ត្រឡប់មកវិញ" },
  intro: {
    en: "You are entering the iStash Admin Portal. Here you can manage, monitor, and keep the system secure and running smoothly.",
    km: "អ្នកកំពុងចូលទៅកាន់ iStash Admin Portal។ នៅទីនេះអ្នកអាចគ្រប់គ្រង តាមដាន និងថែរក្សាសុវត្ថិភាពប្រព័ន្ធបានយ៉ាងងាយស្រួល។",
  },
  ctaButton: { en: "Go to Admin Dashboard", km: "ចូលទៅផ្ទាំងគ្រប់គ្រង" },
  or: { en: "or", km: "ឬ" },
  logout: { en: "Log out", km: "ចាកចេញ" },
} satisfies Record<string, LocalizedText>;

// Angles (degrees, 0 = due right, clockwise) place each card on the orbit
// ring. Slightly uneven offsets per hemisphere keep the arrangement feeling
// organic rather than a rigid mirrored hexagon.
const allFeatures: FeatureCard[] = [
  {
    title: { en: "System Overview", km: "ទិដ្ឋភាពទូទៅប្រព័ន្ធ" },
    description: {
      en: "Monitor key metrics and system health in real time.",
      km: "តាមដានសូចនាករសំខាន់ៗ និងស្ថានភាពប្រព័ន្ធជាបន្តបន្ទាប់។",
    },
    href: "/dashboard",
    icon: Wallet,
    angle: -132,
    iconClass: "bg-[#3B82F6] text-white",
  },
  {
    title: { en: "User Management", km: "គ្រប់គ្រងអ្នកប្រើប្រាស់" },
    description: {
      en: "Manage users, roles, permissions and access.",
      km: "គ្រប់គ្រងអ្នកប្រើប្រាស់ តួនាទី និងសិទ្ធិចូលប្រើប្រព័ន្ធ។",
    },
    href: "/user-manager",
    icon: UserCog,
    angle: 178,
    iconClass: "bg-[#10B981] text-white",
  },
  {
    title: { en: "Reports & Analytics", km: "របាយការណ៍ និងវិភាគ" },
    description: {
      en: "View reports and analytics to make data-driven decisions.",
      km: "មើលរបាយការណ៍ និងវិភាគទិន្នន័យ ដើម្បីជួយសម្រេចចិត្តបានត្រឹមត្រូវ។",
    },
    href: "/reports",
    icon: BarChart3,
    angle: 132,
    iconClass: "bg-[#9333EA] text-white",
  },
  {
    title: { en: "Notifications", km: "ការជូនដំណឹង" },
    description: {
      en: "View notifications, delivery status and retry failures.",
      km: "តាមដានការជូនដំណឹង ស្ថានភាពដឹកជញ្ជូន និងព្យាយាមផ្ញើឡើងវិញ។",
    },
    href: "/notifications",
    icon: Bell,
    angle: -48,
    iconClass: "border border-[#FEDB55]/25 bg-[#0C1727] text-[#FEDB55]",
  },
  {
    title: { en: "Alert Rules", km: "រំឭក" },
    description: {
      en: "Monitor alert rules across all users and system.",
      km: "តាមដានការរំឭកសម្រាប់អ្នកប្រើប្រាស់ និងប្រព័ន្ធទាំងមូល។",
    },
    href: "/alert",
    icon: FileText,
    angle: 8,
    iconClass: "bg-[#F97316] text-white",
  },
  {
    title: { en: "System Security", km: "សុវត្ថិភាពប្រព័ន្ធ" },
    description: {
      en: "Review security logs and keep the system protected.",
      km: "ត្រួតពិនិត្យកំណត់ត្រាសុវត្ថិភាព និងការពារប្រព័ន្ធជានិច្ច។",
    },
    href: "/settings",
    icon: ShieldCheck,
    angle: 48,
    iconClass: "bg-[#14B8A6] text-white",
    forceIconLeft: true,
  },
];

const ORBIT_RADIUS = 210;

function orbitOffset(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(Math.cos(rad) * ORBIT_RADIUS),
    y: Math.round(Math.sin(rad) * ORBIT_RADIUS),
  };
}

function getCalcPosition(offset: number): string {
  return offset < 0
    ? `calc(50% - ${Math.abs(offset)}px)`
    : `calc(50% + ${offset}px)`;
}

const reveal: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.3 + index * 0.1,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const MotionLink = motion(Link);

function OrbitCard({
  feature,
  index,
  locale,
}: {
  feature: FeatureCard;
  index: number;
  locale: Locale;
}) {
  const reducedMotion = useReducedMotion();
  const Icon = feature.icon;
  const { x, y } = orbitOffset(feature.angle);
  const isLeft = feature.forceIconLeft ? false : x < 0;

  return (
    <div
      style={{
        left: getCalcPosition(x),
        top: getCalcPosition(y),
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <MotionLink
        href={feature.href}
        custom={index}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
        whileHover={{ y: -3 }}
        transition={{
          y: {
            duration: 4 + index * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
          },
          default: { duration: 0.25, ease: "easeOut" },
        }}
        className="group block"
      >
        <div
          className={`flex items-center gap-4 ${isLeft ? "flex-row-reverse text-right" : "text-left"}`}
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-[0_6px_16px_-6px_rgba(2,6,23,.35)] transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(254,219,85,.28)] ${feature.iconClass}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="w-[190px] rounded-[20px] border border-slate-200/70 bg-white px-4 py-3 shadow-[0_10px_28px_-20px_rgba(2,6,23,.2)] transition-colors duration-300 group-hover:border-[#FEDB55]/50 dark:border-[#1D2B3D] dark:bg-[#0C1727] dark:group-hover:border-[#FEDB55]/40">
            <h3 className="text-[14px] font-semibold leading-5 text-[#0F172A] dark:text-[#F8FAFC]">
              {feature.title[locale]}
            </h3>
            <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.2rem] text-slate-500 dark:text-[#94A3B8]">
              {feature.description[locale]}
            </p>
          </div>
        </div>
      </MotionLink>
    </div>
  );
}

export default function WelcomeIntro() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { data: profile } = useGetProfileQuery();
  const signOut = useSignOut();
  const { theme, mounted: themeMounted, toggleTheme } = useTheme();
  const { locale, mounted: localeMounted, setLocale } = useLocale();
  const displayName = profile?.displayName || copy.fallbackName[locale];

  useEffect(() => {
    if (!checkAdminRole()) {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("idToken");
      window.sessionStorage.removeItem("accessToken");
      window.sessionStorage.removeItem("token");
      document.cookie = "accessToken=; Max-Age=0; path=/";
      router.replace("/login?authError=unauthorized&status=403");
    }
  }, [router]);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden overflow-y-auto bg-[linear-gradient(135deg,#f8fafc_0%,#f2f6fb_48%,#f8fafc_100%)] px-4 pb-6 pt-20 text-slate-900 transition-colors duration-500 dark:bg-[radial-gradient(circle_at_50%_-10%,#0a1830_0%,#050D1B_55%)] dark:text-[#F8FAFC] sm:px-8 sm:pb-8 sm:pt-24 lg:justify-center lg:px-6 lg:py-5">
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-7 sm:top-7">
        <div
          className="flex items-center gap-0.5 rounded-full border border-slate-200/70 bg-white/80 p-1 text-xs font-bold shadow-sm backdrop-blur dark:border-[#1D2B3D] dark:bg-[#071221]/90"
          role="group"
          aria-label="Language"
        >
          {(["en", "km"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLocale(option)}
              aria-pressed={localeMounted && locale === option}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 transition ${
                localeMounted && locale === option
                  ? "bg-[#003377] text-[#FFC83D] dark:bg-[#FEDB55] dark:text-[#050D1B]"
                  : "text-slate-500 hover:text-[#003377] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
              }`}
            >
              <LanguageFlag locale={option} className="w-4 h-3" />
              <span className="text-xs font-semibold">{option === "en" ? "EN" : "ខ្មែរ"}</span>
            </button>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="grid size-9 place-items-center rounded-full border border-slate-200/70 bg-white/80 text-[#003377] shadow-sm backdrop-blur transition hover:rotate-6 hover:bg-[#FFC83D] dark:border-[#1D2B3D] dark:bg-[#071221]/90 dark:text-[#FEDB55]"
          aria-label="Toggle dark mode"
        >
          {themeMounted && theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="mx-auto w-full max-w-[700px] text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[#003377]/10 bg-[#003377]/[0.035] px-4 py-2 text-xs font-semibold text-[#003377]/70 dark:border-[#1D2B3D] dark:bg-[#071221] dark:text-[#94A3B8]">
          <Sparkles
            className="size-4 text-[#e3a400] dark:text-[#FEDB55]"
            aria-hidden="true"
          />
          {copy.chip[locale]}
        </span>
        <h1
          className="hero-heading mt-4 text-[#003377] dark:text-[#F8FAFC] sm:mt-6 lg:mt-4"
          style={{ fontSize: "32px" }}
        >
          {copy.heading[locale]}, {displayName}!
        </h1>
        <p className="mx-auto mt-2 max-w-[700px] text-sm leading-6 text-slate-500 dark:text-[#94A3B8] font-normal">
          {copy.intro[locale]}
        </p>
      </motion.div>

      <div className="relative mx-auto mt-5 aspect-square w-full max-w-[280px] lg:hidden">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[86%] max-w-[250px] -translate-x-1/2 -translate-y-1/2">
          <svg
            viewBox="0 0 500 500"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {/* inner thin static ring — purely decorative */}
            <circle
              cx="250"
              cy="250"
              r="130"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#003377]/10 dark:text-[#1D2B3D]"
            />

            {/* middle blue dotted orbit — purely decorative */}
            <motion.g
              animate={reducedMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "250px 250px" }}
            >
              <circle
                cx="250"
                cy="250"
                r="190"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeDasharray="1 12"
                strokeLinecap="round"
                opacity=".5"
              />
              <circle cx="250" cy="60" r="3.5" fill="#3B82F6" opacity=".9" />
            </motion.g>

            {/* outer yellow ring — the cards orbit this outside layer */}
            <motion.g
              animate={reducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "250px 250px" }}
            >
              <circle
                cx="250"
                cy="250"
                r="248"
                fill="none"
                stroke="#FEDB55"
                strokeWidth="2"
                strokeDasharray="60 40 10 60"
                strokeLinecap="round"
                opacity=".45"
              />
              <circle cx="250" cy="2" r="4.5" fill="#FEDB55" />
            </motion.g>
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 0.5 },
              scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
            }}
            className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[20px] border border-[#003377]/10 bg-white shadow-[0_16px_36px_-18px_rgba(0,0,0,.3)] dark:border-[#FEDB55]/20 dark:bg-white"
          >
            <Image
              src="/iStash-logo (3).png"
              alt="iStash"
              width={72}
              height={72}
              className="h-9 w-9"
              priority
            />
          </motion.div>
        </div>

      </div>

      <div className={`mx-auto hidden lg:block ${styles.orbitViewport}`}>
        <div className={styles.orbitScene}>
          <div className="absolute left-1/2 top-1/2 aspect-square w-[420px] -translate-x-1/2 -translate-y-1/2">
            <svg
              viewBox="0 0 500 500"
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <circle cx="250" cy="250" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#003377]/10 dark:text-[#1D2B3D]" />
              <motion.g animate={reducedMotion ? undefined : { rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "250px 250px" }}>
                <circle cx="250" cy="250" r="190" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="1 12" strokeLinecap="round" opacity=".5" />
                <circle cx="250" cy="60" r="3.5" fill="#3B82F6" opacity=".9" />
              </motion.g>
              <motion.g animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "250px 250px" }}>
                <circle cx="250" cy="250" r="248" fill="none" stroke="#FEDB55" strokeWidth="2" strokeDasharray="60 40 10 60" strokeLinecap="round" opacity=".45" />
                <circle cx="250" cy="2" r="4.5" fill="#FEDB55" />
              </motion.g>
            </svg>

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.5 },
                scale: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
              }}
              className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] border border-[#003377]/10 bg-white shadow-[0_16px_36px_-18px_rgba(0,0,0,.3)] dark:border-[#FEDB55]/20 dark:bg-white"
            >
              <Image src="/iStash-logo (3).png" alt="iStash" width={72} height={72} className="h-12 w-12" priority />
            </motion.div>
          </div>

          {allFeatures.map((feature, index) => (
            <OrbitCard
              key={feature.href}
              feature={feature}
              index={index}
              locale={locale}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-5 grid w-full max-w-2xl gap-3 lg:hidden">
        {allFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 dark:border-[#1D2B3D] dark:bg-[#0C1727]"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${feature.iconClass}`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {feature.title[locale]}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-[#94A3B8]">
                  {feature.description[locale]}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-5 flex w-full max-w-md flex-col items-center gap-3 sm:mt-6 lg:mt-4">
        <Link
          href="/dashboard"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-[0_16px_32px_-16px_rgba(37,99,235,.6)] transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 dark:bg-[#FEDB55] dark:text-[#050D1B] dark:shadow-[0_16px_32px_-16px_rgba(254,219,85,.4)] dark:hover:bg-[#ffe27a] dark:focus-visible:ring-[#FEDB55]/30"
        >
          <LayoutGrid className="size-4" />
          {copy.ctaButton[locale]}
          <ArrowRight className="size-4" />
        </Link>
        <p className="text-sm text-slate-500 dark:text-[#94A3B8]">
          {copy.or[locale]}{" "}
          <button
            type="button"
            onClick={() => signOut()}
            className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-[#FEDB55] dark:hover:text-[#ffe27a]"
          >
            {copy.logout[locale]}
          </button>
        </p>
      </div>
    </main>
  );
}
