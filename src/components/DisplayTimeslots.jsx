import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const EmployeeTimeslots = () => {
  const [employeeTimeslots, setEmployeeTimeslots] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { timeslotId } = useParams(); // Get employeeId from the URL

  useEffect(() => {
    const fetchEmployeeTimeslots = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:4000/user/timeslots/${timeslotId}`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
        });
        console.log(response.data)
        setEmployeeTimeslots(response.data[0].EmployeeTimeslots || []);
        setServices(JSON.parse(response.data[0].services) || []);


      } catch (error) {
        console.error('Error fetching employee timeslots:', error);
      }
    };
    fetchEmployeeTimeslots();
  }, [timeslotId]);

  console.log(employeeTimeslots)

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !selectedService) {
      return alert('Please fill all fields.');
    }

    const userEmail = localStorage.getItem('email');
    if (!userEmail) return alert('User email is required.');

    const requestData = {
      userId: selectedSlot.userId,
      employeeId: selectedSlot.employeeId,
      service: selectedService,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      amount: 500, // Amount in INR
      userEmail,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/book-slot', requestData, {
        headers: { Authorization: token },
      });

      const { order } = response.data;
      const { id: order_id, amount, currency } = order;

      const options = {
        key: response.data.key_id,
        amount,
        currency,
        name: 'Salon Booking',
        description: `Payment for ${selectedService}`,
        order_id,
        handler: async (paymentResponse) => {
          await updatePaymentStatus(order_id, 'SUCCESS', paymentResponse.razorpay_payment_id);
          alert('Booking successful!');
        },
        prefill: { email: userEmail },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on('payment.failed', async () => {
        await updatePaymentStatus(order_id, 'FAILED');
        alert('Payment failed. Please try again.');
      });

      rzp1.open();
    } catch (error) {
      console.error('Error initiating booking:', error);
      alert('Something went wrong. Please try again.');
    }
  };


  const updatePaymentStatus = async (orderId, status, paymentId = '') => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:4000/verify-payment`,
        {
          orderid: orderId,
          paymentid: paymentId,
          status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error("Error updating transaction status:", error);
      alert("Failed to update transaction status. Please contact support.");
    }
  };






  return (
    <div>
      <h2>Available Timeslots for Employee </h2>
      {employeeTimeslots.length > 0 ? (
        <form onSubmit={handleFormSubmit}>
          <div style={{display: "flex",flexDirection:'column',gap:'50px'}}>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {employeeTimeslots.map((slot, index) => (
              <div key={index}>
                <label
      style={{
        backgroundColor: slot.reserved ? "grey" : "tomato",
        color: "white",
        padding: "10px 20px",
        cursor: slot.reserved ? "not-allowed" : "pointer",
        borderRadius: "5px"
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = slot.reserved ? "grey" : "darkred")}
      onMouseOut={(e) => (e.target.style.backgroundColor = selectedSlot === slot ? "darkred" : slot.reserved ? "grey" : "tomato")}
    >
                  <input style={{ display: "none" }}
                    type="radio"
                    name="timeslot"

                    value={`${slot.date}-${slot.startTime}-${slot.endTime}`}
                    onChange={() => !slot.reserved && setSelectedSlot(slot)}
        disabled={slot.reserved}
                  />
                  Date: {new Date(slot.date).toLocaleDateString()} | Time: {slot.startTime}-{slot.endTime}
                </label>

              </div>
            ))} </div>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {services.map((service, index) => (
              <div key={index}>
                <label style={{ backgroundColor: "orange", color: "white", padding: "10px 20px", cursor: "pointer", borderRadius: "5px", marginTop: "100px" }}
                 onMouseOver={(e) => (e.target.style.backgroundColor = "darkorange")}
                 onMouseOut={(e) => (e.target.style.backgroundColor = selectedService === service ? "darkorange" : "orange")}>
                  <input style={{ display: "none" }}
                    type="radio"
                    name="timeslot"

                    value={selectedService}
                    onChange={() => setSelectedService(service)}
                  />
                  {service}
                </label>

              </div>
            ))} </div>
            </div>
          <button style={{ backgroundColor: "green", padding: "10px 20px", marginTop: "20px", borderRadius: "5px", color: "white",border:"none", cursor:"pointer", fontSize:"16px", fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease", }} type="submit"  onMouseOver={(e) => (e.target.style.backgroundColor = "darkgreen")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "green")}>Submit</button>
        </form>

      ) : (
        <p>No available timeslots for this employee.</p>
      )}
    </div>
  );
}

export default EmployeeTimeslots;
