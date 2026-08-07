import "@fontsource/google-sans/400.css";
import "@fontsource/google-sans/500.css";
import "@fontsource/google-sans/700.css";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}