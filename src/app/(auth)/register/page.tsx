import { redirect } from "next/navigation";

// Self-registration is disabled for the admin portal: accounts are
// provisioned in Keycloak and must carry the ADMIN role (enforced in
// /api/keycloak/callback). Send anyone who lands here to sign-in instead.
export default function RegisterPage() {
  redirect("/login");
}
