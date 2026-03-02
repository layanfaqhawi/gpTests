import GraphPlayground from "./GraphPlayground";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: 16,
      }}
    >
      <div>APP IS MOUNTED</div>
      <GraphPlayground />
    </div>
  );
}
