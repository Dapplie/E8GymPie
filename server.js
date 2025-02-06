// server.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
// const audit = require('express-requests-logger')
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = 5000;
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');
const moment = require('moment-timezone');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// WORKING VERSION LAST EDIT const uri = 'mongodb+srv://JohnnySadaka:.vvZLFoJfu=d@cluster0.yfux0.mongodb.net/';
const uri = 'mongodb://127.0.0.1:27017/E8GYMFINAL';
//const uri = 'mongodb+srv://boughosnjuliano:q7wkLINHFnEUBleP@cluster0.759muhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))
app.use(cors());
const client = new MongoClient(uri);


//We shouldn't use this anymore
// async function connectToDatabase() {
//   const client = new MongoClient(uri);

//   try {

//     await client.connect();
//     console.log('Connected to MongoDB');
//     return client.db('E8GYMFINAL');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     return null;
//   }
// }


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)
  }
})

const upload = multer({ storage: storage })

// API route for image upload and MongoDB insertion
app.post("/upload-image", upload.single("image"), async (req, res) => {
  const UserId = req.body.UserId; // Accessing UserId from the request body

  if (req.file) {
    console.log("File uploaded successfully:", req.file);

    const imageName = req.file.filename;

    let client; // Declare client variable for MongoDB connection
    try {
      // Create a new MongoClient connection using the URI
      client = new MongoClient(uri);
      await client.connect(); // Connect to MongoDB

      const db = client.db(); // Access the database
      const imageDetailsCollection = db.collection("ImageDetails");

      // Check if an entry for the UserId already exists
      const existingImageDoc = await imageDetailsCollection.findOne({ UserId: UserId });

      if (existingImageDoc) {
        // If the entry exists, update the image field
        await imageDetailsCollection.updateOne(
          { UserId: UserId },
          { $set: { image: imageName } }
        );
        console.log("Image updated in database successfully for UserId:", UserId);
        return res.status(200).json({ status: "ok", message: "Image updated successfully" });
      } else {
        // If the entry does not exist, create a new one
        await imageDetailsCollection.insertOne({ image: imageName, UserId: UserId });
        console.log("Image and UserId added to database successfully:", imageName, UserId);
        return res.status(200).json({ status: "ok", message: "Image uploaded" });
      }
    } catch (error) {
      console.error("Error handling image in database:", error);
      return res.status(500).json({ status: "error", message: String(error.message || error) });
    } finally {
      // Ensure the client is closed in both success and error scenarios
      if (client) {
        try {
          await client.close();
          console.log("upload image: Connection closed");
        } catch (closeError) {
          console.error("Error closing MongoDB connection:", closeError);
        }
      }
    }
  } else {
    console.error("File not received:", req.file);
    return res.status(400).json({ status: "error", message: "Upload failed" });
  }
});


