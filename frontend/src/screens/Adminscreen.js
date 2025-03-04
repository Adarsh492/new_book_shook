import React, { useState, useEffect } from 'react';
import { Tabs, Table } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

const BASE_URL = 'https://bookshook-backend.onrender.com';

function Adminscreen() {
  const [roomData, setRoomData] = useState({
    name: '',
    rentperday: '',  
    maxcount: '',  
    description: '',
    phonenumber: '',  
    type: '',
    imageurls: ['', '', ''] // Array to store 3 image URLs
  });

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchUsers();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bookings/getallbookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/getallusers`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/rooms/getallrooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms', error);
    }
  };

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...roomData.imageurls];
    updatedImages[index] = value;
    setRoomData({ ...roomData, imageurls: updatedImages });
  };

  const addRoom = async () => {
    try {
      const roomPayload = {
        ...roomData,
        rentperday: Number(roomData.rentperday),  // Convert to number
        maxcount: Number(roomData.maxcount),  // Convert to number
        phonenumber: Number(roomData.phonenumber),  // Convert to number
      };

      const response = await axios.post(`${BASE_URL}/api/rooms/addroom`, roomPayload);
      alert(response.data.message);

      setRoomData({ // Reset input fields after adding room
        name: '',
        rentperday: '',
        maxcount: '',
        description: '',
        phonenumber: '',
        type: '',
        imageurls: ['', '', '']
      });

      fetchRooms(); // Refresh room list
    } catch (error) {
      alert('Failed to add room');
      console.error('Error adding room:', error.response?.data || error.message);
    }
  };

  const bookingColumns = [
    { title: 'Booking Id', dataIndex: '_id', key: '_id' },
    { title: 'User Id', dataIndex: 'userid', key: 'userid' },
    { title: 'Room', dataIndex: 'room', key: 'room' },
    { title: 'From', dataIndex: 'fromdate', key: 'fromdate' },
    { title: 'To', dataIndex: 'todate', key: 'todate' },
    { title: 'Total Amount', dataIndex: 'totalamount', key: 'totalamount' },
    { title: 'Total Days', dataIndex: 'totaldays', key: 'totaldays' },
    { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId' },
    { title: 'Status', dataIndex: 'status', key: 'status' }
  ];

  const userColumns = [
    { title: 'User Id', dataIndex: '_id', key: '_id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Is Admin', dataIndex: 'isAdmin', key: 'isAdmin', render: (text) => (text ? 'YES' : 'NO') }
  ];

  const roomColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
  ];

  return (
    <div className='mt-3 ml-3 mr-3 bs'>
      <h1 className='text-center' style={{ fontSize: '30px' }}>
        <b>Admin Panel</b>
      </h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Table dataSource={bookings} columns={bookingColumns} rowKey="_id" />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Table dataSource={rooms} columns={roomColumns} rowKey="_id" />
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '50%' }}>
              <input type='text' name='name' placeholder='Room Name' value={roomData.name} onChange={handleChange} />
              <input type='text' name='type' placeholder='Type' value={roomData.type} onChange={handleChange} />
              <input type='number' name='rentperday' placeholder='Rent Per Day' value={roomData.rentperday} onChange={handleChange} />
              <input type='number' name='maxcount' placeholder='Max Count' value={roomData.maxcount} onChange={handleChange} />
              <input type='text' name='description' placeholder='Description' value={roomData.description} onChange={handleChange} />
              <input type='number' name='phonenumber' placeholder='Phone Number' value={roomData.phonenumber} onChange={handleChange} />
              <input type='text' placeholder='Image URL 1' value={roomData.imageurls[0]} onChange={(e) => handleImageChange(0, e.target.value)} />
              <input type='text' placeholder='Image URL 2' value={roomData.imageurls[1]} onChange={(e) => handleImageChange(1, e.target.value)} />
              <input type='text' placeholder='Image URL 3' value={roomData.imageurls[2]} onChange={(e) => handleImageChange(2, e.target.value)} />
            </div>
            <button onClick={addRoom} style={{ marginTop: '10px', backgroundColor: 'black', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>Add Room</button>
          </div>
        </TabPane>
        <TabPane tab="Users" key="4">
          <Table dataSource={users} columns={userColumns} rowKey="_id" />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;
