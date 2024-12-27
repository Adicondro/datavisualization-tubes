import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BlockchainGasNetwork = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No data available for Ethereum Gas Fee chart");
      return;
    }

    const parsedData = data.map((d) => ({
      date: new Date(d.Date),
      Mean: d.Mean,
      Median: d.Median,
      Percentile75: d.Percentile75,
      Percentile25: d.Percentile25,
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(parsedData, (d) =>
          Math.max(d.Mean, d.Median, d.Percentile75, d.Percentile25)
        ),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colors = {
      Mean: "steelblue",
      Median: "orange",
      Percentile75: "green",
      Percentile25: "purple",
    };

    const lines = ["Mean", "Median", "Percentile75", "Percentile25"];

    // Gradient fill
    lines.forEach((line) => {
      svg
        .append("linearGradient")
        .attr("id", `${line}-gradient`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", 0)
        .attr("y2", y(d3.max(parsedData, (d) => d[line] || 0))) // Ensure no undefined value
        .selectAll("stop")
        .data([
          { offset: "0%", color: colors[line], opacity: 0.2 },
          { offset: "100%", color: colors[line], opacity: 0 },
        ])
        .join("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color)
        .attr("stop-opacity", (d) => d.opacity);

      svg
        .append("path")
        .datum(parsedData)
        .attr("fill", `url(#${line}-gradient)`)
        .attr("stroke", "none")
        .attr(
          "d",
          d3
            .area()
            .x((d) => x(d.date))
            .y0(y(0))
            .y1((d) => y(d[line] || 0)) // Safeguard to prevent undefined values
        );
    });

    // Smoothed lines
    lines.forEach((line) => {
      svg
        .append("path")
        .datum(parsedData)
        .attr("fill", "none")
        .attr("stroke", colors[line])
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveCatmullRom)
            .x((d) => x(d.date))
            .y((d) => y(d[line] || 0)) // Safeguard to prevent undefined values
        );
    });

    // Highlight on hover
    const focusLine = svg
      .append("line")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4 4")
      .style("visibility", "hidden");

    const focusCircles = {};
    lines.forEach((line) => {
      focusCircles[line] = svg
        .append("circle")
        .attr("r", 5)
        .attr("fill", colors[line])
        .style("visibility", "hidden");
    });

    const focusText = svg.append("g").style("visibility", "hidden");

    focusText
      .append("rect")
      .attr("width", 120)
      .attr("height", 60)
      .attr("fill", "white")
      .attr("stroke", "gray")
      .attr("rx", 5);

    focusText
      .append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("font-size", "12px");

    svg
      .append("rect")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const x0 = x.invert(mouseX);
        const i = d3.bisector((d) => d.date).left(parsedData, x0, 1);
        if (i >= parsedData.length) return;
        const d0 = parsedData[i - 1];
        const d1 = parsedData[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focusLine
          .attr("x1", x(d.date))
          .attr("x2", x(d.date))
          .attr("y1", y(0))
          .attr(
            "y2",
            y(
              d3.max(parsedData, (d) =>
                Math.max(...lines.map((l) => d[l] || 0))
              )
            )
          )
          .style("visibility", "visible");

        lines.forEach((line) => {
          focusCircles[line]
            .attr("cx", x(d.date))
            .attr("cy", y(d[line] || 0)) // Ensure the `d[line]` value is not undefined
            .style("visibility", "visible");
        });

        focusText
          .attr("transform", `translate(${x(d.date) + 10}, ${y(d.Mean) - 30})`)
          .style("visibility", "visible")
          .select("text").text(`Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}
                       Mean: ${d.Mean || "N/A"}`); // Fallback to 'N/A' if undefined
      })
      .on("mouseout", () => {
        focusLine.style("visibility", "hidden");
        Object.values(focusCircles).forEach((circle) =>
          circle.style("visibility", "hidden")
        );
        focusText.style("visibility", "hidden");
      });
  }, [data]);

  return <svg ref={svgRef} width="800" height="600" />;
};

export default BlockchainGasNetwork;
