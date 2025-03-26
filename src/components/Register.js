import React, { useState } from 'react';
import './Register.css'; // Ensure the CSS file is imported
import { useNavigate } from 'react-router-dom'; // For navigation

function Register() {
  const navigate = useNavigate(); // Use React Router's navigate for redirection

  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    lastname: '',
    phone_number: '',
    province: '',
    district: '',
    name_road: '',
    house_details: '',
    address: '',
    postal_code: '',
  });

  // Function to check if the username is already taken
  const checkUsername = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/check-username/${username}`);
      if (response.status === 409) {
        alert('Username is already taken');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      alert('An error occurred while checking the username.');
      return false;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // 2. Check if all fields are filled
    for (const key in userData) {
      if (!userData[key]) {
        alert(`Please fill the ${key} field.`);
        return;
      }
    }

    // 3. Validate email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) {
      alert('Invalid email address');
      return;
    }

    // 4. Check if username is already taken
    const isUsernameAvailable = await checkUsername(userData.username);
    if (!isUsernameAvailable) return;

    // 5. Send data to backend if validations pass
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('User registered successfully!');
        navigate('/login'); // Redirect to login page
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="register-container">
      <h1 className="titlesg">Sign Up</h1>
      <form onSubmit={handleRegister} className="register-form">
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
        </div>

        <h2 className="section-title">User Details</h2>
        <div className="user-details">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />
        </div>

        <h2 className="section-title">Address</h2>
        <div className="address-details">
          <input
             type="text"
             name="address"
            placeholder="Address"
             onChange={handleChange}
             required
          />
          <input
            type="text"
            name="province"
            placeholder="Province"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="district"
            placeholder="District and Sub-District"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name_road"
            placeholder="Road"
            onChange={handleChange}
          />
          <input
            type="text"
            name="house_details"
            placeholder="House Details"
            onChange={handleChange}
          />
          <input
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="confirm-buttonsg">
          Confirm Your Detail
        </button>
      </form>
    </div>
  );
}

export default Register;
