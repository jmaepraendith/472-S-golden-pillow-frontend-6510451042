import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./CouponPage.css";

function CouponPage() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/coupon/available-coupon`);
        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div className="coupon-page-container">
      <button onClick={() => navigate('/home')} className="back-button-coupon">Back</button>
      <h1 className="header-text">Coupons!</h1>
      <div className="coupon-section">
        {coupons.map((coupon, index) => (
          <div key={index} className="coupon-container">
            <div className="coupon-header">{coupon.discount_details}</div>
            <div className="coupon-code">{coupon.coupon_code}</div>
            {coupon.coupon_condition && (
              <div className="coupon-conditions">{coupon.coupon_condition}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CouponPage;
