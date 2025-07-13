import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const coinList = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'solana', name: 'Solana' },
  { id: 'dogecoin', name: 'Dogecoin' },
  { id: 'matic-network', name: 'Polygon' },
  { id: 'cardano', name: 'Cardano' }
];

function App() {
  const [prices, setPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const [totalValue, setTotalValue] = useState(0);

  const fetchPrices = async () => {
    try {
      const ids = coinList.map(c => c.id).join(',');
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids,
          vs_currencies: 'inr'
        }
      });
      setPrices(response.data);
    } catch (err) {
      console.error('Error fetching prices:', err);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    let total = 0;
    for (let coin of coinList) {
      const qty = quantities[coin.id] || 0;
      const price = prices[coin.id]?.inr || 0;
      total += qty * price;
    }
    setTotalValue(total);
  }, [quantities, prices]);

  const handleQuantityChange = (id, value) => {
    const numericValue = parseFloat(value);
    if (numericValue < 0) return;
    setQuantities(prev => ({
      ...prev,
      [id]: parseFloat(value) || 0
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Crypto Portfolio Tracker</h1>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price (INR)</th>
            <th>Tokens Owned</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {coinList.map(coin => {
            const price = prices[coin.id]?.inr || 0;
            const qty = quantities[coin.id] || 0;
            const value = price * qty;

            return (
              <tr key={coin.id}>
                <td>{coin.name}</td>
                <td>₹{price.toLocaleString()}</td>
                <td>
                  <input
                    type="number"
                    value={qty}
                    onChange={e => handleQuantityChange(coin.id, e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td>₹{value.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ marginTop: '20px' }}>
        Total Portfolio Value: ₹{totalValue.toLocaleString()}
      </h2>
    </div>
  );
}

export default App;
