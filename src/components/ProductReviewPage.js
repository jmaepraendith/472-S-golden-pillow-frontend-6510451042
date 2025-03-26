import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductReviewPage.css';
import axios from 'axios';

const ProductReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, userId, username } = location.state || {};

  if (!username) {
    alert('คุณต้องเข้าสู่ระบบเพื่อเขียนรีวิว!');
  }

  const [reviews, setReviews] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [newReview, setNewReview] = useState({ star: 5, comment: '' });
  const [star, setStar] = useState(5);

  const fetchReviews = async (star) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews?lot_id=${product.lot_id}&grade=${product.grade}${star ? `&star=${star}` : ''}`);
      const data = await response.json();
      console.log('Fetched reviews:', data); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }; 

  const filterReviews = (star) => {
    setSelectedStar(star !== null ? Number(star) : null);
  };

  const filteredReviews = selectedStar
  ? reviews.filter((review) => Number(review.star) === Number(selectedStar))
  : reviews;

  useEffect(() => {
    fetchReviews(selectedStar);
    console.log('Selected Star:', selectedStar);
    console.log('Fetched Reviews:', reviews);
  }, [product.lot_id, product.grade, selectedStar]);

  const handleFeedback = async (reviewId, action) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews/feedback/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      const updatedReview = await response.json();

      // อัปเดตค่า like_count และ dislike_count ใน state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === reviewId ? updatedReview : review
        )
      );
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const [averageRating, setAverageRating] = useState(0);
const [reviewCount, setReviewCount] = useState(0);

useEffect(() => {
  if (product?.lot_id && product?.grade) {
      console.log("Fetching reviews for:", `"${product.lot_id}"`, `"${product.grade}"`);
      axios.get(`${import.meta.env.VITE_API_URL}/reviews1/average-rating`, {
        params: {
            lot_id: product.lot_id,
            grade: product.grade
        }
      })
      .then((response) => {
        if (response.data) {
            setAverageRating(Number(response.data.average) || 0);
            setReviewCount(response.data.count ?? 0);
            console.log(averageRating)
        }
      })
      .catch((error) => {
        console.error("Error fetching average rating:", error.response?.data);
      });
  }
}, [product]);


  return (
    <div className="review-page-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>

      <div className="review-header">
        <h1>Grade: {product.grade}<br /> Lot: {product.lot_id}</h1>
        <img src={`${import.meta.env.VITE_API_URL}${product.image_path}`} alt="Durian" className="durian-image" />
      </div>

      <span className="rating">{averageRating} ⭐ ({reviewCount} reviews)</span>

      {/* ปุ่มกรองดาว */}
        <div className="review-filters">
          <button 
            className={`filter-button ${selectedStar === null ? "selected" : ""}`} 
            onClick={() => filterReviews(null)}
          >
            All
          </button>
          {[1, 2, 3, 4, 5].map((s) => (
            <button 
              key={s} 
              className={`filter-button ${selectedStar === s ? "selected" : ""}`} 
              onClick={() => filterReviews(s)}
            >
              {s} <span className="star">★</span>
            </button>
          ))}
        </div>


      {/* รายการรีวิว */}
      <div className="review-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div className="review-card" key={review.review_id}>
              <div className="review-header2">
                <h3 className="username">{review.username}</h3>
                <div className="like-dislike-buttons">
                  <button className="like-button" onClick={() => handleFeedback(review.review_id, 'like')}>
                    👍
                  </button>
                  <span>{review.like_count}</span>
                  <button className="dislike-button" onClick={() => handleFeedback(review.review_id, 'dislike')}>
                    👎
                  </button>
                  <span>{review.dislike_count}</span>
                </div>
              </div>
              <p className="rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`star ${s <= review.star ? "filled" : ""}`}>
                    ★
                  </span>
                ))}
              </p>
                    <p className="review-comment">{review.comment}</p>
                  </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviewPage;
