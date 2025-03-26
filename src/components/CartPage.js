import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';
import { useParams } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched cart items:', data); // Check the response structure
      if (data.items) {
        setCartItems(data.items);
      }
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}, [userId]);


  const handleRemoveItem = (productInCartId) => {
    // Remove single item from cart
    fetch(`${import.meta.env.VITE_API_URL}/cart/item/${productInCartId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete cart item');
        }
        return response.json();
      })
      .then(() => {
        // Filter out the removed item from the cartItems state
        setCartItems((items) =>
          items.filter((item) => item.product_in_cart_id !== productInCartId)
        );
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleCancelAll = () => {
    // Remove all items from the cart for the current user
    fetch(`${import.meta.env.VITE_API_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to clear the cart');
        }
        return response.json();
      })
      .then(() => {
        setCartItems([]); // Clear cart items in the frontend
      })
      .catch((error) => {
        console.error('Error clearing cart:', error);
      });
  };

  const handleIncreaseAmount = (productInCartId, currentAmount) => {
    // Increase the amount of the product in the cart
    const newAmount = currentAmount + 1;
    fetch(`${import.meta.env.VITE_API_URL}/cart/item/${productInCartId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: newAmount }),
    })
      .then((response) => response.json())
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_in_cart_id === productInCartId
              ? { ...item, amount: newAmount }
              : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating item amount:', error);
      });
  };

  const handleDecreaseAmount = (productInCartId, currentAmount) => {
    if (currentAmount <= 1) return; // Do not decrease below 1

    // Decrease the amount of the product in the cart
    const newAmount = currentAmount - 1;
    fetch(`${import.meta.env.VITE_API_URL}/cart/item/${productInCartId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: newAmount }),
    })
      .then((response) => response.json())
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_in_cart_id === productInCartId
              ? { ...item, amount: newAmount }
              : item
          )
        );
      })
      .catch((error) => {
        console.error('Error updating item amount:', error);
      });
  };

  const handlePayAll = () => {
    // Handle payment and create order
    fetch(`${import.meta.env.VITE_API_URL}/order/${userId}/payall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create order');
        }
        return response.json();
      })
      .then((data) => {
        if (data.redirectUrl) {
          navigate(data.redirectUrl);
        } else {
          throw new Error('Order creation failed');
        }
      })
      .catch((error) => {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
      });
  };
  
  

  const handleBackToHome = () => {
    navigate('/home'); 
  };

  return (
    <div className="cart-container">
      <div className="cart-title">Your Cart</div>
      <button className="back-buttoncart" onClick={handleBackToHome}>
        Back
      </button>
  
      <div className="cart-items-container">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.product_in_cart_id} className="cart-item">
              <img
              src={`${import.meta.env.VITE_API_URL}/images/lot002.png`}
              alt="Durian"
                className="product-imagecart"
              />
              <div className="product-infocart">
                <div className="product-lot-grade">
                  Product Lot {item.lot_id} Grade {item.grade}
                </div>
                <div className="product-price">Price each: {item.product.sale_price} Baht</div>
                <div className="product-amount">Amount: {item.amount}</div>
              </div>
              
              <button
                className="cart-cancel-button"
                onClick={() => handleRemoveItem(item.product_in_cart_id)}
              >
                Cancel
              </button>
              <div className="amount-control">
                <button
                  className="amount-button"
                  onClick={() =>
                    handleIncreaseAmount(item.product_in_cart_id, item.amount)
                  }
                >
                  +
                </button>
                <button
                  className="amount-button"
                  onClick={() =>
                    handleDecreaseAmount(item.product_in_cart_id, item.amount)
                  }
                >
                  -
                </button>
              </div>
            </div>
          ))
        )}
      </div>
  
      {cartItems.length > 0 && (
        <div className="cart-actions-container">
          <button className="cancel-all-button" onClick={handleCancelAll}>
            Cancel All
          </button>
          <button className="pay-all-button" onClick={handlePayAll}>
            Pay All
          </button>
        </div>
      )}
    </div>
  );
  
};

export default CartPage;
