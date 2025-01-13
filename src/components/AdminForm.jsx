import React, { useState } from 'react';

const AdminForm = () => {
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your API call here
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
 
       window.location.href = '/dashboard';
       } 
       
      }
       catch (error) { 
        alert("Failed to connect to server");
        console.log(error); 
      }
  };

  const handleServiceChange = (event) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setServices(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <select multiple={true} value={services} onChange={handleServiceChange}>
        <option value="detan">Detan</option>
        <option value="facial">Facial</option>
        <option value="hair-coloring">Hair coloring</option>
        <option value="hair-smoothening">Hair smoothening</option>
        <option value="hair-spa">Hair spa</option>
        <option value="hair-treatment">Hair treatment</option>
        <option value="hair-cut">Hair cut</option>
        <option value="party-makeup">Party makeup</option>
        <option value="pedicure">Pedicure</option>
        <option value="waxing">Waxing</option>
      </select>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AdminForm;
