import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import '../css/userSignup.css'

const UserForm = (props) => {
  console.log(props);
  const [name, setName] = useState(props?.name ||'');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState(props?.email ||'');
  const [password, setPassword] = useState('');
  const { pathname}=useLocation();
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(props.name && props.email ){
    await  updateUsereDetails(name,email,age);
    return;
    }
    try { 
        const response = await axios.post('http://localhost:4000/user/signup', {
       name,
       age, 
       email, 
       password
       }, 
       { 
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
       }); 
       console.log(response);
        }
         catch (error) { 
          console.log(error);
        }
    };

    const updateUsereDetails=async(name,email,age)=>{
      const token = localStorage.getItem('token');
  
      try {
          const response = await axios.put(`http://localhost:4000/user/update-profile`,{name,email,age}, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token,
              },
          });
          if(response.data){
            navigate(`/user/dashboard`);
          }
          return response.data;
         
  }
  catch(err){
      console.log(err)
  }
  }
  
  return (
    <div className="UserContainer"  >
    <h2 > { pathname==='/user/signup' ?"User SignUp Form" :" Update Profile Form"}</h2> 
    <form onSubmit={handleSubmit} className="UserForm">
      <label>Name:</label>
      <input type="text" value={name} className="UserInput" onChange={(e) => setName(e.target.value)} placeholder="Enter your Name" />
      <label>Age:</label>
      <input type="number" value={age} className="UserInput" onChange={(e) => setAge(e.target.value)} placeholder="Enter your Age" />
      <label>Email:</label>
      <input type="email" value={email}  className="UserInput"onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" />
      <label>Password:</label>
     {pathname==='/user/signup' && <input type="password" value={password} className="UserInput" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" />}
     <button type="submit" className="UserSubmit">Submit</button>
    </form>
    </div>
  );
};

export default UserForm;
