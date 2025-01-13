import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try { 
        const response = await axios.post('http://localhost:3000/admin/signup', {
       name,
       services, 
       email, 
       password
       }, 
       { 
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
       }); 
       if (response.status === 200 || response.status === 201) { 
        const { token, email, name } = response.data;
         localStorage.setItem('token', token); 
         localStorage.setItem('email', email); 
         localStorage.setItem('name', name); 
         alert("Sign up successful!"); 
         window.location.href = '/dashboard';
         } 
         else { alert("Sign up unsuccessful!"); 
  
         } 
        }
         catch (error) { 
          alert("Failed to connect to server");
          console.log(error); 
        }
    };
  

   
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default UserForm;
