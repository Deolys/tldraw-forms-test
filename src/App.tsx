import { TldrawOverride } from "./components/tldraw/tldraw-override";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <TldrawOverride />
    </div>
  );
}
