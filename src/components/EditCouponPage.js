import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCouponPage.css";

function EditCouponPage() {
  const navigate = useNavigate();
  const { coupon_id } = useParams(); // Get coupon ID from URL
  console.log("Extracted coupon_id:", coupon_id);
  const [coupon, setCoupon] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // Temporary status

  // Fetch coupon details by ID
  useEffect(() => {
    const fetchCouponDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/coupon/get-coupon-by-id/${coupon_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coupon details");
        }
        const data = await response.json();
        setCoupon(data);
        setSelectedStatus(data.coupon_status); // Set initial status
      } catch (error) {
        console.error("Error fetching coupon details:", error);
      }
    };

    fetchCouponDetails();
  }, [coupon_id]);

  // Function to update coupon status
  const handleConfirm = async () => {
    if (!coupon) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/coupon/${selectedStatus === "AVAILABLE" ? "reActivateCoupon" : "disableCoupon"}/${coupon.coupon_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setCoupon((prev) => ({ ...prev, coupon_status: selectedStatus })); // Update state
      alert(`Coupon ${selectedStatus.toLowerCase()}d successfully!`);
    } catch (error) {
      console.error("Error updating coupon status:", error);
      alert("Failed to update coupon status.");
    }
  };

  return (
    <div className="edit-coupon-container">
      <button onClick={() => navigate("/AdminCouponPage")} className="back-button-edit-coupon">
        Back
      </button>

      <h1 className="header-text">Edit Coupon</h1>

      {coupon ? (
        <div className="edit-coupon-data">
          
        <div className="input-wrapper">
          <label className="label-container">discount_details</label>
          <p> {coupon.discount_details}</p>
        </div>
        <div className="input-wrapper">
          <label className="label-container">coupon_code</label>
          <p> {coupon.coupon_code}</p>
        </div>
        <div className="input-wrapper">
          <label className="label-container">coupon_condition</label>
          <p> {coupon.coupon_condition}</p>
        </div>

          {/* Status Selection */}
          <div className="status-container">
            <span>Status</span>
            <button
              onClick={() => setSelectedStatus("AVAILABLE")}
              className={selectedStatus === "AVAILABLE" ? "status-button-selected" : "status-button-unselected"}
            >
              AVAILABLE
            </button>
            <button
              onClick={() => setSelectedStatus("UNAVAILABLE")}
              className={selectedStatus === "UNAVAILABLE" ? "status-button-selected" : "status-button-unselected"}
            >
              UNAVAILABLE
            </button>
          </div>

          {/* Confirm Button */}
          <button onClick={handleConfirm} className="edit-confirm-button">
            Confirm
          </button>
        </div>
      ) : (
        <p>Loading coupon details...</p>
      )}
    </div>
  );
}

export default EditCouponPage;
