import { useRef, useState, useEffect } from "react";
import * as d3 from "d3";

const ETHChart = ({ data }) => {
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
    if (!data || data.length === 0) {
      console.log("No data available");
      return;
    }

    const parsedData = data.map((d) => ({
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
      .domain(d3.extent(parsedData, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => +d.close)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 5])
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .on("zoom", (event) => {
        const newX = event.transform.rescaleX(x);
        const newY = event.transform.rescaleY(y);

        svg.selectAll("path.line").attr(
          "d",
          d3
            .line()
            .x((d) => newX(d.date))
            .y((d) => newY(d.close))
        );

        // Update axes with custom time format
        svg
          .select(".x-axis")
          .call(
            d3
              .axisBottom(newX)
              .tickFormat(d3.timeFormat("%Y"))
              .ticks(d3.timeYear.every(1))
          );
        svg.select(".y-axis").call(d3.axisLeft(newY));
      });

    svg.call(zoom);

    // Set up x-axis with year format
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat(d3.timeFormat("%Y"))
          .ticks(d3.timeYear.every(1))
      );

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const chartGroup = svg.append("g");

    chartGroup
      .append("path")
      .datum(parsedData)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(+d.close))
      );

    const bisect = d3.bisector((d) => d.date).left;

    chartGroup
      .append("rect")
      .attr("class", "overlay")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .on("mousemove", (event) => {
        const [mouseX, mouseY] = d3.pointer(event);
        const x0 = x.invert(mouseX);
        const i = bisect(parsedData, x0, 1);
        const d0 = parsedData[i - 1];
        const d1 = parsedData[i];
        if (!d0 || !d1) return;
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        const tooltipData = {
          x: mouseX,
          y: mouseY,
          date: d.date,
          close: d.close,
          open: d.open,
          high: d.high,
          low: d.low,
          volume: d.volume,
        };

        setTooltip(tooltipData);
        setIsTooltipVisible(true);
      })
      .on("mouseout", () => {
        setIsTooltipVisible(false);
      });
  }, [data]);

  // Prevent the tooltip from overflowing off the screen
  const tooltipStyle = {
    position: "absolute",
    left: tooltip ? Math.min(tooltip.x + 10, window.innerWidth - 220) : 0, // Prevent tooltip from going off the right side
    top: tooltip ? Math.min(tooltip.y - 100, window.innerHeight - 150) : 0, // Prevent tooltip from going off the bottom
    minWidth: "200px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    border: "1px solid #ccc",
    opacity: isTooltipVisible ? 1 : 0,
    transition: "opacity 0.2s",
    pointerEvents: "none", // Ensure the tooltip doesn't interfere with mouse events
  };

  return (
    <>
      <div className="relative">
        <svg ref={svgRef} width="800" height="400" />
        {isTooltipVisible && tooltip && (
          <div className="tooltip" style={tooltipStyle}>
            <div className="font-bold text-gray-800 mb-2">
              {formatDate(tooltip.date)}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Open:</span>
                <span className="font-medium">${tooltip.open.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Close:</span>
                <span className="font-medium">${tooltip.close.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High:</span>
                <span className="font-medium">${tooltip.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low:</span>
                <span className="font-medium">${tooltip.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span className="text-gray-600">Volume:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat().format(tooltip.volume)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-grey-500 text-center mb-2">Ethereum Chart</h2>
    </>
  );
};

export default ETHChart;
