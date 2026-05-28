require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const cors = require("cors");

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");


const app = express();
app.use(express.json());

const corsOptions = {

	origin: ['http://localhost:8000'],
	credentials: true,
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// setups session middleware
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);



if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};