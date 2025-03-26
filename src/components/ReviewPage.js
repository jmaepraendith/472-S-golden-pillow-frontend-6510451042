import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReviewPage.css";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ดึงค่าที่ส่งมาจาก Order Page
  const {
    order_id = "N/A",
    lot_id = "N/A",
    grade = "N/A",
    username = "Guest",
    product_image: image_path = "default-durian.jpg",
  } = location.state || {};

  // State สำหรับรีวิว
  const [star, setStar] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // ตรวจสอบว่าเป็นการแก้ไขหรือสร้างใหม่

  // ดึงข้อมูลรีวิวเก่า ถ้ามี
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/reviews?lot_id=${lot_id}&grade=${grade}&username=${username}`
        );
        const data = await response.json();

        if (data.length > 0) {
          setReviewId(data[0].review_id);
          setStar(data[0].star);
          setComment(data[0].comment);
          setIsEditing(true); // ถ้ามีรีวิวแล้ว จะเป็นโหมดแก้ไข
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [lot_id, grade, username]);

  // ฟังก์ชันอัปเดตคอมเมนต์
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // ฟังก์ชันส่งหรือแก้ไขรีวิว
  const handleSubmitReview = async () => {
    if (!comment.trim()) return alert("กรุณาใส่คอมเมนต์!");

    const reviewData = { lot_id, grade, username, order_id, star, comment };

    try {
      let response;
      if (isEditing) {
        // 🛠️ เรียก API อัปเดตรีวิว
        response = await fetch(
          `${import.meta.env.VITE_API_URL}/reviews/edit/${reviewId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData),
          }
        );
      } else {
        // 🛠️ เรียก API สร้างรีวิวใหม่
        response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
      }

      if (response.ok) {
        alert(isEditing ? "รีวิวของคุณถูกอัปเดตแล้ว!" : "รีวิวของคุณถูกส่งเรียบร้อยแล้ว!");
        navigate(-1); // กลับไปหน้าก่อนหน้า
      } else {
        alert("เกิดข้อผิดพลาด ไม่สามารถส่งรีวิวได้");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="review-page-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>

      <div className="review-header">
        <h1>Grade: {grade} <br /> Lot: {lot_id}</h1>
        <img
          src={`http://localhost:13889${image_path.startsWith("/") ? image_path : `/images/${image_path}`}`}
          onError={(e) => (e.target.src = "http://localhost:13889/images/default-durian.jpg")}
          alt="Product"
          className="product-image"
        />
      </div>

      <div className="review-form">
        <div className="h3-send">
          <h3>Your Review 🖍️</h3>
        </div>

        {/* ดาวให้คะแนน */}
        <div className="rating">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={s <= star ? "star filled" : "star"}
              onClick={() => setStar(s)}
            >
              ★
            </span>
          ))}
        </div>

        {/* กล่องใส่คอมเมนต์ */}
        <textarea
          name="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="พิมพ์รีวิวของคุณที่นี่..."
        ></textarea>

        {/* ปุ่ม Submit หรือ Edit */}
        <button className="submit-button" onClick={handleSubmitReview}>
          {isEditing ? "Edit your review" : "Submit your review"}
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;
