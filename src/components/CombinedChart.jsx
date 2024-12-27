import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

const CombinedChart = ({ ethData, solData }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  useEffect(() => {
    if (!ethData || ethData.length === 0 || !solData || solData.length === 0) {
      console.log("No data available for combined chart");
      return;
    }

    const parsedEthData = ethData.map((d) => ({
      ...d,
      date: new Date(d.date),
    }));

    const parsedSolData = solData.map((d) => ({
      ...d,
      date: new Date(d.date),
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const x = d3
      .scaleTime()
      .domain(d3.extent([...parsedEthData, ...parsedSolData], (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([...parsedEthData, ...parsedSolData], (d) => Math.max(d.close)),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat("%Y"))
          .ticks(d3.timeYear.every(1))
      );

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("path")
      .datum(parsedEthData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.close))
      );

    svg
      .append("path")
      .datum(parsedSolData)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.close))
      );

    // Add overlay for tooltip interaction
    const overlay = svg
      .append("rect")
      .attr("class", "overlay")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);

    const bisect = d3.bisector((d) => d.date).left;

    overlay
      .on("mousemove", (event) => {
        const [mouseX, mouseY] = d3.pointer(event);
        const x0 = x.invert(mouseX);

        const ethIndex = bisect(parsedEthData, x0, 1);
        const ethPoint = parsedEthData[ethIndex - 1] || parsedEthData[ethIndex];

        const solIndex = bisect(parsedSolData, x0, 1);
        const solPoint = parsedSolData[solIndex - 1] || parsedSolData[solIndex];

        if (!ethPoint || !solPoint) return;

        // Calculate tooltip position with some padding to avoid overlap
        const tooltipX = mouseX + 10;
        const tooltipY = mouseY - 100;

        // Adjust tooltip position if it exceeds the viewport
        const adjustedX = tooltipX + 200 > width ? mouseX - 210 : tooltipX;
        const adjustedY = tooltipY < 10 ? mouseY + 10 : tooltipY;

        setTooltip({
          x: adjustedX,
          y: adjustedY,
          date: ethPoint.date,
          ethClose: ethPoint.close,
          solClose: solPoint.close,
        });
        setIsTooltipVisible(true);
      })
      .on("mouseout", () => {
        setIsTooltipVisible(false);
      });

    // Add legend
    svg
      .append("circle")
      .attr("cx", 700)
      .attr("cy", 30)
      .attr("r", 6)
      .style("fill", "steelblue");
    svg
      .append("text")
      .attr("x", 720)
      .attr("y", 30)
      .text("Ethereum")
      .style("font-size", "12px");

    svg
      .append("circle")
      .attr("cx", 700)
      .attr("cy", 50)
      .attr("r", 6)
      .style("fill", "orange");
    svg
      .append("text")
      .attr("x", 720)
      .attr("y", 50)
      .text("Solana")
      .style("font-size", "12px");
  }, [ethData, solData]);

  return (
    <>
      <div className="relative">
        <svg ref={svgRef} width="800" height="400" />
        {isTooltipVisible && tooltip && (
          <div
            className="absolute bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              minWidth: "200px",
            }}
          >
            <div className="font-bold text-gray-800 mb-2">
              {formatDate(tooltip.date)}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ethereum:</span>
                <span className="font-medium">
                  ${tooltip.ethClose.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Solana:</span>
                <span className="font-medium">
                  ${tooltip.solClose.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <h2 className="text-grey-500 text-center mb-2">Ethereum vs Solana</h2>
    </>
  );
};

export default CombinedChart;
