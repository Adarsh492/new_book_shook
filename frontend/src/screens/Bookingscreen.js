import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";

const Bookingscreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(false);
  const [totalamount, setTotalAmount] = useState(0);

  const fromDateObj = moment(fromdate, "DD-MM-YYYY");
  const toDateObj = moment(todate, "DD-MM-YYYY");
  const totaldays = toDateObj.diff(fromDateObj, "days") + 1;

  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://bookshook-backend.onrender.com/api/rooms/getroombyid",
          { roomid }
        );

        const data = response.data;
        setRoom(data);
        setTotalAmount(totaldays * data.rentperday);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setLoading(false);
        setError(true);
      }
    };

    if (roomid) {
      fetchRoomById();
    }
  }, [roomid, totaldays]);

  async function onToken(token) {
    console.log("Payment Token:", token);
    
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };

    try {
      const result = await axios.post(
        "https://bookshook-backend.onrender.com/api/bookings/bookroom",
        bookingDetails
      );
      
      alert("Booking Successful!");
      window.location.href = "/profile"; // Redirect to profile after booking
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Booking Failed. Please try again.");
    }
  }

  if (!roomid) {
    return <Loader />;
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : room ? (
        <div className="m-5">
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" alt="Room" />
            </div>

            <div className="col-md-6">
              <h1 style={{ textAlign: "right" }}>Booking Details</h1>
              <hr />

              <div style={{ textAlign: "right" }}>
                <b>
                  <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
                  <p>From Date: {fromdate}</p>
                  <p>To Date: {todate}</p>
                  <p>Max Count: {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />
                <b>
                  <p>Total days: {totaldays}</p>
                  <p>Rent per day: {room.rentperday}</p>
                  <p>Total Amount: {totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  token={onToken}
                  amount={totalamount * 100}
                  currency="INR"
                  stripeKey="pk_test_51PWgok070BlTx4XYzK4Ee9lEsJwEtoBiRWTngxBKJdXI34BdZDAmcdwfHfSEMM2px2rZYbizbDszLb9xVHaptlWs00Ld6clrmc"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
};

export default Bookingscreen;
