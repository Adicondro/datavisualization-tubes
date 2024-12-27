import React, { useEffect, useState } from "react";
import { loadData } from "../utils/loadData";
import ETHChart from "../components/ETHChart";
import CombinedChart from "../components/CombinedChart";
import Cover from "../components/Cover";
import Nav from "../components/Nav";
import EthGasFeeChart from "../components/EthGasFeeChart";
import EthGasFeeBubble from "../components/EthGasFeeBubble";
import CombinedParticle from "../components/CombinedParticle";
import NftTopChart from "../components/NftTopChart";
import NftBarChart from "../components/NftBarChart";

const ETH = () => {
  const [ethData, setEthData] = useState([]);
  const [solData, setSolData] = useState([]);
  const [ethGasFeeData, setEthGasFeeData] = useState([]);
  const [nftData, setNftData] = useState([]);

  // Fetch data inside useEffect
  useEffect(() => {
    const fetchData = async () => {
      const ethDataset = await loadData("/src/assets/eth.csv");
      const solDataset = await loadData("/src/assets/solana.csv");
      const ethGasFeeDataset = await loadData("/src/assets/ethgasfee.csv");
      const nftDataset = await loadData("/src/assets/nfttop.csv");

      setEthData(
        ethDataset.map((d) => ({
          date: d.Date,
          open: +d.Open,
          high: +d.High,
          low: +d.Low,
          close: +d.Close,
          adjClose: +d["Adj Close"],
          volume: +d.Volume,
        }))
      );

      setSolData(
        solDataset.map((d) => ({
          date: d.time,
          open: +d.Open,
          high: +d.High,
          low: +d.Low,
          close: +d.Close,
          volume: +d.Volume,
        }))
      );

      setEthGasFeeData(
        ethGasFeeDataset.map((d) => ({
          Date: d.Date,
          Mean: +d.Mean,
          Median: +d.Median,
          Percentile75: +d.Percentile_75,
          Percentile25: +d.Percentile_25,
        }))
      );

      setNftData(
        nftDataset.map((d) => ({
          Name: d.Name,
          Volume_USD: d.Volume_USD,
          Market_Cap_USD: d.Market_Cap_USD,
          Sales: d.Sales,
          Floor_Price_USD: d.Floor_Price_USD,
          Average_Price_USD: d.Average_Price_USD,
          Owners: d.Owners,
          Category: d.Category,
          Logo: d.Logo,
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <>
      <Nav />
      <div className="flex flex-col min-h-screen justify-center bg-gray-50 px-96 py-8">
        <Cover />
        <h1 className="text-4xl font-poppins font-bold text-left mt-6 mb-4 leading-snug">
          Ethereum: Apa Saja Yang Ada
        </h1>
        <h2 className="text-xl font-poppins text-grey-800 mb-6 leading-snug">
          Mari jelajahi kemajuan terbaru, pencapaian, dan peluang yang
          ditawarkan Ethereum saat ia memperkokoh posisinya sebagai pemimpin
          dalam ekosistem blockchain.
        </h2>
        <p className="font-poppins font-bold text-xl mt-6 mb-6 leading-relaxed">
          1. Apa itu Ethereum
        </p>
        <p className="text-xl mt-6 mb-6 leading-relaxed">
          Ethereum adalah platform blockchain yang melampaui sekadar
          cryptocurrency. Dengan mendukung smart contracts dan aplikasi
          terdesentralisasi (dApps), Ethereum menghilangkan peran perantara,
          menawarkan cara yang aman dan transparan untuk mengelola nilai dan
          menjalankan kesepakatan.
        </p>

        <div className="flex flex-wrap justify-center items-start">
          <ETHChart data={ethData} />
        </div>

        <p className="text-xl text-grey-600 mt-5 leading-relaxed">
          Mata uang asli Ethereum, Ether (ETH), tidak hanya mendorong revolusi
          finansial tetapi juga membuka peluang tak terbatas di bidang seperti
          verifikasi identitas, gaming, dan seni. Dengan transisi ke Ethereum
          2.0, platform ini semakin memperkokoh perannya sebagai jaringan yang
          scalable dan efisien energi, menawarkan biaya yang lebih rendah dan
          waktu transaksi yang lebih cepat tanpa mengorbankan desentralisasi
          atau keamanan. Ethereum bukan hanya teknologi; ini adalah gerakan
          menuju ekonomi digital yang lebih adil dan terbuka.
        </p>

        <p className="font-poppins font-bold text-xl mt-6 mb-6 leading-relaxed">
          2. Ethereum vs. Solana: Rivalitas Abadi
        </p>
        <p className="text-xl mt-6 mb-6 leading-relaxed">
          Solana telah muncul sebagai pesaing kuat dengan kecepatan transaksi
          yang tinggi dan biaya rendah. Namun, Ethereum tetap unggul dalam
          metrik penting seperti volume transaksi, kapitalisasi pasar, dan
          aktivitas pengembang. Dengan ekosistem dApps, pertukaran
          terdesentralisasi, dan solusi Layer-2 yang kokoh, Ethereum terus
          menjadi platform pilihan bagi pengembang dan perusahaan di seluruh
          dunia.
        </p>

        <div className="flex flex-wrap justify-center mt-8 mb-8">
          <CombinedParticle ethData={ethData} solData={solData} />
        </div>
        <p>
          Keandalan dan rekam jejak Ethereum yang terbukti, ditambah pembaruan
          berkelanjutan, memberikan tingkat kepercayaan yang tak tertandingi.
          Meskipun menghadapi tekanan kompetitif dari Solana dan blockchain
          lainnya, Ethereum tetap menjadi pemimpin yang tak tergoyahkan.
        </p>
        <div className="flex flex-wrap justify-center mt-8 mb-8">
          <CombinedChart ethData={ethData} solData={solData} />
        </div>
        <p className="font-poppins font-bold text-xl mt-6 mb-6 leading-relaxed">
          3. Gas Fee Ethereum : Evolusi Efisiensi
        </p>
        <div className="flex flex-wrap justify-center mt-8 mb-8">
          <EthGasFeeBubble data={ethGasFeeData} />
        </div>
        <p className="text-xl mt-6 mb-6 leading-relaxed">
          Biaya gas, yang sebelumnya menjadi tantangan bagi pengguna Ethereum,
          kini semakin optimal berkat inovasi seperti London Hard Fork dan
          transisi ke Ethereum 2.0. Pembaruan ini mengoptimalkan biaya
          transaksi, membuat Ethereum lebih mudah diakses oleh berbagai kalangan
          tanpa mengorbankan fitur keamanan utamanya.
        </p>
        <div className="flex flex-wrap justify-center mt-8 mb-8">
          <EthGasFeeChart data={ethGasFeeData} />
        </div>
        <p className="text-xl mt-6 mb-6 leading-relaxed">
          Biaya yang lebih rendah memungkinkan Ethereum terus menarik perhatian
          pengguna dari berbagai lapisan, baik itu trader kasual, pengembang,
          atau bisnis yang ingin memanfaatkan kekuatan teknologi blockchain.
        </p>
        <p className="font-poppins font-bold text-xl mt-6 mb-6 leading-relaxed">
          4. Non-Fungible Token (NFT) : Seni Inovasi
        </p>
        <p className="text-xl mt-6 mb-6 leading-relaxed">
          Ethereum telah memantapkan dirinya sebagai tulang punggung pasar NFT
          (Non-Fungible Token), memungkinkan seniman, musisi, dan pengembang
          untuk menjadikan karya mereka sebagai token dan menjangkau audiens
          global. Dari koleksi seni digital eksklusif hingga aset dalam game,
          Ethereum menciptakan model ekonomi baru yang menghubungkan kreator dan
          kolektor secara langsung. Dengan miliaran dolar mengalir melalui
          ekosistem NFT-nya, Ethereum telah menjadi fenomena budaya,
          memberdayakan kreator untuk berinovasi dan investor untuk memiliki
          bagian dari masa depan. Baik itu Bored Apes atau seni generatif, dunia
          NFT sangat bergantung pada infrastruktur Ethereum yang tak tertandingi
          dan komunitasnya yang dinamis.
        </p>
        <div className="flex flex-wrap justify-center items-center mt-8 mb-8">
          <NftTopChart data={nftData} />
        </div>
        <div className="flex flex-wrap justify-center items-center mt-8 mb-8">
          <NftBarChart data={nftData} /> 
        </div>
      </div>
    </>
  );
};

export default ETH;
