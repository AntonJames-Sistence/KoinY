'use client';
import React, { useEffect, useState, useRef } from 'react';
import { HiMiniChevronDoubleRight } from "react-icons/hi2";
import { useSearchParams } from 'next/navigation';

const TradingViewWidget = () => {
  const searchParams = useSearchParams();
  const coin = searchParams.get('coin');
  let coinName = coin || 'bitcoin';

  const container = useRef();
  const [coinData, setCoinData] = useState(null);
  const [coinPrice, setCoinPrice] = useState(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    fetchCoinInfo(coinName);
  }, [coinName])

  useEffect(() => {
    if (coinData){
      generateTradingViewWidget(coinData.symbol, isMobile);
    }
  }, [coinData, coinName])

  const formatCoinName = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const fetchCoinInfo = async (name) => {
    const infoUrl = `https://api.coingecko.com/api/v3/search?query=${name}`;
    
    try {
      let data = await fetch(infoUrl);
      let jsonData = await data.json();
      
      setCoinData(jsonData.coins[0]);

      await fetchCoinPrice(jsonData.coins[0].id);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCoinPrice = async (id) => {
    const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=inr%2Cusd&include_24hr_change=true`;
    
    try {
      let data = await fetch(priceUrl);
      let jsonData = await data.json();

      // Add prices to coinData
      setCoinPrice(jsonData[id]);
    } catch (error) {
      console.log(error)
    }
  }

  const generateTradingViewWidget = (coinCymbol, isMobile) => {
    while (container.current.firstChild) {
      container.current.removeChild(container.current.firstChild);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "${isMobile ? 300 : 510}",
        "symbol": "BITSTAMP:${coinCymbol.toUpperCase()}USD",
        "hide_legend": true,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "3",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(255, 255, 255, 1)",
        "gridColor": "rgba(0, 0, 0, 0.06)",
        "save_image": false,
        "calendar": false,
        "hide_volume": true,
        "hide_top_toolbar": true,
        "support_host": "https://www.tradingview.com"
      }`;

      container.current.appendChild(script);
  };
  
  return (
    <div className="flex flex-col">
      <div className="py-4 flex">
        <p className="text-gray-600">Cryptocurrencies</p>
        <HiMiniChevronDoubleRight className="self-center ml-2 mr-1 text-gray-600" /> 
        <p>{formatCoinName(coinName)}</p>
      </div>

      <div className="h-auto flex flex-col bg-white rounded-lg">
        {!coinData ? (
          <div className='m-10 self-center flex justify-center'>
            <div className="loader"></div>
          </div>
        ):(
          <div className='flex flex-col justify-between mx-5'>
            <div className='flex flex-row mt-7 mb-10'>
              <img src={coinData.large} alt={`${coinData.api_symbol} logo`} className='h-10 w-10 bg-white'></img>
              <div className='text-black text-2xl font-semibold self-center mx-2'>{coinData.name}</div>
              <div className='text-gray-500 self-center font-semibold mr-2'>{coinData.symbol}</div>

              <div className='flex flex-row bg-gray-600 bg-opacity-70 rounded-lg p-2 ml-10 text-white self-center'>
                {`Rank #${coinData.market_cap_rank}`}
              </div>
            </div>

            <div className='flex flex-row'>
              <div className='text-black text-3xl font-semibold self-center'>{coinPrice?.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>

              <div className="flex flex-row bg-green-100 bg-opacity-50 rounded-md px-6 py-1 ml-6 mr-2 text-green-600 self-center">
                <div className="triangle-green self-center border-red"></div>
                <div>{`${coinPrice?.usd_24h_change?.toFixed(2)}%`}</div>
              </div>

              <div className="text-gray-500 text-sm self-center">{`(24H)`}</div>
            </div>

            <hr className='my-5 border-gray-400' />

            <div className='mb-10 font-semibold text'>{`${coinData.name} Price Chart (USD)`}</div>
          </div>
          
        )}
        
        <div className='mx-5 mb-5 z-10'>
          <div className="tradingview-widget-container self-center" ref={container}></div>
        </div>

      </div>                                                                 
    </div>
  );
}

export default TradingViewWidget;
