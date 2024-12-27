import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';

const NftBarChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;
    
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 120, bottom: 60, left: 200 };
    const width = 1000 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...data]
      .sort((a, b) => parseFloat(b.Volume_USD.replace(/[$,]/g, '')) - 
                      parseFloat(a.Volume_USD.replace(/[$,]/g, '')))
      .slice(0, 30);

    const y = d3.scaleBand()
      .range([0, height])
      .domain(sortedData.map(d => d.Name))
      .padding(0.3);

    const x = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => parseFloat(d.Volume_USD.replace(/[$,]/g, '')))])
      .range([0, width]);

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px');

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d => `$${d3.format('.2s')(d)}`))
      .selectAll('text')
      .style('font-size', '12px');

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4F46E5');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#818CF8');

    // Add bars
    const bars = svg.selectAll('bars')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('y', d => y(d.Name))
      .attr('height', y.bandwidth())
      .attr('fill', 'url(#bar-gradient)')
      .attr('x', 0)
      .attr('width', d => x(parseFloat(d.Volume_USD.replace(/[$,]/g, ''))))
      .style('opacity', 0.9);

    // Logo circles
    const logoSize = y.bandwidth() * 0.8;
    svg.selectAll('image')
      .data(sortedData)
      .enter()
      .append('image')
      .attr('xlink:href', d => d.Logo)
      .attr('y', d => y(d.Name) + (y.bandwidth() - logoSize) / 2)
      .attr('x', -40)
      .attr('width', logoSize)
      .attr('height', logoSize)
      .attr('clip-path', 'circle()');

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border-radius', '6px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('display', 'none');

    bars.on('mouseover', (event, d) => {
      tooltip
        .style('display', 'block')
        .html(`
          <div style="font-weight: bold">${d.Name}</div>
          <div>Volume: ${d.Volume_USD}</div>
          <div>Market Cap: ${d.Market_Cap_USD}</div>
          <div>Sales: ${d.Sales}</div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('display', 'none');
    });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <>
    <Card className="p-4 w-full overflow-x-auto">
      <svg ref={svgRef}></svg>
    </Card>
    <h2 className="text-grey-500 text-center mb-4">NFT Chart</h2>
    </>
    
  );
};

export default NftBarChart;