import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const EthGasFeeBubble = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Log the data to the console to check its structure and values
    console.log("Data received:", data);
    data.forEach(d => {
      console.log(`Date: ${d.date}, Mean: ${d.mean}`);
    });

    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;

    // Clear existing elements
    svg.selectAll("*").remove();

    // Create a simulation
    const simulation = d3.forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(10))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d) => Math.max((d.mean / 2), 5))) // Ensure minimum radius
      .on("tick", ticked);

    // Create circles
    const circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", (d) => {
        const radius = (d.mean > 0 && !isNaN(d.mean)) ? Math.max((d.mean / 2) * 10, 5) : 5; // Ensure a minimum radius of 5
        console.log(`Radius for ${d.date}: ${radius}`); // Log radius for each circle
        return radius;
      })
      .attr("fill", (d) =>
        d3.interpolateBlues(d.median / d3.max(data, (d) => d.median))
      )
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        const [x, y] = d3.pointer(event);
        tooltip
          .style("left", `${x + 10}px`)
          .style("top", `${y}px`)
          .style("opacity", 1)
          .html(`
            <strong>Date:</strong> ${d.date}<br />
            <strong>Mean:</strong> ${d.mean}<br />
            <strong>Median:</strong> ${d.median}<br />
            <strong>75th Percentile:</strong> ${d.percentile75}<br />
            <strong>25th Percentile:</strong> ${d.percentile25}
          `);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.2)")
      .style("opacity", 0);

    function ticked() {
      circles
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    }

    // Cleanup on component unmount
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={svgRef} width="800" height="400" />;
};

export default EthGasFeeBubble;
