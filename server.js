// server.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
// const audit = require('express-requests-logger')
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const app = express();
const port = 5000;

const uri = 'mongodb+srv://boughosnjuliano:q7wkLINHFnEUBleP@cluster0.759muhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('combined'))
const client = new MongoClient(uri);


async function connectToDatabase() {
  // const client = new MongoClient(uri);

  try {

    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('E8GYMFINAL');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return null;
  }
}
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
  }
}

// Route for creating a new class
app.post('/createClass', async (req, res) => {
  /*
        'className':className,
        'instructor':instructor,
        'time':schedule,
        'name':className,
        'availability':availability,
        'description':description,
        'capacity':capacity
    */
  const { className, instructor, time, description, capacity, branch } = req.body;

  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
    }
    console.log("Logging Body ")
    console.log(req.body)
    // console.log(req)
    const collectionName = "ClassShcedule";


    const collection = db.collection(collectionName);
    const result = await collection.insertOne({
      className: className,
      name: className,
      instructor: instructor,
      time: time,
      description: description,
      branch: branch,
      id: Date.now().toString(),
      availability: "Available",
      participants: 0,
      capacity: capacity
    });

    res.status(200).json({ message: 'Class created successfully 11' });

  } catch (error) {
    console.error('Error creating class: 33', error);
    res.status(500).json({ error: 'Error creating class 44' });
  }
});


app.post('/createClassesNew', async (req, res) => {
  /*
      'className': className,
      'instructor': instructor,
      'startDate': startDate.toISOString(),
      'endDate': endDate.toISOString(),
      'the_date': theDates,
      'days': days,
      'name': className,
      'description': description,
      'capacity': capacity,
      'branch': branch
    */
  const { className, instructor, startDate, endDate, the_date, days, name, description, capacity, branch } = req.body;

  console.log(req.body);

  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
    }

    console.log("Logging Body");
    console.log(req.body);

    const classCollection = db.collection("ClassShcedule"); // Corrected typo here
    const adminBranchCollection = db.collection("adminbranches");

    // Fetch all branch IDs from adminbranches
    const branches = await adminBranchCollection.find({}).toArray();

    // Create a new class record for each branch ID
    classID = Date.now().toString();
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

    res.status(200).json({ message: 'Classes created successfully for all branches' });

  } catch (error) {
    console.error('Error creating classes:', error);
    res.status(500).json({ error: 'Error creating classes' });
  }
});




app.post('/createClassNew', async (req, res) => {
  /*
      'className': className,
      'instructor': instructor,
      'startDate': startDate.toISOString(),
      'endDate': endDate.toISOString(),
      'the_date': theDates,
      'days': days,
      'name': className,
      'description': description,
      'capacity': capacity,
      'branch': branch
    */
  const { className, instructor, startDate, endDate, the_date, days, name, description, capacity, branch } = req.body;

  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
    }
    console.log("Logging Body ")
    console.log(req.body)
    // console.log(req)
    const collectionName = "ClassShcedule";


    const collection = db.collection(collectionName);
    const result = await collection.insertOne({
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
      capacity: capacity
    });

    res.status(200).json({ message: 'Class created successfully 11' });

  } catch (error) {
    console.error('Error creating class: 33', error);
    res.status(500).json({ error: 'Error creating class 44' });
  }
});


app.get('/fetchAllBranchesGroupedClasses', async (req, res) => {
  const db = await connectToDatabase();
  if (!db) {
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
    }, {
      '$unwind': {
        'path': '$branchDetails'
      }
    }, {
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
  const cursor = coll.aggregate(agg);
  const classes = await cursor.toArray();
  res.status(200).json(classes);
})


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

//1st route for purchase screen booking
app.get('/PurchaseInfoScreenBooking', async (req, res) => {
  const userID = req.query.userid;
  console.log("User ID : ", userID);
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }
  const checkOutCollectionbook = db.collection("ClassBooking"); //?? right?
  try {
    // Get all Checkouts from the database where UserID matches the parameter userId
    checkOutCollectionbook.find({ "userId": userID }).toArray()
      .then((bookings) => {
        console.log("Bookings We Got ")
        console.log(bookings);
        res.json(bookings);
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: Error Fetching Data ' });
      })
  } catch (err) {
    console.log(err);
  };
});

