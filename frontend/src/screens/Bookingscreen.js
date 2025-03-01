import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";

const Bookingscreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(false); // ✅ Proper initialization
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
        const response = await axios.post("/api/rooms/getroombyid", { roomid });
        const data = response.data;
        setRoom(data);
        setTotalAmount(totaldays * data.rentperday);
      } catch (error) {
        console.error("Error fetching room:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (roomid) {
      fetchRoomById();
    }
  }, [roomid, totaldays]); // ✅ Added `totaldays` dependency

  async function onToken(token) {
    console.log(token);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      alert("Please log in to book a room.");
      return;
    }

    const bookingDetails = {
      room,
      userid: currentUser._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      console.log("Booking Success:", result.data);
      alert("Booking successful!");
    } catch (error) {
      console.log("Booking Error:", error);
      alert("Booking failed! Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!roomid) {
    return <Loader />;
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : room ? (
        <div className="m-5">
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              {/* ✅ Handle missing `imageurls` to prevent crash */}
              <img
                src={room.imageurls?.[0] || "default-image.jpg"}
                className="bigimg"
                alt={room.name}
              />
            </div>

            <div className="col-md-6">
              <h1 style={{ textAlign: "right" }}>Booking Details</h1>
              <hr />
              <div style={{ textAlign: "right" }}>
                <b>
                  <p>Name: {JSON.parse(localStorage.getItem("currentUser"))?.name || "Guest"}</p>
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
