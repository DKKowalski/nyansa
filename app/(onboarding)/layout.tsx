import { OnboardingShell } from "@/components/shells";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
