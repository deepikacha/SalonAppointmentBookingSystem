import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useParams,useLocation } from 'react-router-dom';
import AdminForm from './AdminForm';
import { Link } from 'react-router-dom';
import '../css/employee.css'

const EmployeeTimeslots=()=>{
  const [userTimeslots, setUserTimeslots] = useState([]);
    const [completedTimeslots, setCompletedTimeslots]=useState([]);
    const [cancelledTimeslots, setCancelledTimeslots]=useState([]);
    const[Timeslots, setTimeSlots]= useState([]);
    const [showForm, setShowForm] = useState(false);
    const[newSlot, setNewSlot]= useState({date:'', startTime:'',endTime:''});
     const [selectedSlot, setSelectedSlot] = useState(null);
     const [showReviewForm, setShowReviewForm] = useState(false);
     const [review, setReview] = useState('');
    
   

      useEffect(()=>{
        const fetchAllData=async()=>{
          const token=localStorage.getItem('employeeToken');
          try{
            const [userTimeslotsResponse,completedTimeslots,cancelledTimeslotsResponse, timeslotsResponse] = await Promise.all([
              axios.get('http://localhost:4000/employee/upcomingTimeslots', {
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
              }),
              axios.get('http://localhost:4000/employee/completedTimeslots',{
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
              }),
              axios.get('http://localhost:4000/employee/getCancelledSlots',{
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
              }),
              axios.get('http://localhost:4000/fetch-timeslots', {
                headers: { 'Content-Type': 'application/json', 'Authorization': token },
              }),
            ]);

            console.log(userTimeslots)
            setUserTimeslots(userTimeslotsResponse.data || []);
            setCompletedTimeslots(completedTimeslots.data || []);
            setCancelledTimeslots(cancelledTimeslotsResponse.data || []);
            setTimeSlots(timeslotsResponse.data);
          }
          catch(error){
            console.log('Error fetching data:', error);
          }

        };
        fetchAllData();
      },[])
    
       
        
       
   
    const addTimeSlot= async(e)=>{
        
      const token=localStorage.getItem('employeeToken');
        e.preventDefault();
        try{
            console.log('Adding Timeslot Payload:', { ...newSlot,  });
        const response=await axios.post(`http://localhost:4000/timeslots`,{...newSlot,},{
            headers: {
                'Content-Type': 'application/json',
                'Authorization':token,
              },
        })
        setTimeSlots([...Timeslots,response.data]);
        setNewSlot({date:'', startTime:'',endTime:''});
        setShowForm(false); 
      
    }
    catch(err){
        console.log(err);
    }
}

const deleteTimeSlot=async(timeslotId)=>{
  const token=localStorage.getItem('employeeToken');
    try{
    const response=await axios.delete(`http://localhost:4000/delete-timeslots/${timeslotId}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization':token,
          },

    })
    console.log(response.data.message);
   setTimeSlots(Timeslots.filter((slot)=> slot.id!==timeslotId));
    }
    catch(err){
        console.log(err);
    }
}

const handleCancelTimeslot=async(id)=>{
  const token=localStorage.getItem('employeeToken');
  if (!token) {
    alert('You are not logged in. Please log in to cancel a timeslot.');
    return;
  }

  
  try{
    const response=await axios.put(`http://localhost:4000/employee/cancelSlot/${id}`, {},{
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

 const handleReviewSubmit=async()=>{
  console.log('Selected Slot:', selectedSlot);
console.log('review:', review);
const token=localStorage.getItem('employeeToken');
  if (!selectedSlot || !review) {
    alert('Please provide feedback for the selected timeslot.');
    return;
  }
  try{
    const response=await axios.post('http://localhost:4000/employee/response',{
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      review,
    },{
      headers: { 'Content-Type': 'application/json', Authorization: token },
    })
    setCompletedTimeslots((prev)=>
      prev.map((slot)=>slot.id===selectedSlot.id?{...slot,review}:slot

      )
    )
     setReview('');
     setShowReviewForm(false);
     alert("feedback submitted successfully");
  }
  catch(err){
    console.log(err)
  }
}



return (
    <div>
      {/* Navigation Bar */}
     <nav>
        <h1>Employee Dashboard</h1>
        <button  className="add-slot-btn" onClick={()=>setShowForm(true)}>Add Slot</button>
       <Link to="/admin/profile" className="profile">Profile</Link>
     </nav>
      {/* Add Slot Form */}
      {showForm && (
        <div>
          <h2>Add New Slot</h2>
          <form onSubmit={addTimeSlot}>
          <input type="date" value={newSlot.date} onChange={(e)=>setNewSlot({...newSlot, date:e.target.value})} required/>
            <input type="time" value={newSlot.startTime} onChange={(e)=>setNewSlot({...newSlot, startTime: e.target.value })} required/>
            <input type="time" value={newSlot.endTime} onChange={(e)=>setNewSlot({...newSlot, endTime:e.target.value })} required/>
            <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
          </div>
      )}
     
            {/* Timeslots List */}
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
                setShowReviewForm(true);
                console.log('Response form opened for:', slot.id);
              }}>Response</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Completed timeslots available for you.</p>
      )}

{showReviewForm && (
        <div>
          <h3>Submit review for completed timeslot</h3>
          <textarea value={review} onChange={(e)=>setReview(e.target.value)} 
          placeholder='write your response here' cols="10" rows="5" style={{resize:"vertical", overflow:"auto", width:"50%",maxHeight:"150px"}}></textarea>
          <button onClick={handleReviewSubmit}>Submit</button>
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
         
            <div>
        <h2>Available Time Slots</h2>
        <ul>
        {Timeslots.map((slot) => (
            <li key={slot.id}>
              {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
              <button onClick={() => deleteTimeSlot(slot.id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>
    </div>
)
}

export default EmployeeTimeslots;
