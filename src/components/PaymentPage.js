import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from "lucide-react";
import './PaymentPage.css';

const PaymentPage = () => {
  const [order, setOrder] = useState({});
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Track if a file is uploaded
  const { orderId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
  const [isOpen, setIsOpen] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // Fetch order details when the component loads
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/order/${orderId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched order data:', data); // Debugging
        setOrder(data); // Store the entire response
      })
      .catch((error) => console.error('Error fetching order data:', error));
  }, [orderId]);

  // Handle order cancellation
  const handleCancelOrder = () => {
    fetch(`${import.meta.env.VITE_API_URL}/order/${orderId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to cancel order');
        }
        console.log('Order cancelled successfully');
        navigate(`/cart/${userId}`); 
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
        alert('Failed to cancel the order. Please try again.');
      });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    const formData = new FormData();
    formData.append('image', file); // Append the file to the form data

    // Send the file to the backend
    fetch(`${import.meta.env.VITE_API_URL}/upload/${orderId}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded and order updated:', data);
        setIsFileUploaded(true); // Set upload status to true
        alert('File uploaded successfully!');

        setFileName(file.name);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert('Failed to upload the file.');
      });
  };

  // Handle the Done button click
  const handleDone = () => {
    if (!isFileUploaded) {
      alert('Please upload a payment proof before proceeding.');
      return;
    }

    const cartId = order.cart_id; // Get the cart_id from the order data

    // Delete all items in the cart by cart_id
    fetch(`${import.meta.env.VITE_API_URL}/cart/clearitems/${cartId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete products from cart.');
        }
        console.log('Products in cart cleared successfully.');

        // Navigate to the Order Page after deleting products
        navigate(`/order/${orderId}`);
      })
      .catch((error) => {
        console.error('Error deleting products from cart:', error);
        alert('Failed to delete products. Please try again.');
      });
  };

  const handleApplyCoupon = async () => {
    const coupon_code = document.getElementById("coupon_code").value.trim();

    if (!coupon_code) {
        alert("Please enter a coupon code.");
        return;
    }

    try {
      const cartResponse = await fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}/item-count`, {
        method: "GET",
      });
      
      if (!cartResponse.ok) {
          alert("Failed to fetch cart details");
          return;
      }
      
      const cartData = await cartResponse.json();
      console.log("Cart Data:", cartData);

      
      // Extract totalAmount from the cart response
      const totalAmount = cartData.totalAmount; 
      console.log(totalAmount);

        // Step 1: Verify if the coupon is valid
        const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/coupon/check-coupon-condition`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                total_price: order.total_price,
                total_products: totalAmount,
                coupon_code: coupon_code 
            })
        });

        console.log(order.total_price);
        console.log(order.total_products);

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok) {
            alert(verifyResult.message);
            return;
        }

        console.log(verifyResult.message); // "Coupon can be used"

        // Step 2: Apply the discount
        const discountResponse = await fetch(`${import.meta.env.VITE_API_URL}/coupon/coupon-discount`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                original_price: order.total_price, 
                coupon_code: coupon_code 
            })
        });

        const discountResult = await discountResponse.json();

        if (discountResponse.ok) {
            setDiscountedPrice(discountResult.discounted_price);
            console.log("Coupon applied! Discounted price: " + discountResult.discounted_price + " Baht");
            
        } else {
            alert(discountResult.message);
        }
    } catch (error) {
        console.error("Error applying coupon:", error);
        alert("Failed to apply coupon. Please try again.");
    }
};

  return (
    <div className="payment-container">
      <button className="payment-cancel-button" onClick={handleCancelOrder}>
        Cancel Order
      </button>
      <h1 className="payment-title">Payment</h1>
      <div className="payment-details">
        <div className="qr-code-section">
          <h2 className="qr-title">QR CODE</h2>
          <img
            src={`http://localhost:13889/images/qrcode.jpg`}
            alt="QR Code"
            className="qr-code"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.jpg'; // Fallback image
            }}
          />
          {/* <div className="total-amount">Total {order.total_price || '...'} Baht</div> */}
          <div className="total-amount">
            Total {discountedPrice !== null ? discountedPrice : order.total_price || '...'} Baht
          </div>
        </div>
        <div className="order-details">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Name:</strong> {order.user?.name}</p>
          <p><strong>Address:</strong> {order.user?.address}</p>
        </div>
      </div>
      {/*code using section*/}
      <div>
        {/* Header Section - Toggle Button */}
        <button
          className="code-input-header"
          onClick={() => setIsOpen(!isOpen)}
        >
          Use code for discount
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Expandable Coupon Section */}
        {isOpen && (
          <div className={`code-input-container ${isOpen ? "open" : ""}`}>
            <input 
            className="input-box"
            type="text" id="coupon_code" placeholder="Enter Coupon Code"/>
            <button className="use-button" id="applyCoupon" onClick={handleApplyCoupon}>
              USE
            </button>
          </div>
        )}
      </div>
      {/* end of code using*/}
      <div className="upload-section">
        <p>{fileName ? `${fileName} attached` : "Please attach a proof of payment/transfer slip."}</p>
        <div className='upload-button-container'>
          <button className='upload-button' type='file' onClick={handleClick}>UPLOAD</button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

      </div>
      <div className='done-button-container'>
        <button className="done-button" onClick={handleDone}>
            DONE
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
