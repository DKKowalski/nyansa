import { LegalPage } from "../legal";

export const metadata = { title: "Terms and Conditions" };

/** Placeholder until the reviewed Terms are ready. */
export default function Terms() {
  return (
    <LegalPage title="Terms and Conditions" points={[
      ["Who can use Nyansa", ["Students of any age. Students under 18 need a parent or guardian to agree to these terms for them.", "Parents and guardians can make accounts for their children and are responsible for them."]],
      ["Your account", ["Keep your password to yourself. Parents can reset a child's password.", "Tell us if you think someone else is using your account."]],
      ["Using Nyansa fairly", ["Use the lessons and the tutor to learn, not to cheat in a real exam.", "Be kind in anything you write."]],
    ]} />
  );
}
