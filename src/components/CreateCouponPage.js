import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./CreateCouponPage.css";

function CreateCoupon() {
  const navigate = useNavigate();
  const [couponData, setCouponData] = useState({
      discount_details: '',
      coupon_code: '',
      coupon_condition: '', 
      coupon_status: '',
    });

    const checkCouponCode = async (coupon_code) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/coupon/check-coupon/${coupon_code}`);
        if (response.status === 409) {
          alert('This coupon code is already taken');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error checking coupon code:', error);
        alert('An error occurred while checking the coupon code.');
        return false;
      }
    };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isCouponCodeAvailable = await checkCouponCode(couponData.coupon_code);
    if (!isCouponCodeAvailable) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/coupon/createCoupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discount_details: couponData.discount_details,
          coupon_code: couponData.coupon_code,
          coupon_condition: couponData.coupon_condition,
          coupon_status: couponData.coupon_status || "AVAILABLE",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        if (!response.ok) throw new Error("Server error");

        console.log('Coupon added:', result);
        alert('Coupon registered successfully!');
      } else {
        alert(`failed to register coupon: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
      alert('Failed to register coupon. Please try again.');
    }

    console.log("Coupon Data:", couponData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="create-coupon-container">
      <div>
        <button onClick={() => navigate('/AdminCouponPage')} className="back-button-create-coupon">Back</button>
      </div>

      <h1 className="header-text">Create Coupons!</h1>

      <div className="create-coupon-input">
        {/* Discount Details */}
        <div className="input-wrapper">
          <label className="label-container">discount_details</label>
          <input
            type="text"
            className="input-container"
            name="discount_details"
            value={couponData.discount_details}
            onChange={handleChange}
            required
          />
        </div>

        {/* Coupon Code */}
        <div className="input-wrapper">
          <label className="label-container">coupon_code</label>
          <input
            type="text"
            className="input-container"
            name="coupon_code"
            value={couponData.coupon_code}
            onChange={handleChange}
            required
          />
        </div>

        {/* Coupon Condition */}
        <div className="input-wrapper">
          <label className="label-container">coupon_condition</label>
        </div>
        
        {/* Condition Text Area */}
        <div className="input-wrapper">
        <textarea
            placeholder="Condition"
            className="text-area-container"
            value={couponData.coupon_condition}
            name="coupon_condition"
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Status Selection */}
        <div className="status-container">
          <span>Status</span>
          <div className="status-space"></div>
          <button
            onClick={() => setCouponData((prevData) => ({ ...prevData, coupon_status: "AVAILABLE" }))}
            className={couponData.coupon_status === "AVAILABLE" ? "status-button-selected" : "status-button-unselected"}
          >
            AVAILABLE
          </button>

          <button
            onClick={() => setCouponData((prevData) => ({ ...prevData, coupon_status: "UNAVAILABLE" }))}
            className={couponData.coupon_status === "UNAVAILABLE" ? "status-button-selected" : "status-button-unselected"}
          >
            UNAVAILABLE
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <button type="submit" className="create-confirm-button" onClick={handleSubmit}>
        Confirm
      </button>
    </div>
  );
}

export default CreateCoupon;
