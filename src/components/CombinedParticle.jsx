import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const CombinedParticle = ({ ethData, solData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!ethData || ethData.length === 0 || !solData || solData.length === 0) {
      console.log("No data available for combined particle chart");
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

    // Kotak untuk Ethereum
    const ethBox = svg
      .append("rect")
      .attr("x", 0)
      .attr("y", margin.top)
      .attr("width", width / 2)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "steelblue")
      .attr("opacity", 0.1);

    // Kotak untuk Solana
    const solBox = svg
      .append("rect")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("width", width / 2)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "yellow")
      .attr("opacity", 0.1);

    // Fungsi untuk membuat partikel
    const createParticles = (data, color, xOffset, totalParticles, imagePath) => {
      const particles = d3
        .range(totalParticles)
        .map(() => ({
          x: xOffset + Math.random() * (width / 2 - 40), // Acak dalam kotak
          y: margin.top + Math.random() * (height - margin.top - margin.bottom), // Acak dalam kotak
          size: Math.random() * 15 + 10, // Ukuran partikel acak
          speed: Math.random() * 2 + 1, // Kecepatan partikel
        }));

      const particleGroup = svg
        .append("g")
        .attr("class", `${color}-particles`)
        .selectAll("image")
        .data(particles)
        .enter()
        .append("image")
        .attr("xlink:href", imagePath) // Menambahkan gambar logo
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.size) // Ukuran gambar sesuai dengan partikel
        .attr("height", (d) => d.size) // Ukuran gambar sesuai dengan partikel
        .attr("opacity", 0.8);

      // Animasi partikel
      particleGroup
        .transition()
        .duration(3000)
        .ease(d3.easeCircleInOut)
        .attr("y", (d) => {
          // Menjaga agar partikel tetap dalam batas kotak
          const newY = d.y + Math.random() * 40 - 20; // Menggerakkan partikel ke atas dan bawah
          return Math.max(margin.top, Math.min(newY, height - margin.bottom - d.size)); // Batas bawah dan atas
        })
        .attr("cy", (d) => d.y) // Menjaga posisi sumbu Y
        .on("end", function () {
          d3.select(this).transition().duration(3000).attr("y", (d) => d.y); // Kembali ke posisi awal
        });
    };

    // Menambahkan partikel untuk Ethereum (Jumlah partikel disesuaikan dengan harga rata-rata)
    const ethAvgPrice = d3.mean(parsedEthData, (d) => d.close);
    createParticles(parsedEthData, "steelblue", 0, Math.floor(ethAvgPrice / 10), "/src/assets/ethereum.svg"); // Logo Ethereum

    // Menambahkan partikel untuk Solana (Jumlah partikel disesuaikan dengan harga rata-rata)
    const solAvgPrice = d3.mean(parsedSolData, (d) => d.close);
    createParticles(parsedSolData, "yellow", width / 2, Math.floor(solAvgPrice / 10), "/src/assets/solana.svg"); // Logo Solana

  }, [ethData, solData]);

  return (
    <>
      <div className="relative">
        <svg ref={svgRef} width="800" height="400" />
      </div>

      {/* Legend di atas kanan box */}
      <div
        className="relative"
        style={{
          top: "-370px",
          right: "-420px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="flex items-center">
          <img
            src="/src/assets/ethereum.svg"
            alt="Ethereum"
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <span>Ethereum</span>
        </div>
        <div className="flex items-center">
          <img
            src="/src/assets/solana.svg"
            alt="Solana"
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <span>Solana</span>
        </div>
      </div>

      <h2 className="text-grey-500 text-center mb-2">Combined Particle Chart</h2>
    </>
  );
};

export default CombinedParticle;
