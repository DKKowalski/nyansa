// Full-screen tasks (lesson, practice question, mock exam): no navigation, content centred on web.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="focus" style={{ display: "contents" }}>{children}</div>;
}
