import { useState } from 'react';
import axios from 'axios';

const PurchaseList = () => {
  const [highestSold, setHighestSold] = useState(null);

  const fetchHighestSoldItem = async () => {
    try {
      const response = await axios.get('http://localhost:4000/purchases/highest-sold');
      setHighestSold(response.data);
    } catch (error) {
      console.error('Error fetching highest sold item:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchHighestSoldItem}>Get Highest Sold Item</button>
      {highestSold && (
        <div>
          <h3>Highest Sold Item</h3>
          <p>Product: {highestSold.product.name}</p>
          <p>Total Sold: {highestSold.totalSold}</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseList;
