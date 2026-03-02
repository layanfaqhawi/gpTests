import * as d3 from "d3";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

type AdjacencyList = Record<string, string[]>;

type NodeDatum = {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  locked?: boolean;
};

type LinkDatum = {
  source: string | NodeDatum;
  target: string | NodeDatum;
};

const DEFAULT_INPUT = `{
  "A": ["B", "C"],
  "B": ["A", "D"],
  "C": ["A"],
  "D": ["B"]
}`;

function safeParseAdjacency(
  text: string,
): { ok: true; value: AdjacencyList } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: 'Expected an object like { "A": ["B","C"] }' };
    }
    for (const [k, v] of Object.entries(parsed)) {
      if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) {
        return {
          ok: false,
          error: `Value for "${k}" must be an array of strings.`,
        };
      }
    }
    return { ok: true, value: parsed as AdjacencyList };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Invalid JSON" };
  }
}

// Undirected, de-duplicate edges
function adjacencyToGraph(adj: AdjacencyList): {
  nodes: NodeDatum[];
  links: LinkDatum[];
} {
  const nodeSet = new Set<string>();
  const edgeSet = new Set<string>();

  for (const [u, neighbors] of Object.entries(adj)) {
    nodeSet.add(u);
    for (const v of neighbors) {
      nodeSet.add(v);
      const a = u < v ? u : v;
      const b = u < v ? v : u;
      edgeSet.add(`${a}--${b}`);
    }
  }

  const nodes = Array.from(nodeSet)
    .sort()
    .map((id) => ({ id, locked: false }));
  const links = Array.from(edgeSet).map((k) => {
    const [source, target] = k.split("--");
    return { source, target };
  });

  return { nodes, links };
}

