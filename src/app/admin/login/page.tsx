import { redirect } from "next/navigation";

export const metadata = {
  title: "Console Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginRedirect() {
  redirect("/login?next=/admin");
}
