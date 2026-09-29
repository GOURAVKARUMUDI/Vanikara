/**
 * Re-mounts on every navigation, so each page arrives with a short
 * fade-and-rise (see .page-enter in motion.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
