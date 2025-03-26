import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './YourOrderPage.css';

const YourOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const userId = localStorage.getItem('userId');
  const [allDeliverOrders, setAllDeliverOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  // const [receiptPath, setReceiptPath] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [productImages, setProductImages] = useState({});

  const handleReview = (line) => {
    const username = localStorage.getItem('username') || "Guest";
    const productDetails = findProductDetails(line.lotId, line.grade);
    const productImage = productImages[`${line.lotId}-${line.grade}`] || "default-durian.jpg";
    
    navigate("/order/review", {
      state: {
        order_id: orderDetails.orderId,
        lot_id: line.lotId,
        grade: line.grade,
        username,
        product_image: productImage
      }
    });
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/order/detail/${orderId}`
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`);
        setAllOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchDeliverOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/delivered-orders`);
        setAllDeliverOrders(response.data);
      } catch (error) {
        console.error('Error fetching deliver orders:', error);
      }
    };

    // const fetchReceipt = async () => {
    //   try {
    //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/receipt/${orderId}`);
    //     if (response.data && response.data.receiptPath) {
    //       setReceiptPath(response.data.receiptPath);
    //     } else {
    //       console.warn('Receipt not found for order:', orderId);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching receipt:', error);
    //   }
  
    // };

    const fetchAllProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/allproductslist`);
        const data = await response.json();
        setAllProducts(data);
        
        // Process product images
        const images = {};
        data.forEach(product => {
          const key = `${product.lot_id}-${product.grade}`;
          const imagePath = product.image_path;
          images[key] = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        });
        setProductImages(images);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchDeliverOrders();
    fetchAllProducts();
    fetchOrderDetails();
    fetchOrders();
    // fetchReceipt();
  }, [orderId]);

  const findProductDetails = (lotId, grade) => {
    const product = allProducts.find(
      product => product.lot_id === lotId && product.grade === grade
    );
    if (!product) {
      console.warn(`Product not found for lotId: ${lotId}, grade: ${grade}`);
    }
    return product;
  };

  const handleBackToProfile = () => {
    try {
      navigate(`/profile/${userId}`);
    } catch {
      alert('User not found. Please log in again.');
      navigate('/login');
    }
  };

  const findorderDetails = (orderId) => {
    const orderIdDetail = allOrders.find(
      (orderIdDetail) => orderIdDetail.order_id === parseInt(orderId)
    );
    if (!orderIdDetail) {
      console.warn(`orderIdDetail not found for orderId: ${orderId}`);
    }
    return orderIdDetail;
  };

  const findOrderEms = (orderId) => {
    const orderEms = allDeliverOrders.find(
      (orderEms) => orderEms.order_id === parseInt(orderId)
    );
    if (!orderEms) {
      console.warn(`orderEms not found for orderId: ${orderId}`);
    }
    return orderEms;
  };

  const orderIdDetail = findorderDetails(orderId);
  const orderEms = findOrderEms(orderId);

  if (!orderDetails) {
    return <p className="loading">Loading order details...</p>;
  }

  return (
    <div className="order-page-container">
      <div className="header">
        {/* Back to Home Button */}
        <button
          className="back-to-home-button"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>

        <h11>Your Order</h11>

        <button
          className="back-to-profile-button"
          onClick={handleBackToProfile}
        >
          Back to Profile
        </button>
      </div>

      <div className="order-layout">
        {/* Left Section: Delivery Status and Receipt */}
        <div className="left-section">
        <div className="delivery-status-container">
          <h2>Delivery Status</h2>
          {orderDetails.payment_status === 'Rejected' ? (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              ❌ Your payment was rejected due to incorrect slip information.
            </p>
          ) : orderIdDetail ? (
            <div
              className={`status ${
                orderIdDetail.delivery_status === 'sent the packet'
                  ? 'delivered'
                  : 'pending'
              }`}
              style={{
                color: orderIdDetail.delivery_status === 'sent the packet' ? 'green' : 'black',
              }}
            >
              {orderIdDetail.delivery_status === 'sent the packet'
                ? <p>{orderEms?.ems_code || 'EMS code not available'}</p>
                : 'In the process to be delivered'}
            </div>
          ) : (
            <p>Loading delivery status...</p>
          )}
        </div>


          

        </div>

        {/* Right Section: Order Info and Product List */}
        <div className="right-section">
          <div className="order-info">
            <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
            <p><strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}</p>
            <p><strong>User Name:</strong> {orderDetails.userName || 'N/A'}</p>
          </div>

          <div className="product-list">
            {orderDetails.orderLines.map((line, index) => {
              const imageKey = `${line.lotId}-${line.grade}`;
              const imagePath = productImages[imageKey];
              
              return (
                <div className="product-item" key={index}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/images/lot002.png`}
                    alt={line.lotId}
                    className="product-imageorder"
                  />
                  <div className="product-infoorder">
                    <h3>Product Lot: {line.lotId}</h3>
                    <p>Grade: {line.grade}</p>
                    <p>Amount: {line.amount}</p>
                  </div>

                  {/* ✅ เงื่อนไขแสดงปุ่ม Review */}
                  {orderIdDetail?.delivery_status === 'sent the packet' && (
                    <button
                      className="review-button"
                      onClick={() => handleReview(line)}
                    >
                      Review
                    </button>
                  )}
                </div>
              );
            })}
          </div>



        </div>
      </div>
    </div>
  );
};

export default YourOrderPage;