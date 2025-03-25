import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ClientProfilePage.css'; // Ensure this CSS matches the new design

const ClientProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response1 = await axios.get(`http://localhost:13889/user/${userId}`);
        setUserData(response1.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('User not found. Please log in again.');
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:13889/orders/user/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to fetch orders.');
      }
    };

    fetchOrders();
  }, [userId]);

  if (!userData) {
    return <p>Loading profile...</p>;
  }

  const handleOrderCheck = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  

  return (
    <div className="profile-container">
      <div className="sidebar">

  <div className="sidebar-icons">
    <div className="icon" onClick={() => navigate(`/cart/${userId}`)}>
      🛒 {/* Shopping cart icon */}
    </div>
    <div className="icon" onClick={() => navigate('/home')}>
      🏠 {/* Home icon */}
    </div>
  </div>
  
        <div className="user-info">
        <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Last Name:</strong> {userData.lastname}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone Number:</strong> {userData.phone_number}</p>
          <p><strong>Address:</strong> {userData.address}</p>
          <p><strong>Road:</strong> {userData.name_road}</p>
          <p><strong>District:</strong> {userData.district}</p>
          <p><strong>Province:</strong> {userData.province}</p>
          <p><strong>Postal Code:</strong> {userData.postal_code}</p>
        </div>
  
        
      </div>
  
      <div className="orders-section">
        <h2 className="section-title">Histories</h2>
  
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} className="order-card">
              <div>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Purchased Date:</strong> {order.purchasedDate}</p>
                <p><strong>Delivered:</strong> {order.delivered ? 'Yes' : 'No'}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
              <button 
                className="check-button" 
                onClick={() => handleOrderCheck(order.orderId)}>
                Check
              </button>
            </div>
          ))
        )}
      </div>
  
      <button className="logout-button" onClick={() => navigate('/login')}>
        Log out
      </button>
    </div>
  );
  
};

export default ClientProfilePage;
