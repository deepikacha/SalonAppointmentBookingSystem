import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminForm from './components/AdminForm';
import AdminLogin from './components/AdminLogin';
import UserForm from './components/UserForm';
import UserLogin from './components/UserLogin';
import EmployeeTimeslots from './components/EmployeeTimeslots';
import AdminProfile from './components/AdminProfile';
import UserTimeslots from './components/UserTimeslots';
import UserDashboard from './components/UserDashboard';
import DisplayTimeslots from './components/DisplayTimeslots';
import UserProfile from './components/UserProfile';



export default function App() {
  return (
    <Router>
      <div>
        <Routes>
        
          <Route path="/" element={<UserLogin />} />
          
          <Route path="/admin/signup" element={<AdminForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/signup" element={<UserForm />} />
          <Route path="/admin/profile" element={<AdminProfile/>}/>
          <Route path="/user/profile" element={<UserProfile/>}/>
          
         
          <Route path="/admin/dashboard" element={<EmployeeTimeslots />} />
          <Route path="/user/dashboard" element={<UserDashboard/>}/>
          <Route path="/user/timeslots/:timeslotId" element={<DisplayTimeslots/>}/>
        

        
         

          {/* Add routes for other components or pages as needed */}
        </Routes>
      </div>
    </Router>
  );
}
