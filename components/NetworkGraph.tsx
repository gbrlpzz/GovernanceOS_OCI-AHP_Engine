
import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Cause, Intervention } from '../types';

interface NetworkGraphProps {
  outcome: string;
  causes: Cause[];
  interventions: Intervention[];
  causeWeights?: Record<string, number>;
  interventionWeights?: Record<string, number>;
  className?: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  outcome,
  causes,
  interventions,
  causeWeights,
  interventionWeights,
  className
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<SVGGElement>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  const nodes = useMemo(() => {
    const list: any[] = [];
    if (outcome) {
      list.push({
        id: 'outcome',
        label: outcome,
        type: 'outcome',
        r: 30,
        weight: 1
      });
    }
    causes.forEach(c => {
      const w = causeWeights?.[c.id] || 0.1; // Default small weight for vis
      list.push({
        id: c.id,
        label: c.label,
        type: 'cause',
        r: 20 + (w * 30),
        weight: w
      });
    });
    interventions.forEach(i => {
      const w = interventionWeights?.[i.id] || 0.1;
      list.push({
        id: i.id,
        label: i.label,
        type: 'intervention',
        r: 20 + (w * 30),
        weight: w
      });
    });
    return list;
  }, [outcome, causes, interventions, causeWeights, interventionWeights]);

  const links = useMemo(() => {
    const list: any[] = [];
    if (outcome) {
      causes.forEach(c => {
        list.push({ source: 'outcome', target: c.id, type: 'driver' });
      });
    }
    interventions.forEach(i => {
      i.targetCauseIds.forEach(tid => {
        if (causes.find(c => c.id === tid)) {
          list.push({ source: tid, target: i.id, type: 'target' });
        }
      });
    });
    return list;
  }, [outcome, causes, interventions]);

