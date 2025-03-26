import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderHistoryPage.css'; 
import { useNavigate } from 'react-router-dom';

function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please try again.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-history-container">
      <div className="back-buttonhis" onClick={() => navigate(`/admin/${userId}`)}>
        Back
      </div>
      <h1 className="header">History Orders</h1> 

      <div className="frameed">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className={`order ${order.payment_status === 'Accept' ? 'accept' : 'reject'}`}
          >
            <div className="order-info">
              <div className="username">Username: {order.username}</div>
              <div className="purchase-date">Purchased Date: {new Date(order.order_date).toLocaleDateString()}</div>
              <div className={`payment-status ${order.payment_status.toLowerCase()}`}>
                Payment Check status: <span className="status-word">{order.payment_status}</span>
              </div>
              <div className="order-id">Order ID: {order.order_id}</div>
              <div className="total-price">Total Price: ${order.total_price}</div>
            </div>
            <button className="check-button"onClick={() => navigate(`/AdminCheck/${order.order_id}`)}>Check</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersHistory;
