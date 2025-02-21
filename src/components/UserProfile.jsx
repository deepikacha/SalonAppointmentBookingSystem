import { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';

export default function UserProfile() {
    const [profileData, setProfileData] = useState({});
   

    useEffect(() => {
        fetchUserDetails();
        
        console.log("fetch");
    }, []);

    const fetchUserDetails = async () => {
      
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:4000/user-profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
            
            
           
           
            

            setProfileData({
                name: response.data.name,
                email: response.data.email,
                age:response.data.age
            });
        } catch (err) {    
            console.log(err);
        }
    };

   

    return (
        <>
            <div>UserProfile</div>
            {Object.keys(profileData).length  ? <UserForm name={profileData.name} email={profileData.email}  age={profileData.age}/>:<h1>loading</h1>}
        </>
    );
}
