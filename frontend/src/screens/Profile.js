import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser")); // Get user details

    useEffect(() => {
        if (!user) {
            navigate("/login"); // Redirect to login if not logged in
            return;
        }

        let isMounted = true; // To prevent state update on unmounted component

        axios.post("https://bookshook-backend.onrender.com/api/bookings/getuserbookings", { userid: user._id })
            .then((res) => {
                if (isMounted) {
                    setBookings(res.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error fetching bookings:", err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false; // Cleanup function
        };
    }, [user, navigate]);

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p className="error-message">Error fetching bookings. Please try again later.</p>;

    return (
        <div className="container">
            <h2 className="title">My Bookings</h2>
            <div className="user-details">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            {bookings.length > 0 ? (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <h4>{booking.room}</h4>
                            <p><strong>Check-in:</strong> {booking.fromdate}</p>
                            <p><strong>Check-out:</strong> {booking.todate}</p>
                            <p><strong>Total Amount:</strong> ₹{booking.totalamount}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-bookings">No bookings found.</p>
            )}
        </div>
    );
};

export default MyBookings;