//Route for PurchaseinfoScreen
app.get('/PurchaseInfoScreen', async (req, res) => {
  const userID = req.query.userid;
  console.log("User ID : ", userID);
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }
  const checkOutCollection = db.collection("Checkout");
  try {
    // Get all Checkouts from the database where UserID matches the parameter userId
    checkOutCollection.find({ "userId": userID }).toArray()
      .then((checkOuts) => {
        console.log(checkOuts);
        res.json(checkOuts);
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error: Error Fetching Data ' });
      })
  } catch (err) {
    console.log(err);
  };

});
// Get All Branches From  Database and send it as a response
app.get("/BranchList", async (req, res) => {
  const db = await connectToDatabase();
  const branchColletion = db.collection("ClassShcedule");
  const agg = [
    {
      '$group': {
        '_id': 'Branches',
        'branch': {
          '$addToSet': '$branch'
        }
      }
    }, {
      '$unwind': {
        'path': '$branch'
      }
    }
  ]
  const branches = await branchColletion.aggregate(agg).toArray();
  console.log(branches);
  res.json(branches)
});


app.get('/getBranchesAndClasses', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const branchColletion = db.collection("ClassShcedule");
    const branches = await branchColletion.find({}).sort({ 'branch': 1 }).toArray()
    res.json(branches);
  } catch (err) {
    console.error(err);
  }
})
// meeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
const { Int32 } = require('mongodb');
app.post('/cancelBooking', async (req, res) => {
  const { _id } = req.body;

  // Connect to MongoDB (assuming connectToDatabase function exists)
  const db = await connectToDatabase();
  if (!db) {
    return res
      .status(500)
      .json({
        error: "Internal Server Error: Unable to connect to the database",
      });
  }

  // Get the collections using the established connection
  const collectionClassBooking = db.collection('ClassBooking');
  const collectionClassSchedule = db.collection('ClassShcedule');

  try {
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
    await collectionClassBooking.deleteOne({ _id: new ObjectId(_id) });

    res.json({ message: 'Booking cancelled and participants count updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error cancelling booking');
  }
});

app.post('/getBooking', async (req, res) => {
  const { userId, branch } = req.body;

  // Connect to MongoDB (assuming connectToDatabase function exists)
  const db = await connectToDatabase();
  if (!db) {
    return res
      .status(500)
      .json({
        error: "Internal Server Error: Unable to connect to the database",
      });
  }

  // Get the collection using the established connection
  const collectionClassBooking = db.collection('ClassBooking');

  try {
    const bookings = await collectionClassBooking.find({ userId, branch }).toArray();
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching bookings');
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

  // Connect to MongoDB
  const db = await connectToDatabase();
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

  // Search the admins collection for the branch and get all the emails
  const collectionAdmins = db.collection('admins');
  const admins = await collectionAdmins.find({ branch: branch }).toArray();
  if (!admins || admins.length === 0) {
    return res.status(500).json({ error: "Internal Server Error: Branch not found in admins" });
  }
  const adminEmails = admins.map(admin => admin.email);

  // Retrieve customer's email and phone number from the Users collection
  const collectionUsers = db.collection('Users');
  const user = await collectionUsers.findOne({ '_id': new ObjectId(userid) });
  if (!user) {
    return res.status(500).json({ error: "Internal Server Error: User not found" });
  }
  const customerEmail = user.email;
  const customerPhoneNumber = user.phoneNumber;

  // In order to add client to a class we need to update three collections
  const collectionClassBooking = db.collection('ClassBooking');
  try {
    const existingBooking = await collectionClassBooking.findOne({ 'userId': userid, 'clsId': clsId });
    if (existingBooking == null) {
      // Check if ClassShcedule availability is not Locked
      console.log("Not Null Finding Availability");
      const collectionClassShcedule = db.collection('ClassShcedule');
      const classSchedule = await collectionClassShcedule.findOne({ '_id': new ObjectId(clsId), 'availability': 'Available' });
      console.log("Availability result ");
      console.log(classSchedule);
      if (classSchedule !== null && classSchedule.participants < classSchedule.capacity) {
        // Add user to ClassBooking
        const bookingResult = await collectionClassBooking.insertOne({
          username: username,
          email: email,
          className: className,
          classTime: classSchedule.the_date,
          userId: userid,
          clsId: clsId,
          branch: branch,
        });
        console.log("We Have Insertion result ", bookingResult);
        if (bookingResult && bookingResult.hasOwnProperty('insertedId')) {
          // Update ClassShcedule participants += 1
          const updateResult = await collectionClassShcedule.updateOne(
            { _id: new ObjectId(clsId) },
            { $inc: { participants: 1 } } // Increment the number of participants by 1
          );
          console.log("We Have Update result");
          console.log(updateResult);
          const formatTime = (date) => {
            return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          };
          let sched = formatTime(classSchedule.the_date[0]);
          // Send email to all admins of the branch, the customer, and the super admin
          //${classSchedule.the_date.map(date => `<li>${formatTime(date)}</li>`).join('')}
          const mailOptions = {
            from: 'youremail@gmail.com',
            to: [...adminEmails, customerEmail, 'joe843189@gmail.com'].join(','),
            subject: 'New Class Booking',
            html: `
              <div style="background-color: #1a1a1a; color: #f1f1f1; font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #ffffff; border-bottom: 2px solid #555555; padding-bottom: 10px;">New Class Booking</h2>
                <p style="color: #cccccc;">Greetings,</p>
                <p style="color: #cccccc;">A new booking has been made by <strong>${username}</strong> for the class <strong>${className}</strong> at <strong>
                <ul style="color: #cccccc;">
                ${`<li>${sched}</li>`}
                </ul></strong>.</p>
                <p style="color: #cccccc;">Customer Email: <strong>${customerEmail}</strong></p>
                <p style="color: #cccccc;">Customer Phone: <strong>${customerPhoneNumber}</strong></p>
                <p style="color: #cccccc;">Thank you for using our service!</p>
                <div style="margin-top: 20px; border-top: 2px solid #555555; padding-top: 10px; color: #888888;">
                  <p style="margin: 0;">Best regards,</p>
                  <p style="margin: 0;">E8 GYM</p>
                </div>
              </div>
            `
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending email: ", error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          return res.status(200).json({ "message": "Booked Class Successfully" });
        } else {
          return res.status(500).json({ "message": "Error Occured While Adding Classes" });
        }
      } else {
        return res.status(500).json({ "message": "Error Occured While Adding Classes" });
      }
    } else {
      return res.status(500).json({ "message": "Error Occured While Adding Classes" });
    }
  } catch (error) {
    console.log("We Have Error 2");
    console.log(error);
    return res.status(500).json({ "message": "Error Occured While Adding Classes" });
  }
});




// Route to handle canceling bookings
app.post('/CancelBooking', async (req, res) => {
  const { className, bookingId, branch } = req.body;

  // can you listen to my vn?
  // Ensure all required fields are provided
  // where do you define those fields ?
  if (className == undefined) {
    return res.status(400).json({ error: 'Booking ID and class name are required for cancellation' });
  }
  //if (!bookingId || !className) {

  //}

  // Log the received cancellation information
  console.log('Received Cancellation Information:', { className, bookingId, branch });

  // Connect to MongoDB
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }

  // Update the number of participants in the class
  //console.log((await db.collections())[0].toString())
  const collection = db.collection(branch + 'Classes');
  try {
    //const finder=await collection.insertOne({'test':'tested'});
    console.log("FIneder", db.databaseName)
    //console.log(await finder.toArray());
    const result = await collection.updateOne(
      { 'name': className },
      { $inc: { 'participants': -1 } }
    );
    console.log("Modified Result")
    console.log(result)
    if (result.modifiedCount === 1) {
      console.log('Number of participants updated for class:', className);
    } else {
      console.error('Failed to update number of participants for class:', className);
    }
  } catch (error) {
    console.error('Error updating number of participants for class:', error);
  }

  // Remove the booking information from the MongoDB collection
  const bookingCollection = db.collection('ClassBooking');
  try {
    console.log(`Attempting to remove booking with ID: ${bookingId}`);
    if (!bookingId) {
      console.error('Error: Booking ID is empty or undefined');
      return res.status(400).json({ error: 'Booking ID is empty or undefined' });
    }

    const objectId = new ObjectId(bookingId);
    console.log('Parsed ObjectId:', objectId);

    const result = await bookingCollection.deleteOne({ _id: objectId });

    console.log(result)
    if (result.deletedCount === 1) {
      console.log('Booking information removed from MongoDB:', result.deletedCount);
      // Send success response back to the client
      return res.status(200).json({ message: 'Booking canceled successfully' });
    } else {
      console.error('Failed to remove booking information');
      return res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error removing booking information:', error);
    return res.status(500).json({ error: 'Error removing booking information' });
  }
});







app.get('/AccountScreen', async (req, res) => {
  const insertedId = req.query.insertedId;
  console.log("hello");
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

  // Connect to MongoDB
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }

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
});

{/*// Route for AccountScreen
app.get('/AccountScreen', async (req, res) => {
  const data = await fetchData('Users');
  if (data) {
    console.log(data)
   res.json(data);
  } else {
   res.status(500).json({ error: 'Internal Server Error' });
  }
});*/}





// Route for SignInScreen
app.post('/SignInScreen', async (req, res) => {
  const { email, password } = req.body;
  console.log(`got signinscreen ${email} and ${password}`);
  const db = await connectToDatabase('E8GYMFINAL');

  if (!db) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

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
});




// Route for SignUpScreen

app.post('/SignUpScreen', async (req, res) => {
  const db = await connectToDatabase('E8GYMFINAL');
  if (!db) {
    console.log(req.body);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

  const collection = db.collection('Users');
  console.log(req.body);
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
});
// verify 32eydj

app.post('/VerifyUser', async (req, res) => {
  const db = await connectToDatabase('E8GYMFINAL');
  if (!db) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

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
});








// Route for ContactUs
app.post('/ContactUs', async (req, res) => {
  const db = await connectToDatabase('E8GYMFINAL');

  if (!db) {
    console.log(req.body)
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

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
});
// ttttttttttt newwwwwwwwwwwwwwwwwwwww
app.get('/ContactUs', async (req, res) => {
  const db = await connectToDatabase('E8GYMFINAL');

  if (!db) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }

  const collection = db.collection('ContactUs');

  try {
    // Retrieve all documents from the collection
    const documents = await collection.find().toArray();
    res.status(200).json({ contacts: documents });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ error: 'Error retrieving contacts' });
  }
});

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
// // Function to fetch admin data from MongoDB based on email
async function getAdminByEmail(email) {
  const client = new MongoClient(uri);
  console.log(email);
  try {
    await client.connect();
    console.log(client.status);
    const database = client.db('E8GYMFINAL');
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
  }
}

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
  try {
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
    }

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
  const { username, email, className, time, } = req.body;

  // Log the received booking information
  console.log('Received Booking Information:', { username, email, className, time, });

  // Connect to MongoDB
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }

  // Insert booking information into MongoDB collection
  const collection = db.collection('ClassBooking');
  try {
    const result = await collection.insertOne({
      username: username,
      email: email,
      className: className,
      classTime: time,


    });
    console.log('Booking information stored in MongoDB:', result.ops);

    // Send success response back to the client
    res.status(201).json({ message: 'Booking  successfully' });
  } catch (error) {
    console.error('Error storing booking information:', error);
    res.status(500).json({ error: 'Error storing booking information' });
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
  }
});

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
    const db = await connectToDatabase();
    if (!db) {
      return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
    }

    const collection = db.collection('OwnNow'); // Use your collection name
    const result = await collection.insertOne(formData);

    console.log('Result of form submission:', result); // Log the result of the form submission

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
/////////////////////////////////////////////


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
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }

  // Fetch classes from the specified branch
  const collectionName = `${branch}Classes`;
  const collection = db.collection(collectionName);
  try {
    const classes = await collection.find().toArray();
    return res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({ error: 'Error fetching classes' });
  }
});
app.get('/userClasses', async (req, res) => {
  const { userId } = req.query;
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }
  const collectionName = 'ClassBooking';
  const collection = db.collection(collectionName);
  try {
    const classes = await collection.find({ 'userId': userId }).toArray();
    return res.status(200).json(classes);
  } catch (error) {
    console.log(`Fetching User ${useId} Classes ${error}`)
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }
});
app.get('/branches_for_super_admin', async (req, res) => {
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
  const collectionName = 'adminbranches';
  const collection = db.collection(collectionName);
  try {
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
    ]
    const branches = await collection.aggregate(agg).sort({ 'name': 1 }).toArray();
    return res.status(200).json(branches);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Server Error', ecode: error })
  }
})
app.get('/save_branch_information', async (req, res) => {
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
  const { name, location, phone, id } = req.query;
  const collectionName = 'adminbranches';
  const collection = db.collection(collectionName);
  try {
    const update = await collection.findOneAndUpdate({ '_id': new ObjectId(id) }, { '$set': { 'location': location, 'name': name, 'phoneNumber': phone } })
    console.log(update)
    return res.status(200).json({ 'success': 'document ' + id + ' Updated' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Server Error', ecode: error })
  }
})

app.get('/save_new_branch_information', async (req, res) => {
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
  const { name, location, phone } = req.query;
  const collectionName = 'adminbranches';
  const collection = db.collection(collectionName);
  try {
    const newBranch = await collection.insertOne({
      'name': name,
      'location': location,
      'phoneNumber': phone,
      'users': [],
      'profit': 0,
      'branchID': Date.now().toString()
    })
    // const update = await collection.findOneAndUpdate({'_id':new ObjectId(id)},{'$set':{'location':location,'name':name,'phoneNumber':phone}})
    console.log(newBranch)
    return res.status(200).json({ 'success': true, 'branch': newBranch });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Server Error', ecode: error })
  }
})
app.get('/ClassBooking', async (req, res) => {
  // Class Booking get All Class Booking from The Database.
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'ClassBooking';
  const collection = db.collection(collectionName);
  try {
    const bookings = await collection.find({}).sort({ 'username': 1 }).toArray();
    return res.status(200).json(bookings);


  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error ", ecode: error })
  }
});
app.get('/get_admins_list', async (req, res) => {
  // Class Booking get All Class Booking from The Database.
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'admins';
  const collection = db.collection(collectionName);
  try {
    const bookings = await collection.find({}).sort({ 'email': 1 }).toArray();
    return res.status(200).json(bookings);


  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error ", ecode: error })
  }
})
// fierjfoirejf89r843fei
app.post('/delete_admin', async (req, res) => {
  const { _id } = req.body;

  // Validate _id format
  if (!_id || !ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Invalid _id' });
  }

  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
  }

  const collectionName = 'admins';
  const collection = db.collection(collectionName);
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', ecode: error.message });
  }
});


