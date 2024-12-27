import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';

const NftTopChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;
    
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const logoSize = 80;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...data].slice(0, 3);
    
    // Calculate spacing to center the logos
    const totalWidth = (sortedData.length - 1) * logoSize * 2;
    const startX = (width - totalWidth) / 2;
    
    const nftGroups = svg
      .selectAll('.nft-container')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'nft-container')
      .attr('transform', (d, i) => `translate(${startX + i * logoSize * 2},${height/2})`);

    // Background circles
    nftGroups
      .append('circle')
      .attr('r', logoSize/2)
      .attr('fill', '#f8f9fa')
      .attr('stroke', '#e9ecef')
      .attr('stroke-width', 2);

    // Logos
    nftGroups
      .append('image')
      .attr('xlink:href', d => d.Logo)
      .attr('x', -logoSize/2)
      .attr('y', -logoSize/2)
      .attr('width', logoSize)
      .attr('height', logoSize)
      .attr('clip-path', 'circle()');

    // Collection names
    nftGroups
      .append('text')
      .attr('class', 'name')
      .attr('y', logoSize/2 + 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '500')
      .text(d => d.Name);

    // Volume labels
    nftGroups
      .append('text')
      .attr('class', 'volume')
      .attr('y', logoSize/2 + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text(d => d.Volume_USD);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('box-shadow', '0 4px 8px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none');

    // Tooltip
    nftGroups
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`
          <div style="font-weight: bold; margin-bottom: 8px;">${d.Name}</div>
          <div>Volume: ${d.Volume_USD}</div>
          <div>Market Cap: ${d.Market_Cap_USD}</div>
          <div>Sales: ${d.Sales}</div>
          <div>Floor Price: ${d.Floor_Price_USD}</div>
        `)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <Card className="p-4 w-full">
      <svg ref={svgRef} className="w-full"></svg>
    </Card>
  );
};

export default NftTopChart;