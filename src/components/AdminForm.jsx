import React, { useState } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import '../css/signup.css'


const initialValues = [["detan", false],["facial", false],["hair-coloring",false],["hair-smoothening",false],["hair-spa",false],["hair-treatment",false],["hair-cut",false],["party-makeup",false],["pedicure", false],["waxing", false]]
const AdminForm = (props) => {
  console.log(props);
  const [name, setName] = useState(props?.name ||'');
 
  const [email, setEmail] = useState(props?.email ||'');
  const [password, setPassword] = useState('');
 const { pathname}=useLocation();
 const [checkbox, setCheckbox] = useState(props.services || initialValues);
 const navigate=useNavigate();
 


 
 

  const handleSubmit = async (e) => {
    e.preventDefault();
   if(props.name && props.email ){
   await  updateEmployeeDetails(name,email,checkbox);
   return;
   }

    try { 
      console.log("testing")
      const selectedServices = checkbox.filter(([_, checked]) => checked).map(([name]) => name);
      const response = await axios.post('http://localhost:4000/admin/signup', {
        name,
        services:selectedServices, 
        email, 
        password
      }, 
      
    
    )
  
     

      console.log(response)
      
      
    } 
  
    catch (error) { 
     
        console.log(error);
      }
      console.log(checkbox);
    
  };

  const updateEmployeeDetails=async(name,email,checkbox)=>{
    const token = localStorage.getItem('employeeToken');

    try {
        const response = await axios.put(`http://localhost:4000/admin/update-profile`,{name,email,services:checkbox}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });
        if(response.data){
          navigate(`/admin/dashboard`);
        }
        return response.data;
       
}
catch(err){
    console.log(err)
}
}

  return (
    
      <div className="form-container" >
       
         <h2 className="form-title">   { pathname==='/admin/signup' ?"Employee SignUp Form" :" Update Profile Form"}</h2> 
    <form onSubmit={handleSubmit} className="admin-form">
      <label>Name:</label>
      <input type="text" value={name} className="input-field" onChange={(e) => setName(e.target.value)} placeholder="Name" />
         {/* Displaying checkboxes with labels beside them */}
    {
      checkbox.map(([label, checked], index) => (
        <div key={index} className="checkbox-group">
          <input
            type="checkbox"
            checked={checked}
            className="checkbox-input"
            onChange={(e) => setCheckbox(prev => prev.map(([name, _], i) => i === index ? [name, e.target.checked] : [name, _]))}
          />
          <label className="checkbox-label">{label}</label>
        </div>
      ))
    }
      <label>Email:</label>
      <input type="email" value={email} className="input-field" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <label>Password:</label>
     { pathname==='/admin/signup' && <input type="password" value={password} className="input-field" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />}
      <button type="submit" className="submit-btn">Submit</button>
    </form>
   
    </div>
  );
};

export default AdminForm;
