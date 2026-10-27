import { LegalPage } from "../legal";

export const metadata = { title: "Privacy Policy" };

/** Placeholder until the reviewed Privacy Policy is ready. */
export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" points={[
      ["What we collect", ["Your name, date of birth, school level, username, and your phone number or email.", "For students under 18: their parent or guardian's name and phone number or email.", "Your study progress: lessons, answers and mock results."]],
      ["Why", ["To run your account, build your study plan and send codes and reports.", "Your date of birth only decides whether a parent needs to agree. We never show it to anyone."]],
      ["Your choices", ["We never sell your data or show it to other students.", "You, or your parent if you're under 18, can ask us to see or delete your data at any time."]],
    ]} />
  );
}
