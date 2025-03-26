import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './RegisterProductPage.css';
import { useNavigate } from 'react-router-dom';

function RegisterProductPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [productData, setProductData] = useState({
    lot_id: '',
    grade: '',
    RemainLotamount: '', 
    LotamountStock: '',
    exp_date: '',
    base_price: '',
    sale_price: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null); // New state for image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file  && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) { // Validate file type and size (max 5MB)) {
      setProductData((prevData) => ({
        ...prevData,
        image: file,
      }));
      const objectURL = URL.createObjectURL(file);
      setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the selected image
    } else {
      alert('Please select a valid image file (max size 5MB).');
    }	    
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('lot_id', productData.lot_id);
    formData.append('grade', productData.grade);
    formData.append('RemainLotamount', productData.RemainLotamount); // Add this field
    formData.append('LotamountStock', productData.LotamountStock); 
    formData.append('exp_date', productData.exp_date);
    formData.append('base_price', productData.base_price);
    formData.append('sale_price', productData.sale_price);
    formData.append('image', productData.image);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product registered successfully!');
      console.log('Product added:', response.data);
      navigate('/ProductList');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to register product. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="back-btn" onClick={() => navigate(`/admin/${userId}`)}>Back</div>
      <div className="confirm-btn" onClick={handleSubmit}>Confirm</div>

      <div className="register-product">Register Product</div>

      <div className="main-content">
        <div className="image-section">
          {/* Show preview image if selected, else show a placeholder */}
          {previewImage ? (
            <img src={DOMPurify.sanitize(previewImage)} alt="Preview" />
          ) : (
            <img src="pngtree-durian-png-image_9440762.png" alt="Durian" />
          )}
          <label className="upload-btn">
            <input
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            UPLOAD IMAGE
          </label>
        </div>

        <div className="form-section">
          {[
            { label: 'Lot (Harvest Date)', name: 'lot_id' },
            { label: 'Grade', name: 'grade' },
            { label: 'Remain Lot amount', name: 'RemainLotamount' },
            { label: 'Lot amount Stock', name: 'LotamountStock' },
            { label: 'Exp Date', name: 'exp_date' },
            { label: 'Base Price', name: 'base_price' },
            { label: 'Sale Price', name: 'sale_price' },
          ].map((field, index) => (
            <div key={index} className="form-row">
              <div className="form-label">{field.label}:</div>
              <input
                type="text"
                className="form-input"
                name={field.name}
                value={productData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RegisterProductPage;
