import React, { useEffect, useState } from 'react';
import './ProductListPage.css';
import { useNavigate } from 'react-router-dom';

const ProductListPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [products, setProducts] = useState([]);

  // Fetch product data from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allproductslist`); // Adjust the URL
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    
    <div className="container">
      <h1 className="product-list-title">Product Stock</h1>
      <div className="product-list">
        {products.map((product) => (
          <div
            className={`product-cardlist ${
              product.status === 'Available' ? 'available' : 'out-of-stock'
            }`}
            key={`${product.lot_id}-${product.grade}`}
          >
           <img
  src={ `${import.meta.env.VITE_API_URL}/images/lot002.png`}
  alt="Durian"
  className="product-imagelist"
/>


            <div className="product-detailslist">
              <div className="detail-rowlist">
                <p className="detail-labellist">Lot (Harvest Date):</p>
                <span className="detail-valuelist">{product.lot_id}</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Grade:</span>
                <span className="detail-valuelist">{product.grade}</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Remain Lot amount:</span>
                <span className="detail-valuelist">{product.RemainLotamount}</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Lot amount Stock:</span>
                <span className="detail-valuelist">{product.LotamountStock}</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Exp Date:</span>
                <span className="detail-valuelist">{new Date(product.exp_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Base Price:</span>
                <span className="detail-valuelist">{product.base_price} Baht</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Sale Price:</span>
                <span className="detail-valuelist">{product.sale_price} Baht</span>
              </div>
              <div className="detail-rowlist">
                <span className="detail-labellist">Status:</span>
                <span
                  className={`statuslist ${
                    product.status === 'Available' ? 'in-stock' : 'out-of-stock'
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="back-buttonlist" onClick={() => navigate(`/admin/${userId}`)}>
        Back
      </button>
    </div>
  );
};

export default ProductListPage;