app.get('/save_new_admin_user', async (req, res) => {
  // name=${name}&phone=${phone}&email=${email}&password=${password}&info=${info}&branch=${selectedBranch}
  const { name, phone, email, password, info, branch } = req.query;
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'admins';
  const collection = db.collection(collectionName);
  try {
    const users = await collection.insertOne({
      name: name,
      phone: phone,
      email: email,
      password: password,
      info: info,
      branch: branch,
      created_at: Date.now()
    })
    return res.status(200).json({ 'success': true, 'branch': users });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Creating New Admin' })
  }
})
app.get('/update_admin_user', async (req, res) => {
  //update_admin_user?id=${admin._id}&name=${name}&phone=${phone}&email=${email}&password=${password}&info=${info}&branch=${selectedBranch}
  const { id, name, phone, email, password, info, branch } = req.query;
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'admins';
  const collection = db.collection(collectionName);
  try {
    const users = await collection.updateOne({ '_id': new ObjectId(id) }, {
      '$set': {
        name: name,
        phone: phone,
        email: email,
        password: password,
        info: info,
        branch: branch,
        updated_at: Date.now()
      }
    })
    return res.status(200).json({ 'success': true, 'branch': users });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Creating New Admin' })
  }

});

app.get('/BranchSpecficScreen', async (req, res) => {
  //Get The Branch Based On Specific branchID 
  const { id } = req.query;
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'adminbranches';
  const collection = db.collection(collectionName);
  try {
    branch = await collection.findOne({ 'branchID': id })
    return res.status(200).json({ "success": true, "branch": branch })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Server Error Fetching Branch' })
  }
})

