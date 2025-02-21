import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/loginForm.css'


const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:4000/user/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include credentials if needed
      });

      
        const { token, email, name } = response.data;
        console.log(response.data);
        localStorage.setItem('token', token);
        localStorage.setItem("email",email);
       

        // Redirect to the desired page
        navigate(`/user/dashboard`);
     
    } catch (error) {
      console.error('Error:', error);
     
    }
  };

  return (
    <div className="Admincontainer">
      <h2  className="AdminHeading">Customer Login Form</h2>
      <form onSubmit={handleSubmit} className="Adminform" >
        <div className="AdminemailContainer">
          <label >Email:</label>
          <input  
            type="email"
            id="email"
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="passwordContainer">
          <label >Password:</label>
          <input 
            type="password"
            id="password"
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="submit" type="submit">Login</button>
        <Link to="/user/signup" className="signin-button"> Sign in</Link>
      </form>
    </div>
  );
};

export default UserLogin;
