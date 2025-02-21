import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminForm from './AdminForm';

export default function AdminProfile() {
    const [profileData, setProfileData] = useState({});
   

    useEffect(() => {
        fetchEmployeeDetails();
        
        console.log("fetch");
    }, []);

    const fetchEmployeeDetails = async () => {
      
        const token = localStorage.getItem('employeeToken');
        try {
            const response = await axios.get(`http://localhost:4000/admin/employee-profile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });
            
            const initialValues = [["detan", false], ["facial", false], ["hair-coloring", false], ["hair-smoothening", false], ["hair-spa", false], ["hair-treatment", false], ["hair-cut", false], ["party-makeup", false], ["pedicure", false], ["waxing", false]];
            
            const services=JSON.parse(response.data.services);
            const set=new Set(services);
            console.log(services)
            const options=initialValues.map(option=>{
                if(set.has(option[0])){

                    return [option[0],true];
                    
                }
                return [option[0],false]
                
               
            })
            console.log(options) 
            

            setProfileData({
                name: response.data.name,
                email: response.data.email,
                services: services.length>0?options:initialValues,
            });
        } catch (err) {    
            console.log(err);
        }
    };

   

    return (
        <>
            <div>AdminProfile</div>
            {Object.keys(profileData).length  ? <AdminForm name={profileData.name} email={profileData.email}  services={profileData.services}/>:<h1>loading</h1>}
        </>
    );
}
