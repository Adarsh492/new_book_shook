import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";

const Bookingscreen = () => {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setloading] = useState();
  const [room, setroom] = useState(null);
  const [error, setError] = useState();
  const [totalamount, setTotalAmount] = useState(0);

  const fromDateObj = moment(fromdate, "DD-MM-YYYY");
  const toDateObj = moment(todate, "DD-MM-YYYY");
  const totaldays = toDateObj.diff(fromDateObj, "days") + 1;
  // setTotalAmount(totaldays * room.rentperday);

  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        setloading(true);
        const response = await axios.post("/api/rooms/getroombyid", { roomid }); // Corrected endpoint and payload
        const data = response.data;
        setroom(data);
        setloading(false);

        setTotalAmount(totaldays * data.rentperday); // Calculate total amount here
        setloading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setloading(false);
        setError(true);
      }
    };

    if (roomid) {
      fetchRoomById();
    }
  }, [roomid]);


 async function onToken(token) {
    console.log(token);
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
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
    } catch(error){
      console.log(error);
    }
  }

  // roomid will be undefined during initial render, handle appropriately
  if (!roomid) {
    return (
      <div>
        <Loader />
      </div>
    );
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
              <img src={room.imageurls[0]} className="bigimg" alt="" />
            </div>

            <div className="col-md-6">
              <h1 style={{ textAlign: "right" }}>Booking Details</h1>
              <hr />

              <div style={{ textAlign: "right" }}>
                <b>
                  <p>
                    Name: {JSON.parse(localStorage.getItem("currentUser")).name}{" "}
                  </p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />
                <b>
                  <p>Total days : {totaldays}</p>
                  <p>Rent per day :{room.rentperday}</p>
                  <p>Total Amount :{totalamount}</p>
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