// Route to retrieve an image based on UserId
app.post("/get-image", async (req, res) => {
  const UserId = req.body.UserId; // Accessing UserId from the request body

  if (!UserId) {
    return res.status(400).json({ status: "error", message: "UserId is required" });
  }

  let client; // Declare client variable for MongoDB connection
  try {
    // Create a new MongoClient connection using the URI
    client = new MongoClient(uri);
    await client.connect(); // Connect to MongoDB

    const db = client.db(); // Access the database
    const imageDetailsCollection = db.collection("ImageDetails");

    // Find the image document by UserId
    const imageDoc = await imageDetailsCollection.findOne({ UserId: UserId });

    if (!imageDoc) {
      return res.status(404).json({ status: "error", message: "Image not found" });
    }

    // Return the image URL based on the filename stored in MongoDB
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageDoc.image}`;
    return res.status(200).json({ status: "ok", imageUrl: imageUrl });
  } catch (error) {
    console.error("Error retrieving image from database:", error);
    return res.status(500).json({ status: "error", message: String(error.message || error) });
  } finally {
    // Ensure the client is closed in both success and error scenarios
    if (client) {
      try {
        await client.close();
        console.log("get-image: Connection closed");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
});



async function cleanExpiredClasses() {
  const now = new Date();

  let client; // Declare client variable for use in finally block

  try {
    // Create a new connection to the database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(); // Get default database

    const classScheduleCollection = db.collection("ClassShcedule");
    const classBookingCollection = db.collection("ClassBooking");

    // Find all expired classes (adjust comparison to handle ISO string dates)
    const expiredClasses = await classScheduleCollection
      .find({ endDate: { $lte: now.toISOString() } })
      .toArray();

    if (!expiredClasses.length) {
      console.log("No expired classes to clean.");
      return;
    }

    // Extract IDs of expired classes
    const expiredClassIds = expiredClasses.map(cls => cls._id);

    // Delete expired classes
    const deletedClassesResult = await classScheduleCollection.deleteMany({
      _id: { $in: expiredClassIds },
    });

    const deletedBookingsResult = await classBookingCollection.deleteMany({
      clsId: { $in: expiredClassIds.map(id => id.toString()) }, // Convert ObjectId to string
    });

    console.log(`Deleted ${deletedClassesResult.deletedCount} expired classes.`);
    console.log(`Deleted ${deletedBookingsResult.deletedCount} related bookings.`);
  } catch (error) {
    console.error("Error cleaning expired classes:", error);
  } finally {
    if (client) {
      await client.close();
      console.log("clean expired classes closed");
    }
  }
}

// Schedule the function to run every day at 6 AM
cron.schedule("0 6 * * *", async () => {
  console.log("Running scheduled cleanExpiredClasses at 6 AM...");
  await cleanExpiredClasses();
});








async function updateWeeklyAttendance() {
  let client; // Declare the client here for later closing

  try {
    console.log('Starting weekly attendance update...');

    // Create a new MongoClient connection using the URI
    client = new MongoClient(uri);
    await client.connect(); // Connect to MongoDB

    // Access the database
    const db = client.db(); // Get the database instance
    const classBookingCollection = db.collection('ClassBooking');
    const classShceduleCollection = db.collection('ClassShcedule'); // Correcting typo from 'ClassShcedule' to 'ClassSchedule'
    const usersCollection = db.collection('Users');

    // Get the current date
    const currentDate = new Date();

    // Find all active classes
    const activeClasses = await classShceduleCollection.find({
      endDate: { $gte: currentDate.toISOString() }, // Compare using ISO string format
    }).toArray();
    console.log(`Active classes found: ${activeClasses.length}`);

    // Loop over each active class
    for (const cls of activeClasses) {
      console.log(`Processing class with ID: ${cls._id}`);

      // Find bookings for the current class
      const bookings = await classBookingCollection.find({
        clsId: cls._id.toString(),
      }).toArray();
      console.log(`Bookings found for class ID ${cls._id}: ${bookings.length}`);

      // Count bookings per user
      const userAttendanceMap = {};
      bookings.forEach((booking) => {
        userAttendanceMap[booking.userId] = (userAttendanceMap[booking.userId] || 0) + 1;
      });
      console.log(`User attendance map for class ID ${cls._id}:`, userAttendanceMap);

      // Update each user’s `attended` count
      for (const [userId, attendanceCount] of Object.entries(userAttendanceMap)) {
        console.log(`Updating attendance for user ID: ${userId} with count: ${attendanceCount}`);

        // First, check if the user exists
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (user) {
          // User exists, increment their attended count
          const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $inc: { attended: attendanceCount } }
          );
          console.log(`Update result for user ID ${userId}:`, result);
        } else {
          // User does not exist, create a new document with attended set to attendanceCount
          const result = await usersCollection.insertOne({
            _id: new ObjectId(userId),
            attended: attendanceCount,
          });
          //console.log(`Inserted new user ID ${userId} with attended count: ${attendanceCount}`, result);
        }
      }
    }
    console.log('Weekly attendance update completed successfully.');
  } catch (error) {
    console.error('Error updating weekly attendance:', error);
  } finally {
    // Ensure connection is closed after the operation is complete
    if (client) {
      try {
        await client.close();
        console.log('updateWeeklyAttendance: Database connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
}


// Schedule the function to run every Sunday at midnight
cron.schedule('0 0 * * 0', async () => {
  console.log('Running weekly attendance update...');
  await updateWeeklyAttendance();
});

app.post('/testWeeklyAttendance', async (req, res) => {
  console.log('Running weekly attendance update for testing...');
  try {
    await updateWeeklyAttendance();
    res.status(200).json({ message: 'Weekly attendance update test ran successfully' });
  } catch (error) {
    console.error('Error running weekly attendance update:', error);
    res.status(500).json({ error: 'Error running weekly attendance update test' });
  }
});



// Function to fetch user by ID from MongoDB
async function getId(insertedId) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('E8GYMFINAL');
    const collection = database.collection('Users');
    console.log(`fetching ${insertedId}`)
    const user = await collection.findOne({ '_id': new ObjectId(insertedId) })
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  } finally {
    await client.close();
    console.log("get id closed");
  }
}

// Function to fetch data from MongoDB
async function fetchData(collectionName, filter = {}) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('E8GYMFINAL');
    const collection = database.collection(collectionName);

    const data = await collection.find({}).toArray();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  } finally {
    await client.close();
    console.log("cpllection name function closed");
  }
}

// Route for creating a new class
app.post('/createClass', async (req, res) => {
  const { className, instructor, time, description, capacity, branch } = req.body;

  console.log("createClass normal called");
  console.log("Request body:", req.body);

  let client; // Declare client here to close later

  try {
    // Create a new MongoClient connection using the URI
    client = new MongoClient(uri);
    await client.connect(); // Connect to MongoDB

    // Access the database
    const db = client.db(); // Get the database instance
    const collectionName = "ClassShcedule"; // this is not a typo
    const collection = db.collection(collectionName);

    // Insert a new class document
    await collection.insertOne({
      className: className,
      name: className,
      instructor: instructor,
      time: time,
      description: description,
      branch: branch,
      id: Date.now().toString(),
      availability: "Available",
      participants: 0,
      capacity: capacity,
    });

    console.log("Class created successfully");
    res.status(200).json({ message: 'Class created successfully' });

  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Error creating class' });
  } finally {
    // Ensure the client is closed
    if (client) {
      try {
        await client.close();
        console.log("MongoDB connection closed for createClass");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
});




app.post('/createClassesNew', async (req, res) => {
  const { className, instructor, startDate, endDate, the_date, days, name, description, capacity, branch } = req.body;

  console.log(req.body);
  console.log("create classes new 1 called");

  let client; // Declare client here to close later

  try {
    // Create a new MongoClient connection using the URI
    client = new MongoClient(uri);
    await client.connect(); // Connect to MongoDB

    // Access the database
    const db = client.db(); // Get the database instance
    const classCollection = db.collection("ClassShcedule"); // this is not a typo
    const adminBranchCollection = db.collection("adminbranches");

    // Fetch all branch IDs from adminbranches
    const branches = await adminBranchCollection.find({}).toArray();

    // Create a new class record for each branch ID
    const classID = Date.now().toString();
    const promises = branches.map(branch => {
      return classCollection.insertOne({
        className: className,
        name: className,
        instructor: instructor,
        startDate: startDate,
        endDate: endDate,
        the_date: the_date,
        days: days,
        name: name,
        description: description,
        branch: branch.branchID,
        id: classID,
        availability: "Available",
        participants: 0,
        capacity: capacity,
      });
    });

    // Wait for all insertions to complete
    await Promise.all(promises);

    // Send response first
    res.status(200).json({ message: 'Classes created successfully for all branches' });

  } catch (error) {
    console.error('Error creating classes:', error);
    res.status(500).json({ error: 'Error creating classes' });
    
  } finally {
    // Ensure the client is closed in case of success or failure
    if (client) {
      try {
        await client.close();
        console.log("create classes new database connection closed");
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
});







app.post('/createClassNew', async (req, res) => {
  const { className, instructor, startDate, endDate, the_date, days, name, description, capacity, branch } = req.body;
  console.log("create class new 2 !!! called");

  let client; // Declare client here to close later

  try {
    // Create a new MongoClient connection using the URI
    client = new MongoClient(uri);
    await client.connect(); // Connect to MongoDB

    // Access the database
    const db = client.db(); // Get the database instance
    const collectionName = "ClassShcedule"; //this is not a typo
    const collection = db.collection(collectionName);

    console.log("Logging Body");
    console.log(req.body);

    // Insert a new class document
    await collection.insertOne({
      className: className,
      name: name,
      instructor: instructor,
      startDate: startDate,
      endDate: endDate,
      the_date: the_date,
      days: days,
      description: description,
      branch: branch,
      id: Date.now().toString(),
      availability: "Available",
      participants: 0,
      capacity: capacity,
    });

    console.log("Class created successfully");
    res.status(200).json({ message: 'Class created successfully' });

  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Error creating class' });

  } finally {
    // Ensure the client is closed
    try {
      if (client) {
        await client.close();
        console.log("createClassNew: Database connection closed");
      }
    } catch (closeError) {
      console.error("Error closing MongoDB connection:", closeError);
    }
  }
});



app.get('/fetchAllBranchesGroupedClasses', async (req, res) => {
  let client;

  try {
    // Establish a new unique connection for this request
    client = await MongoClient.connect(uri);
    const db = client.db();  // Get the database instance

    if (!db) {
      console.error('Failed to connect to the database.');
      return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
    }

    const agg = [
      {
        '$lookup': {
          'from': 'adminbranches',
          'localField': 'branch',
          'foreignField': 'branchID',
          'as': 'branchDetails'
        }
      },
      {
        '$unwind': {
          'path': '$branchDetails'
        }
      },
      {
        '$group': {
          '_id': '$branch',
          'classes': {
            '$push': '$$ROOT'
          },
          'branchDetails': {
            '$first': '$branchDetails'
          }
        }
      }
    ];

    const collection = db.collection('ClassShcedule');
    const cursor = collection.aggregate(agg);
    const classes = await cursor.toArray();

    return res.status(200).json(classes);

  } catch (error) {
    console.error('Error fetching grouped classes:', error);
    return res.status(500).json({ error: 'Internal Server Error Fetching Grouped Classes' });
  } finally {
    // Ensure that the connection is closed after the operation
    try {
      if (client) {
        await client.close();
        console.log('fetchAllBranchesGroupedClasses: Database connection closed');
      }
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
});


//unused route comment
// Route for ClassScheduleScreen
app.get('/ClassScheduleScreen', async (req, res) => {
  const data = await fetchData('ClassShcedule');
  if (data) {
    console.log(data)
    res.json(data);
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// 1st route for purchase screen booking
app.get('/PurchaseInfoScreenBooking', async (req, res) => {
  const userID = req.query.userid;
  console.log("User ID : ", userID);

  let client; // Declare client variable for connection

  try {
    // Create a new connection to the database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(); // Use the default database

    const checkOutCollectionbook = db.collection("ClassBooking"); // ?? right?
    
    // Get all Checkouts from the database where UserID matches the parameter userId
    checkOutCollectionbook.find({ "userId": userID }).toArray()
      .then((bookings) => {
        console.log("Bookings We Got ");
        console.log(bookings);
        res.json(bookings);
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: Error Fetching Data ' });
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.close(); // Ensure connection is closed
      console.log("PurchaseInfoScreenBooking connection closed");
    }
  }
});



// Route for PurchaseInfoScreen
app.get('/PurchaseInfoScreen', async (req, res) => {
  const userID = req.query.userid;
  console.log("User ID : ", userID);

  let client; // Declare client for the connection

  try {
    // Create a new connection to the database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(); // Use the default database

  const checkOutCollection = db.collection("Checkout");

    // Get all Checkouts from the database where UserID matches the parameter userId
    checkOutCollection.find({ "userId": userID }).toArray()
      .then((checkOuts) => {
        console.log(checkOuts);
        res.json(checkOuts);
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: Error Fetching Data ' });
      });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.close(); // Ensure the connection is closed
      console.log("PurchaseInfoScreen connection closed");
    }
  }
});



// Get All Branches From Database and send it as a response
app.get("/BranchList", async (req, res) => {
  let client; // Declare a variable to hold the MongoClient instance

  try {
    // Create a new connection to the database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db();

    const branchColletion = db.collection("ClassShcedule");
    const agg = [
      {
        '$group': {
          '_id': 'Branches',
          'branch': {
            '$addToSet': '$branch'
          }
        }
      },
      {
        '$unwind': {
          'path': '$branch'
        }
      }
    ];

    const branches = await branchColletion.aggregate(agg).toArray();
    console.log(branches);

    // Send the branches as a response
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branch list:', error);
    res.status(500).json({ error: 'Error fetching branch list' });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
      console.log('BranchList MongoDB connection closed.');
    }
  }
});



app.get('/getBranchesAndClasses', async (req, res) => {
  let client; // Declare a variable to hold the MongoClient instance

  try {
    // Create a new connection to the database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db();

    const branchColletion = db.collection("ClassShcedule");
    const branches = await branchColletion.find({}).sort({ 'branch': 1 }).toArray();
    res.json(branches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
      console.log('/getBranchesAndClasses MongoDB connection closed.');
    }
  }
});
// meeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
const { Int32 } = require('mongodb');
app.post('/cancelBooking', async (req, res) => {
  const { _id } = req.body;

  let client; // Declare a variable to hold the MongoClient instance

  try {
    // Create a new connection to the database
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db();

    if (!db) {
      return res
        .status(500)
        .json({
          error: "Internal Server Error: Unable to connect to the database",
        });
    }
    console.log(`Canceling for ID ${_id}`)
    // Get the collections using the established connection
    const collectionClassBooking = db.collection('ClassBooking');
    const collectionClassSchedule = db.collection('ClassShcedule');

    // Find the booking record by _id
    const booking = await collectionClassBooking.findOne({ _id: new ObjectId(_id) });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const clsId = booking.clsId;

    // Decrement participants number in ClassSchedule using clsId
    const updateResult = await collectionClassSchedule.updateOne(
      { _id: new ObjectId(clsId) },
      { $inc: { participants: -1 } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ error: 'ClassSchedule not found or participants not updated' });
    }

    // Delete the booking record only if participants are decremented
    const Deletion = await collectionClassBooking.deleteOne({ _id: new ObjectId(_id) });
    console.log(`deleted ${JSON.stringify(Deletion, null, 2)}`)

    res.json({ message: 'Booking cancelled and participants count updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error cancelling booking');
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
      console.log('cancelBooking MongoDB connection closed.');
    }
  }
});

app.post('/getBooking', async (req, res) => {
  const { userId, branch } = req.body;


  // Create a new connection for this route
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB for this specific request
    await client.connect();
    const db = client.db();

    // Get the collection using the established connection
    const collectionClassBooking = db.collection('ClassBooking');

    // Fetch the bookings for the provided userId and branch
    const bookings = await collectionClassBooking.find({ userId, branch }).toArray();

    // Send the bookings as response
    res.json(bookings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Error fetching bookings');
  } finally {
    try {
      // Ensure connection is closed after the DB operation
      await client.close();
      console.log('getBooking connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
});


// Route for handling booking confirmation
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: 'dollarrami75@gmail.com', // Your email address
    pass: 'tdco ogya momt kdee', // Your email password or app-specific password
  },
});



app.post('/ClassBooking', async (req, res) => {
  const { username, email, className, time, userid, clsId, branch } = req.body;

  // Create a new connection for this route
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB for this specific request
    await client.connect();
    const db = client.db();

    // Log the received booking information
    console.log("Received Booking Information:", {
      username,
      email,
      className,
      time,
      userid,
      clsId,
      branch,
    });

    // Do not modify the time, store it exactly as it is received
    const receivedTime = time; // Directly store the time as it is received

    console.log("Received Class Time (No conversion):", receivedTime);

    // Fetch branch admin emails
    const collectionAdmins = db.collection('admins');
    const admins = await collectionAdmins.find({ branch: branch }).toArray();
    if (!admins || admins.length === 0) {
      return res.status(500).json({ error: "Internal Server Error: Branch not found in admins" });
    }
    const adminEmails = admins.map(admin => admin.email);

    // Fetch superadmin email
    const collectionSuperadmin = db.collection('superadmin');
    const superadmin = await collectionSuperadmin.findOne({});
    if (!superadmin || !superadmin.email) {
      return res.status(500).json({ error: "Internal Server Error: Superadmin email not found" });
    }
    const superadminEmail = superadmin.email;

    // Fetch user details
    const collectionUsers = db.collection('Users');
    const user = await collectionUsers.findOne({ '_id': new ObjectId(userid) });
    if (!user) {
      return res.status(500).json({ error: "Internal Server Error: User not found" });
    }
    const customerEmail = user.email;
    const customerPhoneNumber = user.phoneNumber;

    // Handle booking logic
    const collectionClassBooking = db.collection('ClassBooking');
    const existingBooking = await collectionClassBooking.findOne({
      'userId': userid,
      'clsId': clsId,
      'classTime': receivedTime,  // Use the received time directly
    });
    if (!existingBooking) {
      const collectionClassSchedule = db.collection('ClassShcedule');
      const classSchedule = await collectionClassSchedule.findOne({
        '_id': new ObjectId(clsId),
        'availability': 'Available',
      });
      if (classSchedule && classSchedule.participants < classSchedule.capacity) {
        const bookingResult = await collectionClassBooking.insertOne({
          username,
          email,
          className,
          classTime: receivedTime,  // Store the received time directly
          userId: userid,
          clsId: clsId,
          branch,
        });

        if (bookingResult && bookingResult.insertedId) {
          await collectionClassSchedule.updateOne(
            { _id: new ObjectId(clsId) },
            { $inc: { participants: 1 } }
          );

          // Format the picked time for email
          const formattedTime = moment(receivedTime, 'hh:mmA').format('hh:mm A');
          console.log(`Formatted Time for email: ${formattedTime}`);

          // Email options
          const mailOptions = {
            from: 'youremail@gmail.com',
            to: [...adminEmails, customerEmail, superadminEmail].join(','),
            subject: 'New Class Booking',
            html: `
              <div style="background-color: #ffffff; color: #333333; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/uGYioKW.jpeg" alt="E8 Gym Logo" style="max-width: 200px; margin-bottom: 20px;" />
                <p style="font-size: 16px; line-height: 1.5; color: #333333;">
                  Hello <strong>${username}</strong>,
                </p>
                <p style="font-size: 16px; line-height: 1.5; color: #333333;">
                  Thank you for booking with us.<br />
                  Please find your order and booking details below.
                </p>
                <h2 style="font-size: 20px; color: #000000; margin: 20px 0;">Booking Summary</h2>
                <p style="font-size: 16px; line-height: 1.5; text-align: left; margin: 0 auto; max-width: 400px;">
                  <strong>What:</strong> ${className}<br />
                  <strong>When:</strong> ${formattedTime}<br />
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin-top: 20px; color: #333333;">
                  If you need any assistance with your booking, please email us at 
                  <a href="mailto:Support@e8gym.com" style="color: #007bff; text-decoration: none;">Support@e8gym.com</a>.
                </p>
              </div>
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending email: ", error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          return res.status(200).json({ "message": "Booked Class Successfully" });
        }
      }
    }
    return res.status(500).json({ "message": "Already Booked or Class Full" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ "message": "Internal Server Error" });
  } finally {
    try {
      // Ensure connection is closed after the DB operation
      await client.close();
      console.log('ClassBooking connection closed');
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
});

