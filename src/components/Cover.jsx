import React from 'react';
import ether from '../assets/ether.jpg'; // Import the image

const Cover = () => {
  return (
    <div className="relative"> 
      <img src={ether} alt="Solana vs Ethereum" className="w-auto h-auto object-cover" /> 
      <div className="mt-4 text-center text-grey ">
        <p>Sebagai kekuatan utama dalam revolusi blockchain, Ethereum menawarkan alternatif yang revolusioner terhadap sistem tradisional. Mulai dari keuangan terdesentralisasi (DeFi) hingga seni digital, Ethereum terus membentuk ulang industri dan cara kita berinteraksi dengan teknologi serta nilai.</p>
      </div>
    </div>
  );
};

export default Cover;