export default function GraphPlayground() {
  const [text, setText] = useState(DEFAULT_INPUT);
  const parsed = useMemo(() => safeParseAdjacency(text), [text]);

  const graph = useMemo(() => {
    if (!parsed.ok)
      return { nodes: [] as NodeDatum[], links: [] as LinkDatum[] };
    return adjacencyToGraph(parsed.value);
  }, [parsed]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const simRef = useRef<d3.Simulation<NodeDatum, undefined> | null>(null);

  const width = 860;
  const height = 560;
  const nodeRadius = 18;

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove(); // simple: wipe and redraw each time

    if (!graph.nodes.length) return;

    // Create groups
    const gLinks = svg.append("g").attr("class", "links").attr("opacity", 0.85);
    const gNodes = svg.append("g").attr("class", "nodes");
    const gLabels = svg.append("g").attr("class", "labels");

    // D3 will mutate node positions -> keep a mutable copy
    const nodes = graph.nodes.map((n) => ({ ...n }));
    const links = graph.links.map((l) => ({ ...l }));

    // Create link elements (D3 owns them)
    const linkSel = gLinks
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(255,255,255,0.25)")
      .attr("stroke-width", 2);

    // Create node elements
    const nodeSel = gNodes
      .selectAll("circle")
      .data(nodes, (d: any) => d.id)
      .join("circle")
      .attr("r", nodeRadius)
      .attr("fill", "rgba(99,102,241,0.35)")
      .attr("stroke", "rgba(255,255,255,0.35)")
      .attr("stroke-width", 1.5)
      .style("cursor", "grab");

    // Labels
    const labelSel = gLabels
      .selectAll("text")
      .data(nodes, (d: any) => d.id)
      .join("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "white")
      .attr("font-size", 12)
      .style("user-select", "none")
      .style("pointer-events", "none");

    // Force simulation (same pattern as your example)
    const simulation = d3
      .forceSimulation<NodeDatum>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, any>(links)
          .id((d) => d.id)
          .distance(120)
          .strength(0.8),
      )
      .force("charge", d3.forceManyBody().strength(-450))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(nodeRadius * 1.6))
      .force("boundary", () => {
        for (const n of nodes) {
          n.x = Math.max(
            nodeRadius,
            Math.min(width - nodeRadius, n.x ?? width / 2),
          );
          n.y = Math.max(
            nodeRadius,
            Math.min(height - nodeRadius, n.y ?? height / 2),
          );
        }
      });

    simRef.current = simulation;

    // Drag behavior (THIS is the same logic style your example uses)
    const drag = d3
      .drag<SVGCircleElement, NodeDatum>()
      .container(() => svgEl)
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.25).restart();
        d.fx = d.x ?? width / 2;
        d.fy = d.y ?? height / 2;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (!d.locked) {
          d.fx = null;
          d.fy = null;
        }
      });

    nodeSel.call(drag);

    // Tick update: update D3 elements every tick (no React rerender)
    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => (d.source as NodeDatum).x ?? width / 2)
        .attr("y1", (d: any) => (d.source as NodeDatum).y ?? height / 2)
        .attr("x2", (d: any) => (d.target as NodeDatum).x ?? width / 2)
        .attr("y2", (d: any) => (d.target as NodeDatum).y ?? height / 2);

      nodeSel
        .attr("cx", (d) => d.x ?? width / 2)
        .attr("cy", (d) => d.y ?? height / 2);

      labelSel
        .attr("x", (d) => d.x ?? width / 2)
        .attr("y", (d) => d.y ?? height / 2);
    });

    simulation.alpha(1).restart();

    return () => {
      simulation.stop();
    };
  }, [graph.nodes, graph.links]);

  const error = !parsed.ok ? parsed.error : null;

  return (
    <div style={styles.page}>
      <motion.div
        style={styles.panel}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Graph Playground</div>
            <div style={styles.subtitle}>
              D3 owns SVG (like your example) → dragging always works.
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={styles.button}
              onClick={() => setText(DEFAULT_INPUT)}
            >
              Reset
            </button>
            <button
              style={styles.button}
              onClick={() => {
                simRef.current?.alpha(1).restart();
              }}
            >
              Reheat
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <motion.div
            style={styles.left}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div style={styles.label}>Adjacency List (JSON)</div>
            <textarea
              style={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div style={styles.hint}>
              Drag nodes inside the graph area. (D3 drag is attached to
              circles.)
            </div>
            {error ? (
              <div style={styles.error}>{error}</div>
            ) : (
              <div style={styles.stats}>
                <div>
                  <b>Nodes:</b> {graph.nodes.length}
                </div>
                <div>
                  <b>Edges:</b> {graph.links.length}
                </div>
              </div>
            )}
          </motion.div>

          <div style={styles.right}>
            <div style={styles.canvasWrap}>
              <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ display: "block", touchAction: "none" }}
              />
            </div>
            <div style={styles.hintRight}>
              Tip: If nodes overlap, drag one away — the simulation re-balances.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 18,
    background: "#0b0f14",
    color: "white",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
  },
  panel: {
    maxWidth: 1300,
    margin: "0 auto",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    padding: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  title: { fontSize: 20, fontWeight: 700 },
  subtitle: { fontSize: 13, opacity: 0.75, marginTop: 2 },
  button: {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "380px 1fr", gap: 12 },
  left: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 12,
    background: "rgba(0,0,0,0.2)",
  },
  right: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 12,
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: { fontSize: 13, opacity: 0.85, marginBottom: 8 },
  textarea: {
    width: "100%",
    height: 270,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    color: "white",
    padding: 10,
    resize: "vertical",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    lineHeight: 1.5,
    outline: "none",
  },
  hint: { marginTop: 10, fontSize: 12, opacity: 0.65 },
  hintRight: { fontSize: 12, opacity: 0.65 },
  error: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(239,68,68,0.18)",
    border: "1px solid rgba(239,68,68,0.35)",
    fontSize: 12,
  },
  stats: {
    marginTop: 10,
    display: "flex",
    gap: 16,
    fontSize: 13,
    opacity: 0.85,
  },
  canvasWrap: {
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.25)",
  },
};
