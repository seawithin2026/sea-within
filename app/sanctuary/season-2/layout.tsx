import ScrollCue from "../ScrollCue";
import { useScrollProgress } from "../useScrollProgress";

export default function Season2Layout({ children }) {
  const scrollProgress = useScrollProgress();

  return (
    <div className="season2-layout">
      {children}
      <ScrollCue scrollProgress={scrollProgress} />
    </div>
  );
}
