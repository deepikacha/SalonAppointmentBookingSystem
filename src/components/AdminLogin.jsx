import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/loginForm.css'

const Login = () => {
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
      const response = await axios.post('http://localhost:4000/admin/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
          
        },
        withCredentials: true, // Include credentials if needed
      });
      const { token, employeeId } = response.data;
      localStorage.setItem('employeeToken', response.data.token);
      
     
      

      console.log(response);
      navigate(`/admin/dashboard`);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while trying to log in. Please try again later.');
    }
  };

  return (
    <div className="Admincontainer">
      <h2 className="AdminHeading" >Employee Login Form</h2>
      <form onSubmit={handleSubmit} className="Adminform">
        <div className="AdminemailContainer">
          <label for="email">Email:</label>
          <input type="email"value={email} id="email"   placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div className="passwordContainer">
          <label for="password">Password:</label>
          <input type="password" value={password}  id="password"  placeholder="Enter your password"  onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="submit" type="submit">Login</button>
       <Link to="/admin/signup" className="signin-button"> Sign in</Link>
      </form>
    </div>
  );
};

export default Login;