app.get('/get_classes_for_branch', async (req, res) => {
  const { id } = req.query;
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'ClassShcedule';
  const collection = db.collection(collectionName);
  try {
    classes = await collection.find({ 'branch': id }).toArray();
    return res.status(200).json({ "success": true, "classes": classes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error Fetching Classes For Branch' })
  }
})
// diuduew78dhew9879
app.delete('/delete_class', async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ error: 'Bad Request: _id is required' });
  }

  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
  }

  const collectionName = 'ClassShcedule';
  const collection = db.collection(collectionName);
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Not Found: No record found with the provided _id' });
    }
    return res.status(200).json({ "success": true, "message": 'Record deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error Deleting Class' });
  }
});

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
  //update_class?className=${className}&instructor=${instructor}&schedule=${the_date}&id=${theClass.id}
  //className=Vikings
  //instructor=E8%20Team%20ajaltoun
  //id=1715429537806
  //availability=Available
  //description=
  //capacity=10
  //schedule=Sun%20May%2005%202024%2004:00:00%20GMT+0300
  const { className, instructor, schedule, id, availability, description, capacity, timeEnd, days } = req.body;
  console.log(className, instructor, schedule, id, availability)
  console.log(`PDate => ${schedule}`)
  console.log(`DATE=> ${new Date(schedule)}`)
  console.log(req.body);
  console.log("\n")
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'ClassShcedule';
  const collection = db.collection(collectionName);
  try {
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
  }


});
// Faysal 
app.put('/update_classNew', async (req, res) => {

  const { className, instructor, id, availability, startDate, endDate, description, capacity, days, branch, the_date } = req.body;
  console.log(req.body)
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }

  const collectionName = 'ClassShcedule';
  const collection = db.collection(collectionName);
  try {
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
  }


});




