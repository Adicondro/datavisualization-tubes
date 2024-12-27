import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const EthGasFeeTree = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Konversi data ke format hierarki
    const treeData = {
      name: "Ethereum Gas Fee Data",
      children: data.map((d) => ({
        name: `Date: ${d.date}`,
        children: [
          { name: `Mean: ${d.mean}` },
          { name: `Median: ${d.median}` },
          { name: `Percentile 25: ${d.percentile25}` },
          { name: `Percentile 75: ${d.percentile75}` },
        ],
      })),
    };

    // Dimensi SVG
    const width = 800;
    const height = 600;

    // Buat elemen SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Bersihkan elemen sebelumnya

    // Layout pohon
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width - 200, height - 200]);
    treeLayout(root);

    // Tambahkan links (garis penghubung)
    svg
      .selectAll("line")
      .data(root.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x + 100)
      .attr("y1", (d) => d.source.y + 100)
      .attr("x2", (d) => d.target.x + 100)
      .attr("y2", (d) => d.target.y + 100)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    // Tambahkan nodes (lingkaran)
    const nodes = svg
      .selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x + 100)
      .attr("cy", (d) => d.y + 100)
      .attr("r", 10)
      .attr("fill", (d) => (d.children ? "#ff6347" : "#4682b4"));

    // Tambahkan teks
    svg
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 100)
      .attr("y", (d) => d.y + 100)
      .attr("dy", 4)
      .attr("dx", 15)
      .text((d) => d.data.name)
      .style("font-size", "12px")
      .style("font-family", "Arial")
      .style("fill", "#333");

  }, [data]);

  return <svg ref={svgRef} width="800" height="600" />;
};

export default EthGasFeeTree;