// this one we are using
app.post('/ClassBooking', async (req, res) => {
  const { username, email, className, time, userid, clsId, branch } = req.body;

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Database connected");
    const db = client.db();

  // Connect to db
  if (!db) {
    return res.status(500).json({
      error: "Internal Server Error: Unable to connect to the database",
    });
  }

  // Log the received booking information
  console.log("Received Booking Information:", {
    username,
    email,
    className,
    time,
    userid,
    clsId,
    branch,
  });

  try {
    // Save the received time as is, without any conversion
    const receivedTime = time;

    console.log("Received Class Time (no conversion):", receivedTime);

    // Fetch branch admin emails
    const collectionAdmins = db.collection('admins');
    const admins = await collectionAdmins.find({ branch: branch }).toArray();
    if (!admins || admins.length === 0) {
      return res.status(500).json({ error: "Internal Server Error: Branch not found in admins" });
    }
    const adminEmails = admins.map(admin => admin.email);

    // Fetch superadmin email
    const collectionSuperadmin = db.collection('superadmin');
    const superadmin = await collectionSuperadmin.findOne({});
    if (!superadmin || !superadmin.email) {
      return res.status(500).json({ error: "Internal Server Error: Superadmin email not found" });
    }
    const superadminEmail = superadmin.email;

    // Fetch user details
    const collectionUsers = db.collection('Users');
    const user = await collectionUsers.findOne({ '_id': new ObjectId(userid) });
    if (!user) {
      return res.status(500).json({ error: "Internal Server Error: User not found" });
    }
    const customerEmail = user.email;
    const customerPhoneNumber = user.phoneNumber;

    // Handle booking logic
    const collectionClassBooking = db.collection('ClassBooking');
    const existingBooking = await collectionClassBooking.findOne({
      'userId': userid,
      'clsId': clsId,
      'classTime': receivedTime,  // Use the received time directly
    });
    if (!existingBooking) {
      const collectionClassSchedule = db.collection('ClassShcedule');
      const classSchedule = await collectionClassSchedule.findOne({
        '_id': new ObjectId(clsId),
        'availability': 'Available',
      });
      if (classSchedule && classSchedule.participants < classSchedule.capacity) {
        const bookingResult = await collectionClassBooking.insertOne({
          username,
          email,
          className,
          classTime: receivedTime,  // Store the received time directly
          userId: userid,
          clsId: clsId,
          branch,
        });

        if (bookingResult && bookingResult.insertedId) {
          await collectionClassSchedule.updateOne(
            { _id: new ObjectId(clsId) },
            { $inc: { participants: 1 } }
          );

          // Format the picked time for email
          const formattedTime = moment(receivedTime).format('hh:mm A');

          const mailOptions = {
            from: 'youremail@gmail.com',
            to: [...adminEmails, customerEmail, superadminEmail].join(','),
            subject: 'New Class Booking',
            html: `
              <div style="background-color: #ffffff; color: #333333; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <img src="https://i.imgur.com/uGYioKW.jpeg" alt="E8 Gym Logo" style="max-width: 200px; margin-bottom: 20px;" />
                <p style="font-size: 16px; line-height: 1.5; color: #333333;">
                  Hello <strong>${username}</strong>,
                </p>
                <p style="font-size: 16px; line-height: 1.5; color: #333333;">
                  Thank you for booking with us.<br />
                  Please find your order and booking details below.
                </p>
                <h2 style="font-size: 20px; color: #000000; margin: 20px 0;">Booking Summary</h2>
                <p style="font-size: 16px; line-height: 1.5; text-align: left; margin: 0 auto; max-width: 400px;">
                  <strong>What:</strong> ${className}<br />
                  <strong>When:</strong> ${formattedTime}<br />
                </p>
                <p style="font-size: 16px; line-height: 1.5; margin-top: 20px; color: #333333;">
                  If you need any assistance with your booking, please email us at 
                  <a href="mailto:Support@e8gym.com" style="color: #007bff; text-decoration: none;">Support@e8gym.com</a>.
                </p>
              </div>
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending email: ", error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          return res.status(200).json({ "message": "Booked Class Successfully" });
        }
      }
    }
    return res.status(500).json({ "message": "Already Booked or Class Full" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ "message": "Internal Server Error" });
    }
  } finally {
    // Close the database connection
    await client.close();
    console.log("Class booking 2!!!!!!!! connection closed");
  }
});






// Route to handle canceling bookings
app.post('/CancelBooking', async (req, res) => {
  const { className, bookingId, branch } = req.body;

  // Ensure all required fields are provided
  if (className == undefined) {
    return res.status(400).json({ error: 'Booking ID and class name are required for cancellation' });
  }

  // Log the received cancellation information
  console.log('Received Cancellation Information:', { className, bookingId, branch });

  let client;

  try {
    // Create a new MongoDB client connection
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db();

    // Connect to the desired collection
  const collection = db.collection(branch + 'Classes');
    
    // Update the number of participants in the class
    const result = await collection.updateOne(
      { 'name': className },
      { $inc: { 'participants': -1 } }
    );
    if (result.modifiedCount === 1) {
      console.log('Number of participants updated for class:', className);
    } else {
      console.error('Failed to update number of participants for class:', className);
    }

    // Remove the booking information from the MongoDB collection
  const bookingCollection = db.collection('ClassBooking');
    const objectId = new ObjectId(bookingId);
  const deleteResult = await bookingCollection.deleteOne({ _id: objectId });

  if (deleteResult.deletedCount === 1) {
    console.log('Booking information removed from MongoDB');
      return res.status(200).json({ message: 'Booking canceled successfully' });
    } else {
      console.error('Failed to remove booking information');
      return res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error during cancellation process:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Ensure connection is closed after the operation is complete
    if (client) {
      try {
        await client.close();
        console.log('CancelBooking connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
});






//noDB
app.get('/AccountScreen', async (req, res) => {
  const insertedId = req.query.insertedId;
  console.log("hello account screen!");
  console.log(insertedId);

  if (!insertedId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const user = await getId(insertedId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Route for updating user rank
app.post('/updateUserRank', async (req, res) => {
  const { userId, newRank } = req.body;

  const client = new MongoClient(uri);
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("updateUserRank connected to db");
    const db = client.db(); // Replace with your actual database name

    // Update the user's rank in the Users collection
  const collection = db.collection('Users');
  try {
    const result = await collection.updateOne(
      { '_id': new ObjectId(userId) },
      { $set: { 'rank': newRank } }
     );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'User rank updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
     }
   } catch (error) {
      console.error('Error updating user rank:', error);
      res.status(500).json({ error: 'Error updating user rank' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  } finally {
    // Close the database connection
    await client.close();
    console.log("UpdateUserRank connection closed");
  }
});






// Route for SignInScreen
app.post('/SignInScreen', async (req, res) => {
  const { email, password } = req.body;
  console.log(`got signinscreen ${email} and ${password}`);
  

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("SignInScreen Connected to database");
    const db = client.db();

   const collection = db.collection('Users');

   try {
    // Check if user with provided email, password, and verified status exists
    // Use $regex to make the email check case-insensitive
    const user = await collection.findOne({ 'email': { $regex: new RegExp(`^${email}$`, 'i') }, 'password': password, 'verified': true });
    console.log(user);
    if (user) {
      // User found and verified, send success response with userId
      res.status(200).json({ message: 'User signed in successfully', userId: user._id.toString(), fullName: user.fullName, email: user.email, branch: user.branch });
    } else {
      // User not found, not verified, or invalid credentials, send error response
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
      console.error('Error signing in user:', error);
      res.status(500).json({ error: 'Error signing in user' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
    console.log("Sign in screen connection closed");
  }
});


app.post('/ChangePassword', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Change password Connected to database');
    const db = client.db(); 

    const { email, newPassword, verificationCode } = req.body;

    try {
      // Find user by email and verification code
      const verificationCodeNumber = parseInt(verificationCode, 10);
      const result = await db.collection('Users').findOneAndUpdate(
        { email: email, verificationKey: verificationCodeNumber }, // Match the email and verification key
        { $set: { password: newPassword } }, // Update the password
        { returnOriginal: false } // Return the updated document
      );
  
      console.log('Result of findOneAndUpdate:', result); // Log the result for debugging
  
      if (result.value) {
        console.log('Password updated successfully:', result.value);
        return res.status(200).json({ message: 'Password changed successfully' });
      } else {
        console.log('Password updated successfully:', result.value);
        return res.status(200).json({ message: 'Password changed successfully' });
      }
    }catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ error: 'Error changing password' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
    console.log('Change Password connection closed');
  }
});



// Route for SignUpScreen

app.post('/SignUpScreen', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('SignUpScreen Connected to database');
    const db = client.db(); 

    console.log(req.body);
    const collection = db.collection('Users');

    try {
 // Generate a 6-digit verification key
 const verificationKey = Math.floor(100000 + Math.random() * 900000);

 // Create a new document with the verification key
 const document = { ...req.body, verificationKey };

 // Insert the document into the collection
 const result = await collection.insertOne(document);
 console.log('User signed up:', result);

      // Send verification key to user's email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dollarrami75@gmail.com',
          pass: 'tdco ogya momt kdee'
        }
      });

      await transporter.sendMail({
        from: 'your_email@example.com',
        to: req.body.email,
        subject: 'Welcome to E8GYM - Verification Code',
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #000;
                  color: #fff;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #000;
                  color: #fff;
                  text-align: center;
                }
                h1 {
                  color: #fff;
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                p {
                  color: #fff;
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 20px;
                }
                strong {
                  color: #fff;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 20px;
                  color: #fff;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Welcome to E8GYM!</h1>
                <p>Your verification code is: <strong>${verificationKey}</strong></p>
                <p>Thank you for joining E8GYM. We look forward to helping you achieve your fitness goals.</p>
                <p>If you have any questions or need assistance, please feel free to contact us.</p>
                
              </div>
            </body>
          </html>
        `,
      });

      res.status(201).json({ message: 'User signed up successfully', user: result });
    } catch (error) {
      console.error('Error signing up user:', error);
      res.status(500).json({ error: 'Error signing up user' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
    console.log('SignUpScreen Database connection closed');
  }
});
// verify 32eydj

app.post('/VerifyUser', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('VeryfyUser Connected to database');
    const db = client.db(); 

    const collection = db.collection('Users');
    try {
      // Find the user by _id
      const user = await collection.findOne({ _id: new ObjectId(req.body._id) });
  
      // Check if user exists and verificationKey matches
      if (user && user.verificationKey === parseInt(req.body.verificationKey)) {
        // Update the user's 'verified' field to true
        await collection.updateOne({ _id: user._id }, { $set: { verified: true } });

        res.status(200).json({ message: 'User verified successfully' });
      } else {
        res.status(404).json({ error: 'User not found or verification key does not match' });
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).json({ error: 'Error verifying user' });
    }
  } catch (error) {
    console.error('VeryfyUser Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
    console.log('VeryfyUser Database connection closed');
  }
});




// Route for ContactUs
app.post('/ContactUs', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('ContactUs Connected to database');
    const db = client.db(); 

    const collection = db.collection('ContactUs');
    console.log(req.body)
    try {
      // Create a new document with an explicit _id field
      const document = req.body;
      console.log(document)
      // Insert the document into the collection
      const result = await collection.insertOne(document);
      console.log('User contact us:', result);
      res.status(201).json({ message: 'User contact us successfully', user: result });
    }
    catch (error) {
      console.error('Error contacting us :', error);
      res.status(500).json({ error: 'Error contacting us' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
    console.log('ContactUs Database connection closed');
  }
});

// ttttttttttt newwwwwwwwwwwwwwwwwwwww
app.get('/ContactUs', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('ContactUs');

    // Retrieve all documents from the collection
    const documents = await collection.find().toArray();
    res.status(200).json({ contacts: documents });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Error retrieving contacts' });
  } finally {
    await client.close();
    console.log('Get Contact US Connection to MongoDB closed');
  }
});

//noDB
app.get('/Branch1SpecificScreen', async (req, res) => {
  try {
    const data = await fetchData('adminbranches', { branchID: '1' }); // Filter for branchID 1
    console.log("Filtered Data:", data); // Log filtered data
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
app.get('/Branch2SpecificScreen', async (req, res) => {
  try {
    const data = await fetchData('adminbranches', { branchID: '2' }); // Filter for branchID 2
    console.log("Filtered Data:", data); // Log filtered data
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
app.get('/Branch3SpecificScreen', async (req, res) => {
  try {
    const data = await fetchData('adminbranches', { branchID: '3' }); // Filter for branchID 3
    console.log("Filtered Data:", data); // Log filtered data
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to fetch admin data from MongoDB based on email
async function getAdminByEmail(email) {
  const client = new MongoClient(uri);
  console.log(email);
  try {
    await client.connect();
    console.log(client.status);
    const database = client.db();
    const collection = database.collection('admins');

    // Perform case-insensitive email check
    const admin = await collection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    console.log(admin);
    return admin;
  } catch (error) {
    console.error('Error fetching admin:', error);
    return null;
  } finally {
    await client.close();
    console.log("getAdminByEmail connection closed");
  }
}

//noDB
app.get('/AdminLoginScreen', async (req, res) => {
  const { email, password } = req.query;
  console.log(email, password);

  // Get admin data from MongoDB based on provided email
  const admin = await getAdminByEmail(email);
  console.log("hi");
  if (!admin) {
    console.log("Not Admin");
    return res.status(401).json({ error: 'Invalid credentials 1' });
  }

  // Compare provided password with password from database
  if (password !== admin.password) {
    console.log("No Password");
    return res.status(401).json({ error: 'Invalid credentials 2' });
  }

  // Authentication successful, send a success response
  return res.status(200).json({ message: 'Admin authenticated successfully', admin: admin });
});

// Route handler for updating branch details
app.put('/updateBranchDetails', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('adminbranches');
    const { branchID, name, location, users, profit, phoneNumber } = req.body;

    // Log the received data for debugging
    console.log("Received Data:", branchID, name, location, users, profit, phoneNumber);

    // Update the document in the collection based on the branch ID
    const result = await collection.updateOne(
      { "branchID": branchID }, // Filter by branchID
      {
        $set: {
          name: name,
          location: location,
          users: users,
          profit: profit,
          phoneNumber: phoneNumber
        }
      }
    );

    // Log the result of the update operation
    console.log("Update Result:", result);

    if (result.matchedCount === 1) {
      res.status(200).json({ message: 'Branch details updated successfully' });
    } else {
      res.status(404).json({ error: 'Branch not found' });
    }
  } catch (error) {
    console.error('Error updating branch details:', error);
    res.status(500).json({ error: 'Error updating branch details' });
  } finally {
    await client.close();
    console.log('updateBranchDetails Connection to MongoDB closed');
  }
});


async function getsuperAdminByEmail(email) {
  const client = new MongoClient(uri);
  console.log(email);
  try {
    await client.connect();
    const database = client.db('E8GYMFINAL');
    const collection = database.collection('superadmin');
    const superadmin = await collection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }); // Case-insensitive search
    console.log(email);
    return superadmin;
  } catch (error) {
    console.error('error fetching superadmin:', error);
    return null;
  } finally {
    await client.close();
    console.log("getsuperAdminByEmail connection closed");
  }
}

app.get('/SuperAdminLoginScreen', async (req, res) => {
  const { email, securityCode } = req.query; // Retrieve email and securityCode from query parameters
  console.log(email, securityCode);

  const superadmin = await getsuperAdminByEmail(email);
  if (!superadmin) {
    console.log('NOT SUPERADMIN');
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (securityCode !== superadmin.securityCode) {
    console.log('WRONG CODE');
    return res.status(401).json({ error: 'Invalid credential code' });
  }

  return res.status(200).json({ message: 'Superadmin successfully logged in' });
});



// Route to handle booking confirmation
app.post('/ClassBooking', async (req, res) => {
  const { username, email, className, time } = req.body;

  // Log the received booking information
  console.log('Received Booking Information:', { username, email, className, time });

  // Connect to MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('ClassBooking');

    // Insert booking information into MongoDB collection
    const result = await collection.insertOne({
      username: username,
      email: email,
      className: className,
      classTime: time,
    });
    console.log('Booking information stored in MongoDB:', result.ops);

    // Send success response back to the client
    res.status(201).json({ message: 'Booking successfully' });
  } catch (error) {
    console.error('Error storing booking information:', error);
    res.status(500).json({ error: 'Error storing booking information' });
  } finally {
    await client.close();
    console.log('ClassBooking Connection to MongoDB closed');
  }
});




// Function to send notification to super admin
function sendNotificationToSuperAdmin(email, checkoutInfo) {
  // You can implement the logic here to send a notification (e.g., an email) to the super admin
  console.log(`Notification sent to super admin (${email}):`, checkoutInfo);
  // Example: Send an email using nodemailer or any other email service
}

// Route for handling checkout process
app.post('/Checkout', async (req, res) => {
  const { firstName, lastName, region, products, totalCost, Address, userid } = req.body;

  // Log the received checkout information
  console.log('Received Checkout Information:', { firstName, lastName, region, totalCost, Address, userid });

  // Connect to MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Insert checkout information into MongoDB collection
    const database = client.db('E8GYMFINAL');
    const collection = database.collection('Checkout');

    const result = await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      region: region,
      products: products,
      totalCost: totalCost,
      Address: Address,
      timestamp: new Date(),
      userId: userid // Optionally, include a timestamp for reference

    });

    //console.log('Checkout information stored in MongoDB:', result.ops);

    // Send notification to super admin
    const superAdminEmail = 'superadmin@example.com'; // Change this to the actual email of the super admin
    sendNotificationToSuperAdmin(superAdminEmail, { firstName, lastName, region, products, totalCost, Address });

    // Send success response back to the client
    res.status(201).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error storing checkout information:', error);
    res.status(500).json({ error: 'Error storing checkout information' });
  } finally {
    await client.close();
    console.log("Checkout 1 post conenction closed");
  }
});

//noDB
app.get('/checkout', async (req, res) => {
  try {
    const data = await fetchData('Checkout');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Checkout data not found' });
    }
  } catch (error) {
    console.error('Error fetching checkout data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for handling form submission from OwnNowForm component
app.post('/OwnNow', async (req, res) => {
  console.log('Received form submission:', req.body); // Log the received form data

  const { fullName, mobile, email, budget, spaceAvailable, areaSize, countryCode } = req.body;

  try {
    // Validation
    if (!fullName || !mobile || !email || !budget || !spaceAvailable) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Form data
    const formData = {
      fullName,
      mobile: countryCode + mobile, // Concatenate country code with mobile number
      email,
      budget,
      spaceAvailable,
      areaSize: spaceAvailable === 'yes' ? areaSize : undefined,
    };

    console.log('Form data to be submitted:', formData); // Log the form data before submission

    // Insert form data into MongoDB collection
    const client = new MongoClient(uri);

    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database
    const collection = db.collection('OwnNow'); // Use your collection name
    const result = await collection.insertOne(formData);

    console.log('Result of form submission:', result); // Log the result of the form submission

    // Close the MongoDB connection
    await client.close();
    console.log('OwnNow Database connection closed.');

    if (result.insertedId) {
      return res.status(201).json({ message: 'Form submitted successfully' });
    } else {
      console.log("fullName1");
      return res.status(500).json({ error: 'Failed to submit form' });
    }

  } catch (error) {
    console.log("fullName")
    console.error('Error submitting form:', error);
    return res.status(500).json({ error: 'Failed to submit form. Please try again later.' });
  }
});



app.get('/OwnNow', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to OwnNow Database.');

    const db = client.db(); // Use the default database
    const collection = db.collection('OwnNow'); // Use the same collection

    // Fetch all documents
    const data = await collection.find({}).toArray();

    // Close the MongoDB connection
    await client.close();
    console.log('OwnNow Database connection closed.');

    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No data found in OwnNow' });
    }

  } catch (error) {
    console.error('Error fetching OwnNow data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/////////////////////////////////////////////

//noDB
// Route to fetch class details for Qlayaa branch
app.get('/QlayaaClasses', async (req, res) => {
  try {
    const data = await fetchData('QlayaaClasses');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Class data for Qlayaa branch not found' });
    }
  } catch (error) {
    console.error('Error fetching class data for Qlayaa branch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
// Route to fetch class details for Ajaltoun branch
app.get('/AjaltounClasses', async (req, res) => {
  try {
    const data = await fetchData('AjaltounClasses');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Class data for Ajaltoun branch not found' });
    }
  } catch (error) {
    console.error('Error fetching class data for Ajaltoun branch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
// Route to fetch class details for Hazmieh branch
app.get('/HazmiehClasses', async (req, res) => {
  try {
    const data = await fetchData('HazmiehClasses');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Class data for Hazmieh branch not found' });
    }
  } catch (error) {
    console.error('Error fetching class data for Hazmieh branch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
// Route for ClassScheduleScreen for Qlayaa branch
app.get('/QlayaaClassScheduleScreen', async (req, res) => {
  try {
    const data = await fetchData('QlayaaClasses');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Class data for Qlayaa branch not found' });
    }
  } catch (error) {
    console.error('Error fetching class data for Qlayaa branch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
// Route for ClassScheduleScreen for Ajaltoun branch
app.get('/AjaltounClassScheduleScreen', async (req, res) => {
  try {
    const data = await fetchData('AjaltounClasses');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Class data for Ajaltoun branch not found' });
    }
  } catch (error) {
    console.error('Error fetching class data for Ajaltoun branch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//noDB
// Route for ClassScheduleScreen for Hazmieh branch
app.get('/HazmiehClassScheduleScreen', async (req, res) => {
  try {
    const data = await fetchData('HazmiehClasses');
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Class data for Hazmieh branch not found' });
    }
  } catch (error) {
    console.error('Error fetching class data for Hazmieh branch:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching classes
app.get('/classes', async (req, res) => {
  const { branch } = req.query;

  // Connect to MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database

    // Fetch classes from the specified branch
    const collectionName = `${branch}Classes`;
    const collection = db.collection(collectionName);
    const classes = await collection.find().toArray();
    
    // Close the MongoDB connection
    await client.close();
    console.log('/classes Database connection closed.');

    return res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({ error: 'Error fetching classes' });
  }
});


app.get('/userClasses', async (req, res) => {
  const { userId } = req.query;
  console.log('userClasses called for user:', userId);

  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database

    const collectionName = 'ClassBooking';
    const collection = db.collection(collectionName);

    const classes = await collection.find({ 'userId': userId }).toArray();

    // Close the MongoDB connection
    await client.close();
    console.log('userClasses Database connection closed.');

    return res.status(200).json(classes);
  } catch (error) {
    console.log(`Fetching User ${userId} Classes ${error}`);
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }
});


app.get('/branches_for_super_admin', async (req, res) => {
  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database

    const collectionName = 'adminbranches';
    const collection = db.collection(collectionName);

    const agg = [
      {
        '$lookup': {
          'from': 'Users',
          'localField': 'branchID',
          'foreignField': 'branch',
          'as': 'users',
          'pipeline': [
            {
              '$project': {
                'username': '$fullName',
                'email': 1,
                'id': { '$toString': '$_id' }
              }
            }
          ]
        }
      }
    ];
    const branches = await collection.aggregate(agg).sort({ 'name': 1 }).toArray();

    // Close the MongoDB connection
    await client.close();
    console.log('branches-for-superadmin Database connection closed.');

    return res.status(200).json(branches);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error', ecode: error });
  }
});


app.get('/save_branch_information', async (req, res) => {
  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database

    const { name, location, phone, id } = req.query;
    const collectionName = 'adminbranches';
    const collection = db.collection(collectionName);

    const update = await collection.findOneAndUpdate({ '_id': new ObjectId(id) }, { '$set': { 'location': location, 'name': name, 'phoneNumber': phone } });
    console.log(update);

    // Close the MongoDB connection
    await client.close();
    console.log('save-branch-information Database connection closed.');

    return res.status(200).json({ 'success': 'document ' + id + ' Updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error', ecode: error });
  }
});


app.get('/save_new_branch_information', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const { name, location, phone, image } = req.query; // Accept 'image' parameter
    const branchesCollection = db.collection('adminbranches');
    const classScheduleCollection = db.collection('ClassShcedule');

    // Create a new branch with a unique branchID
    const newBranchID = Date.now().toString();
    const newBranch = await branchesCollection.insertOne({
      name: name,
      location: location,
      phoneNumber: phone,
      users: [],
      profit: 0,
      branchID: newBranchID,
      image: image || "", // Store image string or empty if not provided
    });

    // Fetch all unique entities from ClassSchedule based on "name"
    const uniqueEntities = await classScheduleCollection
      .aggregate([
        {
          $group: {
            _id: '$name',
            doc: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$doc' },
        },
      ])
      .toArray();

    // Duplicate entities with updated "branch" field
    const duplicatedEntities = uniqueEntities.map(({ _id, ...entity }) => ({
      ...entity,
      branch: newBranchID,
    }));
    

    if (duplicatedEntities.length > 0) {
      await classScheduleCollection.insertMany(duplicatedEntities);
    }

    await client.close();
    console.log('save_new_branch_information Database connection closed.');

    return res.status(200).json({
      success: true,
      branch: newBranch,
      duplicatedEntitiesCount: duplicatedEntities.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error', ecode: error });
  }
});







app.delete('/delete_branch1', async (req, res) => {
  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database

    const { id } = req.query; // Branch ID to delete

    // Find the branch document to get its branchID
    const branch = await db.collection('adminbranches').findOne({ _id: new ObjectId(id) });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    const branchID = branch.branchID;

    // Delete the branch from the adminbranches collection
    const branchResult = await db.collection('adminbranches').deleteOne({ _id: new ObjectId(id) });
    if (branchResult.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found for deletion' });
    }

    console.log(`Branch deleted with ID: ${id}`);

    // Delete related admins with the same branch ID
    const adminResult = await db.collection('admins').deleteMany({ branch: branchID });
    console.log(`Admins deleted for branchID: ${branchID}. Count: ${adminResult.deletedCount}`);

    // Close the MongoDB connection
    await client.close();
    console.log('Delete_branch1 Database connection closed.');

    return res.status(200).json({
      success: true,
      message: 'Branch and related admins deleted successfully',
      deletedBranch: branchResult.deletedCount,
      deletedAdmins: adminResult.deletedCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error', ecode: error });
  }
});


// Start server (adjust port as needed)
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });


app.get('/ClassBooking', async (req, res) => {
  // Class Booking get All Class Booking from The Database.
  
  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database
    
    const collectionName = 'ClassBooking';
    const collection = db.collection(collectionName);
    
    const bookings = await collection.find({}).sort({ 'username': 1 }).toArray();
    return res.status(200).json(bookings);

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error ", ecode: error });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('ClassBooking Database connection closed.');
  }
});

app.get('/get_admins_list', async (req, res) => {
  // Class Booking get All Class Booking from The Database.
  
  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database
    
    const collectionName = 'admins';
    const collection = db.collection(collectionName);
    
    const bookings = await collection.find({}).sort({ 'email': 1 }).toArray();
    return res.status(200).json(bookings);

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error ", ecode: error });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('get_admins_list Database connection closed.');
  }
});

// fierjfoirejf89r843fei
app.post('/delete_admin', async (req, res) => {
  const { _id } = req.body;

  // Validate _id format
  if (!_id || !ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Invalid _id' });
  }

  // Connect to MongoDB using URI
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const db = client.db(); // Use the default database

    const collectionName = 'admins';
    const collection = db.collection(collectionName);
    
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', ecode: error.message });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('delete_admin Database connection closed.');
  }
});



// app.get('/save_new_admin_user', async (req, res) => {
//   // name=${name}&phone=${phone}&email=${email}&password=${password}&info=${info}&branch=${selectedBranch}
//   const { name, phone, email, password, info, branch } = req.query;
//   const db = await connectToDatabase()
//   if (!db) {
//     return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
//   }

//   const collectionName = 'admins';
//   const collection = db.collection(collectionName);
//   try {
//     const users = await collection.insertOne({
//       name: name,
//       phone: phone,
//       email: email,
//       password: password,
//       info: info,
//       branch: branch,
//       created_at: Date.now()
//     })
//     return res.status(200).json({ 'success': true, 'branch': users });
//   } catch (error) {
//     return res.status(500).json({ error: 'Internal Server Error Creating New Admin' })
//   }
// })
app.get('/save_new_admin_user', async (req, res) => {
  // Destructure query parameters, including timezone
  const { name, phone, email, password, info, branch, timezone } = req.query;

  // Validate the timezone parameter
  if (!timezone || !moment.tz.zone(timezone)) {
    return res.status(400).json({ error: 'Invalid or missing timezone' });
  }

  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const collectionName = 'admins';
    const collection = db.collection(collectionName);

    // Set current time in the provided time zone
    const createdAt = moment().tz(timezone).format(); // ISO 8601 format

    // Insert new admin data
    const users = await collection.insertOne({
      name: name,
      phone: phone,
      email: email,
      password: password,
      info: info,
      branch: branch,
      created_at: createdAt, // Use the detected time zone
    });

    return res.status(200).json({ success: true, branch: users });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error Creating New Admin' });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('save_new_admin_user Database connection closed.');
  }
});



app.get('/update_admin_user', async (req, res) => {
  // Destructure query parameters, including timezone
  const { id, name, phone, email, password, info, branch, timezone } = req.query;

  // Validate the timezone parameter
  if (!timezone || !moment.tz.zone(timezone)) {
    return res.status(400).json({ error: 'Invalid or missing timezone' });
  }

  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const collectionName = 'admins';
    const collection = db.collection(collectionName);

    // Set current time in the provided time zone
    const updatedAt = moment().tz(timezone).format(); // ISO 8601 format

    // Update the admin data
    const users = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name,
          phone: phone,
          email: email,
          password: password,
          info: info,
          branch: branch,
          updated_at: updatedAt, // Use the detected time zone
        },
      }
    );

    return res.status(200).json({ success: true, branch: users });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error Updating Admin' });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('update_admin_user Database connection closed.');
  }
});


app.get('/BranchSpecficScreen', async (req, res) => {
  // Get the branch based on specific branchID
  const { id } = req.query;

  let client;
  try {
    // Establish a new unique connection for this request
    client = await MongoClient.connect(uri);
    const db = client.db();  // Get the database instance

    if (!db) {
      console.error('Failed to connect to the database.');
      return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
    }

  const collectionName = 'adminbranches';
  const collection = db.collection(collectionName);

    console.log(`Fetching branch with ID: ${id}`);
    const branch = await collection.findOne({ 'branchID': id });

    return res.status(200).json({ success: true, branch });

  } catch (error) {
    console.error('Error fetching branch:', error);
    return res.status(500).json({ error: 'Internal Server Error Fetching Branch' });
  } finally {
    // Ensure that the connection is closed after the operation
    try {
      if (client) {
        await client.close();
        console.log('BranchSpecficScreen: Database connection closed');
      }
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
});


app.get('/get_classes_for_branch', async (req, res) => {
  const { id } = req.query;  // Branch ID passed in the query

  let client;
  try {
    // Establish a new unique connection for this request
    client = await MongoClient.connect(uri);
    const db = client.db();  // Get the database instance

    if (!db) {
      console.error('Failed to connect to the database.');
      return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
    }

    const classScheduleCollection = db.collection('ClassShcedule');
    const classBookingCollection = db.collection('ClassBooking');
    const branchCollection = db.collection('adminbranches'); // Collection containing branch details

    console.log(`Fetching classes for branch ID: ${id}`);

    // Fetch branch details (including the image)
    const branch = await branchCollection.findOne({ branchID: id }, { projection: { image: 1, _id: 0 } });

    // Fetch classes for the given branch
    const classes = await classScheduleCollection.find({ branch: id }).toArray();

    // Loop through each class to gather participant counts
    for (const classItem of classes) {
      const { the_date, branch } = classItem; // Assuming the_date is an array of time strings like "12:33PM"
    
      // Count TotalParticipants for each date-specific time for the branch
      const counts = await Promise.all(the_date.map(async (time) => {
        // Query the database for the count of participants at this specific time and branch
        const count = await classBookingCollection.countDocuments({
          classTime: time,  // Directly use the AM/PM time string
          branch: branch
        });
        return count;
      }));

      // Add the participant counts to the class item
      classItem.TotalParticipants = counts;
    }

    return res.status(200).json({
      success: true,
      branchImage: branch?.image || null, // Include branch image in response
      classes
    });

  } catch (error) {
    console.error('Error fetching classes for branch:', error);
    return res.status(500).json({ error: 'Internal Server Error Fetching Classes For Branch' });
  } finally {
    // Ensure that the connection is closed after the operation
    try {
      if (client) {
        await client.close();
        console.log('get_classes_for_branch: Database connection closed');
      }
    } catch (closeError) {
      console.error('Error closing MongoDB connection:', closeError);
    }
  }
});




app.delete('/delete_class', async (req, res) => {
  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const ClassShcedule = db.collection('ClassShcedule');
    const ClassBooking = db.collection('ClassBooking');

    const { _id } = req.body;

    // Delete the class from the ClassSchedule collection
    await ClassShcedule.deleteOne({ _id: new ObjectId(_id) });

    // Delete related bookings from the ClassBooking collection
    await ClassBooking.deleteMany({ clsId: _id });

    res.status(200).json({ message: 'Class and related bookings deleted successfully' });
  } catch (error) {
    console.error('Error deleting class and related bookings:', error);
    res.status(500).json({ error: 'Failed to delete class and related bookings' });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('delete_class: Database connection closed.');
  }
});



// // diuduew78dhew9879
// app.delete('/delete_class', async (req, res) => {
//   const { _id } = req.body;
//   if (!_id) {
//     return res.status(400).json({ error: 'Bad Request: _id is required' });
//   }

//   const db = await connectToDatabase();
//   if (!db) {
//     return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
//   }

//   const collectionName = 'ClassShcedule';
//   const collection = db.collection(collectionName);
//   try {
//     const result = await collection.deleteOne({ _id: new ObjectId(_id) });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: 'Not Found: No record found with the provided _id' });
//     }
//     return res.status(200).json({ "success": true, "message": 'Record deleted successfully' });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: 'Internal Server Error Deleting Class' });
//   }
// });

// try {
//     const client = new MongoClient(uri);
//     client.connect().then(()=>{
//     const database = client.db('E8GYMFINAL');
//     const collection = database.collection('adminbranches');
//     users= collection.find({})
//     users.forEach(element => {
//       console.log(element)
//     });
//   })
//   const client1=new MongoClient(uri);
//   client1.connect().then(
//     clienta =>
//       clienta.db('E8GYMFINAL').listCollections().toArray() // Returns a promise that will resolve to the list of the collections
//     ).then(cols => console.log("Collections", cols))
//     .finally(()=>{
//       client1.close();
//     })

// } catch (error) {
//   console.log(error)
// }
app.put('/update_class', async (req, res) => {

  const { className, instructor, schedule, id, availability, description, capacity, timeEnd, days } = req.body;
  console.log(className, instructor, schedule, id, availability)
  //console.log(`PDate => ${schedule}`)
  //console.log(`DATE=> ${new Date(schedule)}`)
  console.log(req.body);
  console.log("\n")

  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const collectionName = 'ClassShcedule';
    const collection = db.collection(collectionName);
    
    await collection.updateOne({ 'id': id }, {
      '$set': {
        'className': className,
        'instructor': instructor,
        'time': schedule,
        'name': className,
        'availability': availability,
        'description': description,
        'capacity': capacity,
        'timeEnd': timeEnd,
        'days': days
      }
    });
    
    return res.status(200).json({ 'success': true });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Updating Class' })
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('update_class Database connection closed.');
  }

});


//Updates already existing class by clicking on it from superadmin manage branches manage classes > class title
app.put('/update_classNew', async (req, res) => {

  const { className, instructor, id, availability, startDate, endDate, description, capacity, days, branch, the_date } = req.body;
  console.log(req.body)

  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const collectionName = 'ClassShcedule';
    const collection = db.collection(collectionName);

    statos = await collection.updateOne({ 'id': id, 'branch': branch }, {
      '$set': {
        'className': className,
        'instructor': instructor,
        'the_date': the_date,
        'name': className,
        'availability': availability,
        'description': description,
        'capacity': capacity,
        'startDate': startDate,
        'endDate': endDate,
        'days': days
      }
    });
    console.log(statos)
    return res.status(200).json({ 'success': true });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Updating Class' })
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('update_classnew: Database connection closed.');
  }
});





app.get('/AllUsers', async (req, res) => {
  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const collection = db.collection('Users');
    const agg = [
      {
        '$addFields': {
          'localId': { '$toString': '$_id' }
        }
      },
      {
        '$lookup': {
          'from': 'ClassBooking',
          'localField': 'localId',
          'foreignField': 'userId',
          'as': 'result',
          'pipeline': [
            {
              '$addFields': {
                'cls': { '$toObjectId': '$clsId' }
              }
            },
            {
              '$lookup': {
                'from': 'ClassShcedule',
                'localField': 'cls',
                'foreignField': '_id',
                'as': 'Class',
                'pipeline': [
                  {
                    '$project': {
                      '_id': 0,
                      'days': 1  // Only include `days` from `ClassShcedule`
                    }
                  }
                ]
              }
            },
            {
              '$project': {
                'classTime': 1,  // Directly include `classTime` from `ClassBooking`
                'Class': 1       // Include `Class` for `days` information
              }
            }
          ]
        }
      },
      {
        '$lookup': {
          'from': 'adminbranches',
          'localField': 'branch',
          'foreignField': 'branchID',
          'as': 'branchName'
        }
      },
      {
        '$sort': {
          'branchName.name': 1,
          'fullName': 1
        }
      }
    ];

    const cursor = collection.aggregate(agg);
    const result = await cursor.toArray();
    return res.status(200).json({ 'success': true, 'users': result });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('AllUsers Database connection closed.');
  }
});


//1-29-2025
app.post('/getUserFromBooking', async (req, res) => {
  // Extract _id from req.body
  const { _id } = req.body;
  console.log("Class ID : ", _id);

  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const classBookingCollection = db.collection("ClassBooking");
    const userCollection = db.collection('Users');

    // Find documents where clsId matches _id and project userId & classTime
    const bookings = await classBookingCollection.find(
      { clsId: _id },
      { projection: { userId: 1, classTime: 1, _id: 0 } }
    ).toArray();

    // Group classTimes by userId
    const classTimesByUser = bookings.reduce((acc, { userId, classTime }) => {
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(classTime);
      return acc;
    }, {});

    // Convert userId strings to ObjectId
    const userIdObjects = Object.keys(classTimesByUser).map(id => new ObjectId(id));

    // Find users in Users collection
    const users = await userCollection.find({ _id: { $in: userIdObjects } }).toArray();

    // Append combined classTime to each user
    const usersWithClassTime = users.map(user => ({
      ...user,
      classTime: classTimesByUser[user._id.toString()].join(", ") || null
    }));

    res.json(usersWithClassTime);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error: Error Fetching Data' });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('getUserFromBooking Database connection closed.');
  }
});




app.get('/AllUsersForBranch', async (req, res) => {
  const { bid } = req.query;
  // console.log(bid)

  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(); // Use the default database

    const collection = db.collection('Users');
    const agg = [
      {
        '$match': {
          'branch': bid
        }
      },
      {
        '$addFields': {
          'localId': {
            '$toString': '$_id'
          }
        }
      },
      {
        '$lookup': {
          'from': 'ClassBooking',
          'localField': 'localId',
          'foreignField': 'userId',
          'as': 'result',
          'pipeline': [
            {
              '$addFields': {
                'cls': {
                  '$toObjectId': '$clsId'
                }
              }
            },
            {
              '$lookup': {
                'from': 'ClassShcedule',
                'localField': 'cls',
                'foreignField': '_id',
                'as': 'Class'
              }
            }
          ]
        }
      },
      {
        '$lookup': {
          'from': 'adminbranches',
          'localField': 'branch',
          'foreignField': 'branchID',
          'as': 'branchName'
        }
      }
    ];

    const cursor = collection.aggregate(agg);
    const result = await cursor.toArray();
    console.log(`Returning Users For A Branch ${bid}`);
    // console.debug(result)
    result.forEach((value) => {
      console.dir(value);
    });

    return res.status(200).json({ 'success': true, 'users': result });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('AllUsersBranch Database connection closed.');
  }
});

const os = require('os');
const PORT = process.env.PORT || 5000;
const IP_ADDRESS = getPrivateIpAddress();
function getPrivateIpAddress() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (let i = 0; i < interfaceInfo.length; i++) {
      const info = interfaceInfo[i];
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return '127.0.0.1';     //0.0.0.0 NOV 29
}

app.listen(5000, '0.0.0.0', () => { //'0.0.0.0' NOV 29
  console.log(`server started on http://${IP_ADDRESS}:${PORT}`);
});
// app.listen(PORT, IP_ADDRESS, () => { //'0.0.0.0' NOV 29
//   console.log(`server started on http://${IP_ADDRESS}:${PORT}`);
// });