app.get('/AllUsers', async (req, res) => {
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
  const collection = db.collection('Users');
  try {
    const agg = [
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
            }, {
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
    return res.status(200).json({ 'success': true, 'users': result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
})
// meeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
// app.delete('/DeleteUser', async (req, res) => {
//   const { _id } = req.body;
//   console.log(req.body);

//   if (!_id) {
//     return res.status(400).json({ error: 'Missing _id in request body' });
//   }

//   const db = await connectToDatabase();
//   if (!db) {
//     return res.status(500).json({ error: 'Internal Server Error Connecting To DB' });
//   }

//   const collection = db.collection('Users');
//   try {
//     const objectId = new ObjectId(_id);
//     const result = await collection.deleteOne({ _id: objectId });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     console.log(`Deleted user with _id: ${_id}`);
//     return res.status(200).json({ success: true, message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(`Error deleting user with _id: ${_id}`, error);
//     return res.status(500).json({ error: 'Internal Server Error Deleting User' });
//   }
// });
// diuewhdiuewhdoiw3we3


app.post('/getUserFromBooking', async (req, res) => {
  // Extract _id from req.body
  const { _id } = req.body;
  console.log("Class ID : ", _id);

  // Connect to the database
  const db = await connectToDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error: Unable to connect to the database' });
  }

  // Get the ClassBooking collection
  const classBookingCollection = db.collection("ClassBooking");
  const userCollection = db.collection('Users');

  try {
    // Find documents where clsId matches _id from req.body and project only the userId field
    const userIds = await classBookingCollection.find(
      { clsId: _id },
      { projection: { userId: 1, _id: 0 } }
    ).toArray();

    // Map userIds to ObjectId
    const userIdObjects = userIds.map(({ userId }) => new ObjectId(userId));

    // Find users in Users collection where _id is in userIdObjects
    const users = await userCollection.find(
      { _id: { $in: userIdObjects } }
    ).toArray();

    // Send the user records in the response
    res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal Server Error: Error Fetching Data' });
  }
});




app.get('/AllUsersForBranch', async (req, res) => {
  const { bid } = req.query;
  // console.log(bid)
  const db = await connectToDatabase()
  if (!db) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
  const collection = db.collection('Users');
  try {
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
            }, {
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
    console.log(`Returning Users For A Branch ${bid}`)
    // console.debug(result)
    result.forEach((value) => {
      console.dir(value)
    })
    return res.status(200).json({ 'success': true, 'users': result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error Connecting To DB' })
  }
})

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
  return '127.0.0.1';
}

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`server started on http://${IP_ADDRESS}:${PORT}`);
});