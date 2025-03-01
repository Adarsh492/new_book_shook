const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: ["http://localhost:5000", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

const dbConfig = require('./database/dbConnection');
const roomsRoute = require('./routes/roomsRoute');
const usersRoute = require('./routes/userRoute');
const bookingsRoute = require('./routes/bookingsRoutes');

app.use(express.json());

app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);

// ✅ Add this default route to fix "Cannot GET /"
app.get("/", (req, res) => {
    res.send("API is running...");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node server started using nodemon on port ${port}!`));
