import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const Homescreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New search state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://bookshook-backend.onrender.com/api/rooms/getallrooms"
        );
        const data = response.data;

        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterByDate = (dates) => {
    const startDate = dates && dates[0] ? dates[0].format("DD-MM-YYYY") : null;
    const endDate = dates && dates[1] ? dates[1].format("DD-MM-YYYY") : null;

    if (!startDate || !endDate) {
      setRooms([...duplicateRooms]);
      return;
    }

    const filteredRooms = duplicateRooms.filter((room) => {
      if (!room.currentbookings || room.currentbookings.length === 0) {
        return true; // No bookings, so the room is available
      }

      const hasBookings = room.currentbookings.some((booking) => {
        const bookingStartDate = moment(booking.fromdate, "DD-MM-YYYY");
        const bookingEndDate = moment(booking.todate, "DD-MM-YYYY");

        return (
          moment(startDate, "DD-MM-YYYY").isBetween(bookingStartDate, bookingEndDate, undefined, "[]") ||
          moment(endDate, "DD-MM-YYYY").isBetween(bookingStartDate, bookingEndDate, undefined, "[]") ||
          moment(startDate, "DD-MM-YYYY").isSame(bookingStartDate, "day") ||
          moment(endDate, "DD-MM-YYYY").isSame(bookingEndDate, "day")
        );
      });

      return !hasBookings;
    });

    setRooms(filteredRooms);
    setFromDate(startDate);
    setToDate(endDate);
  };

  // Filter by search query
  const filterBySearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setRooms([...duplicateRooms]);
      return;
    }

    const filteredRooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(query.toLowerCase())
    );

    setRooms(filteredRooms);
  };

  return (
    <div className="container">
      {/* Search & Date Filter */}
      <div className="row mt-5 d-flex align-items-center">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} className="form-control" />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by room name..."
            value={searchQuery}
            onChange={(e) => filterBySearch(e.target.value)}
          />
        </div>
      </div>

      {/* Room Listings */}
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div className="col-md-9 mt-2" key={index}>
              <Room room={room} fromdate={fromDate} todate={toDate} />
            </div>
          ))
        ) : (
          <h3 className="text-center mt-5">No rooms available for the selected dates or search query.</h3>
        )}
      </div>
    </div>
  );
};

export default Homescreen;
