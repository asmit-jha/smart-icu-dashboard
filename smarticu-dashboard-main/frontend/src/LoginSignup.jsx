import React, { useState } from 'react';
import './App.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    image: null,
    terms: false,
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      name: formData.name,
      password: formData.password,
    };
  
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Login successful');
        // Redirect to dashboard page
        window.location.href = 'http://localhost:3000/dashboard';
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong');
    }
  };
  

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('image', formData.image);
    formDataToSubmit.append('terms', formData.terms);

    try {
      const response = await fetch('http://localhost:3001/api/users/create', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful');
        setIsLogin(true); // Switch to login view after successful registration
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="login-background">
      <div className="loginSignupCard">
        <div className="wrapper">
          <span className="icon-close" onClick={() => alert('Close button clicked')}>
            <ion-icon name="close"></ion-icon>
          </span>

          {isLogin ? (
            <div className="form-box login">
              <h2>Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="input-box">
                  <span className="icon"><ion-icon name="person"></ion-icon></span>
                  <label>Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
                  <label>Password</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn">Login</button>
                <div className="login-register">
                  <p>Don't have an account?
                    <a href="#" className="register-link" onClick={() => setIsLogin(false)}> Register</a>
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="form-box register">
              <h2>Registration</h2>
              <form onSubmit={handleRegisterSubmit} encType="multipart/form-data">
                <div className="input-box">
                  <span className="icon"><ion-icon name="person"></ion-icon></span>
                  <label>Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="icon"><ion-icon name="mail"></ion-icon></span>
                  <label>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
                  <label>Password</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="icon"><ion-icon name="call"></ion-icon></span>
                  <label>Phone</label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <span className="icon"><ion-icon name="image"></ion-icon></span>
                  <label>Upload Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="remember-forgot">
                  <label>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                    />
                    I agree to the terms & conditions
                  </label>
                </div>
                <button type="submit" className="btn">Register</button>
                <div className="login-register">
                  <p>Already have an account?
                    <a href="#" className="login-link" onClick={() => setIsLogin(true)}> Login</a>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
