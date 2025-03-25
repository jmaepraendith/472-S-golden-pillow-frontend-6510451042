import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminCheckOrderPage.css';

const AdminCheckOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrder, setFilteredOrder] = useState(null);
  const [showSlip, setShowSlip] = useState(false);
  const [packedStatus, setPackedStatus] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:13889/order/detail/${orderId}`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:13889/orders');
        setAllOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await fetch('http://localhost:13889/allproductslist');
        const data = await response.json();
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrderDetails();
    fetchOrders();
    fetchAllProducts();
  }, [orderId]);

  useEffect(() => {
    if (orderDetails && allOrders.length > 0) {
      const specificOrder = allOrders.find(order => order.order_id === orderDetails.orderId);
      setFilteredOrder(specificOrder);
    }
  }, [orderDetails, allOrders]);

  const findProductDetails = (lotId, grade) => {
    const product = allProducts.find(
      product => product.lot_id === lotId && product.grade === grade
    );
    if (!product) {
      console.warn(`Product not found for lotId: ${lotId}, grade: ${grade}`);
    }
    return product;
  };

  const handleShowSlip = () => setShowSlip(true);
  const handleCloseSlip = () => setShowSlip(false);

  // const togglePackedStatus = (index) => {
  //   setPackedStatus((prevStatus) => ({
  //     ...prevStatus,
  //     [index]: !prevStatus[index],
  //   }));
  // };

  const handleConfirmChange = async () => {
    //axios.post(`http://localhost:13889/orders/updatePackedStatus`)
  };

  const handleAcceptOrder = async () => {
    try {
      await axios.post(`http://localhost:13889/orders/updatePaymentStatus`, {
        orderId,
        payment_status: "Approved"
      });
      alert("Order payment status updated to accept.");
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status.");
    }
  };
  const handleRejectOrder = async () => {
    try {
      await axios.post(`http://localhost:13889/orders/updatePaymentStatus`, {
        orderId,
        payment_status: "Rejected"
      });
      alert("Order payment status updated to reject.");
    } catch (error) {
      console.error("Error updating payment status:", error.response ? error.response.data : error.message);
      alert("Failed to update payment status.");
    }
  };
  
  
  const handledeliveryOrder = async () => {
    try {
      await axios.post(`http://localhost:13889/orders/updatedeliveryStatus`, {
        orderId,
        delivery_status: "sent the packet"
      });
      alert("Order delivery status updated to 'sent the packet.'");
    } catch (error) {
      console.error("Error updating sent the packet:", error.response ? error.response.data : error.message);
      alert("Failed to update sent the packet.");
    }
  };

  
  const handlePackedstatusOrder = async () => {
    try {
        await axios.post(`http://localhost:13889/orders/updatePackedStatus`, {
          orderId,
          packed_status: "packed"
        });
        alert("Order delivery status updated to 'packed.'");
      } catch (error) {
        console.error("Error updating packed_status:", error.response ? error.response.data : error.message);
        alert("Failed to update packed_status.");
      }
  };
  // const handleprintreceipt = async () => {
  //   const userId = localStorage.getItem('userId');
  //   try {
  //     await axios.post(`http://localhost:13889/orders/createreceipt`, {
  //       orderId,
  //       userId,
  //     });
  //     alert("Receipt created successfully.");
  //   } catch (error) {
  //     console.error("Error creating receipt:", error.response ? error.response.data : error.message);
  //     alert("Failed to create receipt.");
  //   }
  // };
  

  if (!filteredOrder) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="pagecontainer">
      <div className="admin-check-order-container">
        <div className="header">
          <button className="back-buttonador" onClick={() => navigate(`/admin/${userId}`)}>Back</button>
          <h1>Order Clients</h1>
          {/* <button className="confirm-button" onClick={handleConfirmChange}>Confirm This Change</button> */}
        </div>

        <div className="productcontent-container">
          <div className="product-listad">
            {orderDetails.orderLines && orderDetails.orderLines.length > 0 ? (
              orderDetails.orderLines.map((product, index) => {
                const productDetails = findProductDetails(product.lotId, product.grade);
                
                return (
                  <div key={index} className="product-card">
                    {productDetails ? (
                      <>
                        <img src={`http://localhost:13889/images/lot002.png`} alt="Product" className="product-image" />
                        <div className="product-infoad">
                          <p>Product Lot: {productDetails.lot_id}</p>
                          <p>Grade: {productDetails.grade}</p>
                          <p>Price each one: {productDetails.sale_price} Baht</p>
                          <p>Amount: {product.amount}</p>
                        </div>
                      </>
                    ) : (
                      <p>Product details not available.</p>
                    )}
                    {/* <button
                      className={`packed-label ${packedStatus[index] ? 'pack-green' : 'packed-red'}`}
                      onClick={() => togglePackedStatus(index)}
                    >
                      Pack
                    </button> */}
                  </div>
                );
              })
            ) : (
              <p>No products in this order.</p>
            )}
          </div>

          <div className="ordercontent-container">
            <div className="orderdetails">
              <p><strong>Order ID:</strong> {filteredOrder.order_id}</p>
              <p><strong>Purchased Date:</strong> {new Date(filteredOrder.order_date).toLocaleDateString()}</p>
              <p><strong>User ID:</strong> {filteredOrder.user_id}</p>
              <p><strong>Username:</strong> {filteredOrder.username}</p>
              <p><strong>Name and Lastname:</strong> {filteredOrder.namelastname}</p>
              <p><strong>Address:</strong> {filteredOrder.address}</p>

              <div className="status-buttons">
                <div className="detail-inforow">
                  <span className="detail-infolabel">Transfer Slip:</span>
                  <button className="see-slip-button" onClick={handleShowSlip}>See the slip</button>
                </div>
                <div className="detail-inforow">
                  <span className="detail-infolabel">Payment Status:<p> !!{filteredOrder.payment_status}!!</p></span>
                  <span className="detail-infovalue">
                    <button className="accept-order-button" onClick={handleAcceptOrder}>Accept This Order</button>
                    <button className="reject-order-button" onClick={handleRejectOrder}>Reject This Order</button>
                  </span>
                </div>
                <div className="detail-inforow">
                  <span className="detail-infolabel">Packed status:<p> !!{filteredOrder.packed_status}!!</p></span>
                  <button className="Packedstatus-button"  onClick={handlePackedstatusOrder}>All Packed</button>
                </div>
                <div className="detail-inforow">
                  <span className="detail-infolabel">Delivery status:<p> !!{filteredOrder.delivery_status}!!</p></span>
                  <button className="delivery-status-sentbutton" onClick={handledeliveryOrder}>Sent The Packet</button>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {showSlip && (
          <div className="modal-overlay" onClick={handleCloseSlip}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={`http://localhost:13889${filteredOrder.slip_payment}`}
                alt="Transfer Slip"
                className="slip-image"
              />
              <button className="close-button" onClick={handleCloseSlip}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCheckOrderPage;
