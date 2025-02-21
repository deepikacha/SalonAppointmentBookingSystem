import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from "react-icons/fa"; 
import { Link } from 'react-router-dom';
import '../css/user.css'

const UserTimeslots = () => {
  const [userTimeslots, setUserTimeslots] = useState([]);
  const [completedTimeslots, setCompletedTimeslots]=useState([]);
  const [cancelledTimeslots, setCancelledTimeslots]=useState([]);

  const [timeslots, setTimeslots] = useState([]);

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filteredTimeslots, setFilteredTimeslots] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Make both API calls using Promise.all
        const [userTimeslotsResponse,completedTimeslots,cancelledTimeslotsResponse, timeslotsResponse] = await Promise.all([
          axios.get('http://localhost:4000/user/upcomingTimeslots', {
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
          }),
          axios.get('http://localhost:4000/user/completedTimeslots',{
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
          }),
          axios.get('http://localhost:4000/user/cancelledSlots',{
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
          }),
          axios.get('http://localhost:4000/user/timeslots', {
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
          }),
        ]);

        // Set the states for both responses
        console.log(userTimeslots)
        setUserTimeslots(userTimeslotsResponse.data || []);
        setCompletedTimeslots(completedTimeslots.data || []);
        setCancelledTimeslots(cancelledTimeslotsResponse.data || []);
       
        setTimeslots(timeslotsResponse.data || []);
        setFilteredTimeslots(timeslotsResponse.data || [])
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchAllData();
  }, []);

 const handleCancelTimeslot=async(id)=>{
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You are not logged in. Please log in to cancel a timeslot.');
    return;
  }

  
  try{
    const response=await axios.put(`http://localhost:4000/user/cancelslot/${id}`, {},{
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
    }
 
    )
    console.log(response.data)
    setUserTimeslots(userTimeslots.filter((slot)=>slot.id!==id));
    setCancelledTimeslots([...cancelledTimeslots, response.data.timeslot])

  }
  catch(err){
    console.log(err)
  }

 }

  const handleFeedbackSubmit=async()=>{
    console.log('Selected Slot:', selectedSlot);
  console.log('Feedback:', feedback);
    const token = localStorage.getItem('token');
    if (!selectedSlot || !feedback) {
      alert('Please provide feedback for the selected timeslot.');
      return;
    }
    try{
      const response=await axios.post('http://localhost:4000/user/feedback',{
        userTimeSlotId:selectedSlot.id,
        services:selectedSlot.services,
        feedback
      },{
        headers: { 'Content-Type': 'application/json', Authorization: token },
      })
      setCompletedTimeslots((prev)=>
        prev.map((slot)=>slot.id===selectedSlot.id?{...slot,feedback}:slot

        )
      )
       setFeedback('');
       setShowFeedbackForm(false);
       alert("feedback submitted successfully");
    }
    catch(err){
      console.log(err)
    }
  }
  
  const handleSearch=async(e)=>{
    const token = localStorage.getItem('token');
    e.preventDefault();
    try{
      const response=await axios.get('http://localhost:4000/searchTimeslot',{
        params:{query:searchInput},
      
        headers: { 'Content-Type': 'application/json', 'Authorization': token },})
        setFilteredTimeslots(response.data);
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div>
      <h1 >Welcome to Deepikas's Salon </h1>
      <nav>
     
        <form onSubmit={handleSearch} className="search-form">
         <div className="search-wrapper">
          <FaSearch className="search-icon" onClick={handleSearch} />
            <input type="text" placeholder="search by name or expertise" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
           </div>
           
        </form>
        <Link to="/user/profile" className="profile">Profile</Link>
    </nav>
      <h2>Upcoming Timeslots</h2>
      {userTimeslots.length > 0 ? (
        <ul>
          {userTimeslots.map((slot) => (
            <li key={slot.id}>
              Date: {new Date(slot.date).toLocaleDateString()} | Time: {slot.startTime}-{slot.endTime}
              <button onClick={()=>handleCancelTimeslot(slot.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Upcoming timeslots available for you.</p>
      )}

<h2>Completed Timeslots</h2>
      {completedTimeslots.length > 0 ? (
        <ul>
          {completedTimeslots.map((slot) => (
            <li key={slot.id}>
              Date: {new Date(slot.date).toLocaleDateString()} | Time: {slot.startTime}-{slot.endTime}
              <button onClick={()=>{
                setSelectedSlot(slot);
                setShowFeedbackForm(true);
                console.log('Feedback form opened for:', slot.id);
              }}>Feedback</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Completed timeslots available for you.</p>
      )}

      
{showFeedbackForm && (
        <div>
          <h3>Submit feedback for completed timeslot</h3>
          <textarea value={feedback} onChange={(e)=>setFeedback(e.target.value)} 
          placeholder='write your feedback here' cols="10" rows="5" style={{resize:"vertical", overflow:"auto", width:"50%",maxHeight:"150px"}}></textarea>
          <button onClick={handleFeedbackSubmit}>Submit</button>
          </div>
          
      )}

<h2>Cancelled Timeslots</h2>
      {cancelledTimeslots.length > 0 ? (
        <ul>
          {cancelledTimeslots.map((slot) => (
            <li key={slot.id}>
              Date: {new Date(slot.date).toLocaleDateString()} | Time: {slot.startTime}-{slot.endTime}
            </li>
          ))}
        </ul>
      ) : (
        <p>No Cancelled timeslots available for you.</p>
      )}

<h2>Available Timeslots</h2>
      {filteredTimeslots.length > 0 ? (
        filteredTimeslots.map((slot) => {
          let services;
          try {
            services = JSON.parse(slot.services);
            if (!Array.isArray(services)) {
              throw new Error('Parsed value is not an array');
            }
            services = services.join(' '); // Join array elements into a string
          } catch (error) {
            services = slot.EmployeeProfile?.services || 'No services available';
          }

          return (
            <div key={slot.id}>
              <p>{slot.name}</p>
              <p>
                <strong>Expertise:</strong> {services}
              </p>
              <a href={`/user/timeslots/${slot.id}`}>
                <button>View Timeslots</button>
              </a>
            </div>
          );
        })
      ) : (
        timeslots.map((slot) => {
          let services;
          try {
            services = JSON.parse(slot.services);
            if (!Array.isArray(services)) {
              throw new Error('Parsed value is not an array');
            }
            services = services.join(' '); // Join array elements into a string
          } catch (error) {
            services = slot.EmployeeProfile?.services || 'No services available';
          }

          return (
            <div key={slot.id}>
              <p>{slot.name}</p>
              <p>
                <strong>Expertise:</strong> {services}
              </p>
              <a href={`/user/timeslots/${slot.id}`}>
                <button>View Timeslots</button>
              </a>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserTimeslots;
