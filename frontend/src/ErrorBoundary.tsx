import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: 24,
            background: "#0b0f14",
            color: "white",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          <h2 style={{ marginTop: 0 }}>App crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error.stack || this.state.error.message)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