  // Zoom Handler
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        if (containerRef.current) {
          d3.select(containerRef.current).attr("transform", event.transform.toString());
          setZoomTransform(event.transform);
        }
      });

    svg.call(zoomBehavior);

    // Initial Center
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));

  }, []);

  // Zoom Control Functions
  const handleZoom = (factor: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(
      (d3.zoom().scaleBy as any), factor
    );
  };

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Re-center
    svg.transition().duration(750).call(
      (d3.zoom().transform as any),
      d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8)
    );
  };


  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = d3.select(containerRef.current);

    container.selectAll("*").remove();

    // Grid Background (Large enough to cover zoom)
    const gridSize = 50;
    const gridLimit = 4000;
    const grid = container.append("g").attr("class", "grid").attr("opacity", 0.15).attr("aria-hidden", "true");

    // Draw extensive grid
    const ticks = d3.range(-gridLimit, gridLimit, gridSize);

    grid.selectAll(".v-line")
      .data(ticks).enter().append("line")
      .attr("x1", d => d).attr("y1", -gridLimit)
      .attr("x2", d => d).attr("y2", gridLimit)
      .attr("stroke", "#000000").attr("stroke-width", 1);

    grid.selectAll(".h-line")
      .data(ticks).enter().append("line")
      .attr("x1", -gridLimit).attr("y1", d => d)
      .attr("x2", gridLimit).attr("y2", d => d)
      .attr("stroke", "#000000").attr("stroke-width", 1);

    // Crosshairs at origin
    grid.append("line").attr("x1", -20).attr("y1", 0).attr("x2", 20).attr("y2", 0).attr("stroke", "#000000").attr("stroke-width", 2);
    grid.append("line").attr("x1", 0).attr("y1", -20).attr("x2", 0).attr("y2", 20).attr("stroke", "#000000").attr("stroke-width", 2);


    // Force Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-1500))
      .force("center", d3.forceCenter(0, 0)) // Center at 0,0 (local coord)
      .force("collide", d3.forceCollide().radius((d: any) => d.r + 60).iterations(2));

    // Draw Links
    const link = container.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#000000")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d: any) => d.type === 'driver' ? "0" : "4 2"); // Dashed for interventions

    // Draw Nodes Group
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "grab")
      .attr("role", "graphics-symbol")
      .attr("aria-label", (d: any) => `${d.type}: ${d.label}`)
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node Shapes
    node.each(function (d: any) {
      const el = d3.select(this);

      if (d.type === 'outcome') {
        // Black Square for Outcome
        el.append("rect")
          .attr("width", d.r * 2.5)
          .attr("height", d.r * 2.5)
          .attr("x", -d.r * 1.25)
          .attr("y", -d.r * 1.25)
          .attr("fill", "#000000")
          .attr("stroke", "#000000")
          .attr("stroke-width", 0);
      } else if (d.type === 'intervention') {
        // White Rectangle with Thick Border
        el.append("rect")
          .attr("width", d.r * 3)
          .attr("height", d.r * 1.5)
          .attr("x", -d.r * 1.5)
          .attr("y", -d.r * 0.75)
          .attr("fill", "#FFFFFF")
          .attr("stroke", "#000000")
          .attr("stroke-width", 3);
      } else {
        // White Circle with Thick Border
        el.append("circle")
          .attr("r", d.r)
          .attr("fill", "#FFFFFF")
          .attr("stroke", "#000000")
          .attr("stroke-width", 3);
      }
    });

    // Labels with "Sticker" Background
    const labelGroup = node.append("g")
      .attr("transform", d => d.type === 'outcome' ? `translate(0, ${d.r * 1.6})` : `translate(0, ${d.type === 'intervention' ? d.r + 8 : d.r + 12})`);

    // Label Background (Sticker)
    labelGroup.append("rect")
      .attr("fill", "#FFFFFF")
      .attr("stroke", "#000000")
      .attr("stroke-width", 1)
      .attr("height", 20)
      .attr("y", -10);

    // Label Text
    const texts = labelGroup.append("text")
      .text((d: any) => d.label)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#000000")
      .attr("font-size", "10px")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-weight", "700")
      .attr("y", 1)
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.05em");

    // Adjust rect size to text
    labelGroup.each(function () {
      const g = d3.select(this);
      const text = g.select("text").node() as SVGTextElement;
      const bbox = text.getBBox();
      g.select("rect")
        .attr("x", bbox.x - 6)
        .attr("width", bbox.width + 12);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(this: SVGGElement, event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(this).attr("cursor", "grabbing");
    }

    function dragged(this: SVGGElement, event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(this: SVGGElement, event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      d3.select(this).attr("cursor", "grab");
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className={`relative w-full h-[500px] bg-white border-2 border-swiss-black bg-grid-pattern overflow-hidden shadow-sharp ${className}`} role="figure" aria-label="Network graph of outcome, causes, and interventions">
      <svg ref={svgRef} className="w-full h-full touch-none cursor-move">
        <g ref={containerRef} />
      </svg>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-0 shadow-sharp">
        <button onClick={() => handleZoom(1.2)} className="w-10 h-10 bg-white border-2 border-swiss-black border-b-0 hover:bg-swiss-blue hover:text-white flex items-center justify-center text-xl font-bold font-mono focus-visible:bg-swiss-blue focus-visible:text-white focus-visible:outline-none" aria-label="Zoom In" tabIndex={0}>+</button>
        <button onClick={() => handleZoom(0.8)} className="w-10 h-10 bg-white border-2 border-swiss-black border-b-0 hover:bg-swiss-blue hover:text-white flex items-center justify-center text-xl font-bold font-mono focus-visible:bg-swiss-blue focus-visible:text-white focus-visible:outline-none" aria-label="Zoom Out" tabIndex={0}>-</button>
        <button onClick={handleReset} className="w-10 h-10 bg-white border-2 border-swiss-black hover:bg-swiss-blue hover:text-white flex items-center justify-center text-[10px] font-bold font-mono focus-visible:bg-swiss-blue focus-visible:text-white focus-visible:outline-none" aria-label="Fit to Screen" tabIndex={0}>FIT</button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 p-4 bg-white border-2 border-swiss-black shadow-sharp pointer-events-none" aria-hidden="true">
        <div className="text-[9px] font-mono font-bold text-swiss-black uppercase mb-2 tracking-widest border-b-2 border-swiss-black pb-1">Schematic Key</div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-black"></div>
          <span className="text-[10px] font-bold font-mono uppercase">OUTCOME</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full border-2 border-black bg-white"></div>
          <span className="text-[10px] font-bold font-mono uppercase">DRIVER</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-2 border-2 border-black bg-white"></div>
          <span className="text-[10px] font-bold font-mono uppercase">INTERVENTION</span>
        </div>
      </div>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-white/80 backdrop-blur-sm">
          <div className="font-mono uppercase tracking-widest text-swiss-black mb-2 font-bold">System Idle</div>
          <div className="text-4xl font-black text-swiss-border">WAITING FOR DATA</div>
        </div>
      )}
    </div>
  );
};
