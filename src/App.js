import React, { useEffect, useState } from 'react';
import axios from 'axios';

const coinList = ['bitcoin', 'ethereum', 'solana', 'dogecoin', 'polygon', 'cardano'];

function App() {
  const [prices, setPrices] = useState({});

  const fetchPrices = async () => {
    try {
      const ids = coinList.join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr&include_24hr_change=true`;
      const response = await axios.get(url);
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Live Crypto Prices (INR)</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Coin</th>
            <th>Current Price (₹)</th>
            <th>24h Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {coinList.map((coinId) => {
            const coin = prices[coinId];
            return (
              <tr key={coinId}>
                <td>{coinId.charAt(0).toUpperCase() + coinId.slice(1)}</td>
                <td>{coin?.inr ? `₹${coin.inr.toLocaleString()}` : 'Loading...'}</td>
                <td style={{ color: coin?.inr_24h_change >= 0 ? 'green' : 'red' }}>
                  {coin?.inr_24h_change?.toFixed(2) ?? '--'}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
