import { useRef, useEffect } from "react";
import * as d3 from "d3";

const EthGasFeeChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;

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

    const metrics = [
      { key: "Mean", color: "steelblue" },
      { key: "Median", color: "orange" },
      { key: "Percentile75", color: "green" },
      { key: "Percentile25", color: "purple" },
    ];

    // Add X and Y axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add scatter plots
    metrics.forEach((metric) => {
      svg
        .append("g")
        .selectAll("circle")
        .data(parsedData)
        .join("circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d[metric.key]))
        .attr("r", 3)
        .attr("fill", metric.color)
        .attr("opacity", 0.6);
    });

    // Tooltip elements
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)")
      .style("pointer-events", "none");

    // Interactive overlay
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

        tooltip
          .style("opacity", 1)
          .html(
            `
            <div class="font-bold">${d3.timeFormat("%Y-%m-%d")(d.date)}</div>
            <div>Mean: ${d.Mean.toFixed(2)}</div>
            <div>Median: ${d.Median.toFixed(2)}</div>
            <div>75th: ${d.Percentile75.toFixed(2)}</div>
            <div>25th: ${d.Percentile25.toFixed(2)}</div>
          `
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);

        // Highlight nearest points
        svg
          .selectAll("circle")
          .attr("r", (circle) => {
            const circleData = d3.select(circle.parentNode).datum();
            return circleData && circleData.date === d.date ? 6 : 3;
          })
          .attr("opacity", (circle) => {
            const circleData = d3.select(circle.parentNode).datum();
            return circleData && circleData.date === d.date ? 1 : 0.6;
          });
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
        svg.selectAll("circle").attr("r", 3).attr("opacity", 0.6);
      });

    // Legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right - 100}, ${margin.top})`
      );

    metrics.forEach((metric, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("circle").attr("r", 3).attr("fill", metric.color);

      legendRow
        .append("text")
        .attr("x", 10)
        .attr("y", 4)
        .text(metric.key)
        .style("font-size", "12px");
    });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <>
      <div className="relative">
        <svg ref={svgRef} width="800" height="400" />
      </div>
      <h2 className="text-grey-500 text-center mb-2">Ethereum Gas Fee</h2>
    </>
  );
};

export default EthGasFeeChart;
