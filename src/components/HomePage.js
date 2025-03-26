import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
  // const username = localStorage.getItem('username'); // Retrieve the userId from localStorage

  
  useEffect(() => {
    // Fetch product data from the backend API
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data); // Debugging
        const availableProducts = data.filter((item) => item.status === 'Available');
        setProducts(availableProducts);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);
  
const product = products[currentIndex];
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



  const handleNextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const gotoProductReviewPage = (product) => {
    const username = localStorage.getItem('username');
    navigate('/reviews', { state: { product, userId, username } });
  };  
  
  const handleAddToCart = () => {
    const product = products[currentIndex];
    
  
    if (!userId) {
      console.error('User ID is missing!');
      alert('Please log in again.');
      navigate('/login'); // Redirect to login if userId is missing
      return;
    }
  
    if (product) {
      fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lot_id: product.lot_id,
          grade: product.grade,
          amount: 1,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to add item to cart');
          return response.json();
        })
        .then(() => {
          console.log('Product added to cart successfully');
          navigate(`/cart/${userId}`); // Navigate to the user’s cart page
        })
        .catch((error) => console.error('Error adding to cart:', error));
    }
  };
  

  return (
    <div className="home-page-container">
      {/* Header Bar */}
      <div className="header-bar">
        <h1 className="logo">Golden Pillow</h1>
        <div className="nav-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>Log out</button>
          <button className="cart-button" onClick={() => navigate(`/cart/${userId}`)}>Cart</button>
          <button className="profile-button" onClick={() => navigate(`/profile/${userId}`)}>Profile</button>
          <button className="profile-button" onClick={() => navigate("/CouponPage")}>Coupon</button>
        </div>
      </div>

      {/* Product Display Section */}
      <div className="product-display">
        <button className="nav-arrow left-arrow" onClick={handlePrevProduct}>
          &#8592;
        </button>

        <div className="product-info">
          <h2 className="product-grade">
            Grade: {product ? product.grade : '-'}
          </h2>
          <img
            src={`${import.meta.env.VITE_API_URL}/images/lot002.png`}
            alt="Durian"
            className="product-image-homepage"
          />
          <div className="product-details">
            <p>Lot: {product ? product.lot_id : '-'}</p>
            <p>Price: {product ? `${product.sale_price} Baht` : '-'}</p>
            <p>Amount: {product ? product.RemainLotamount : '-'}</p>

            <div className='product-review-cart'>
                <div className="product-reviews">
                  <h3>Product Reviews</h3>
                  <div className="review-summary">
                    <span className="rating">{averageRating}</span>
                    <span className="star">⭐</span>
                    <span className="review-count">({reviewCount} reviews)</span>
                    <button className="view-all-button" onClick={() => gotoProductReviewPage(product)}>
                      view all
                    </button>
                  </div>
                </div>
                <div className='product-cart'>
                  <button className="add-to-cart-button" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
              </div>
            </div>
            </div>
          </div>
        <button className="nav-arrow right-arrow" onClick={handleNextProduct}>
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default HomePage;
