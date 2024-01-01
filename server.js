import express from 'express';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';
import checkClearance from './server/checkClearance';

// Allow only specific origins for a particular route
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3001;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Verify database connection
db.connect()
  .then(() => {
    console.log('Database connection successful');
   })
  .catch((error) => {
    console.error('Error connecting to the database', error);
    process.exit(1);
  });

app.use(express.json());
app.use(flash());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 1 day in milliseconds
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize and deserialize user functions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});



// Passport local strategy for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // Customize as needed based on your form fields
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log(user);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

  app.options('/login', cors(corsOptions));

  app.post('/login', async (req, res) => {
    const { userId, password } = req.body;
  
    try {
      // Query the database to verify user credentials using either username or email
      const result = await db.query('SELECT * FROM user_table WHERE (username = $1 OR email = $1)', [userId]);
  
      if (result.rows.length === 1) {
        const user = result.rows[0];
  
        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.user_pw);

        if (passwordMatch) {
          // Passwords match, user is authenticated
          // Update the last_login_timestamp with the current timestamp
          await db.query('UPDATE user_table SET last_login_timestamp = NOW() WHERE user_id = $1', [user.user_id]);
  
          res.json({ success: true, user });
        } else {
          // Passwords do not match, authentication failed
          res.json({ success: false, message: 'Invalid password' });
        }
      } else {
        // No user found with the provided username or email
        res.json({ success: false, message: 'Invalid username or email' });
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ success: false, message: 'Internal server error during login' });
    }
  });

  app.post('/logout', (req, res) => {
    req.logout(); // Passport.js function to remove the user from the session
    res.json({ success: true });
  });

app.options('/new_user', cors(corsOptions));

app.post('/new_user',checkClearance, async (req, res) => {
  const { firstName, lastName, username, password, email, title, clearance } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the saltRounds as needed

    const existingUser = await db.query('SELECT * FROM user_table WHERE username = $1 OR email = $2', [username, email]);

    if (existingUser.rows.length > 0) {
      res.json({ success: false, message: 'User with the same username or email already exists' });
    } else {
      const result = await db.query(
        'INSERT INTO user_table (fname, lname, username, user_pw, email, job_title, clearance_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [firstName, lastName, username, hashedPassword, email, title, clearance]
      );

      if (result.rows.length === 1) {
        const newUser = result.rows[0];
        res.json({ success: true, user: newUser });
      } else {
        res.json({ success: false, message: 'Failed to add user' });
      }
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
  res.json({ message: 'This is a protected route!' });
});

app.get('/cleaning_lists', async (req, res) => {
  try {
    var begDay = getSunday(new Date());
    var endDay = getSaturday(new Date());
    begDay = dateOnly(begDay.toDateString());
    endDay = dateOnly(endDay.toDateString());
    var nextBegDay = getSunday(new Date(new Date(begDay).getTime() + 7 * 24 * 60 * 60 * 1000));
    var nextEndDay = getSaturday(new Date(new Date(endDay).getTime() + 7 * 24 * 60 * 60 * 1000));
    nextBegDay = dateOnly(nextBegDay.toDateString());
    nextEndDay = dateOnly(nextEndDay.toDateString());

    // Fetch cleaning staff data from the database
    const cleaningStaff = await getCleaningStaff();

    // Fetch pending data from the database
    const pendingTrucks = await getPendingTrucks();
  
    // Ensure getCleaningList is awaited
    const trucks = await getCleaningList(endDay);

    // Create the response object with both lists and their start and end dates
    const response = {
      success: true,
      currentWeek:{
        startDate:begDay,
        endDate:endDay,
        list:trucks[0]
      },
      nextWeek:{
        startDate:nextBegDay,
        endDate:nextEndDay,
        list:trucks[1],
      },
      cleaningStaff,
      pendingTrucks,
      
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting cleaning lists:', error);
    res.status(500).json({ success: false, message: 'Internal server error during cleaning lists retrieval' });
  }
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const {
      unitNumber,
      dateCleaned,
      cleanedBy,
      truckCond,
      cleaningNotes,
    } = req.body;

    let price;
    const unitStyle = await getUnitStyle(req.body.unitNumber);

    // Use the retrieved unitStyle in the subsequent logic
    if (unitStyle === 'Sleeper') {
      price = 40.00;
    } else {
      price = 30.00;
    }

    // Use parameterized queries to prevent SQL injection
    const insertQuery = `
      INSERT INTO cleaning_history (
        unit_number, date_cleaned, cleaned_by, truck_cond, cleaning_notes, price
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    // Execute the query with cleanedBy and truckCond as integers
    await db.query(insertQuery, [
      unitNumber,
      dateCleaned,
      parseInt(cleanedBy, 10), // Convert cleanedBy to integer
      parseInt(truckCond, 10), // Convert truckCond to integer
      cleaningNotes,
      price, // Add the value for the 'price' placeholder
    ]);

    // Call cleaningListUpdate and await it
    await cleaningListUpdate(req.body.unitNumber, req.body.dateCleaned);

    // Add a flash message
    req.flash('success', 'Form submitted successfully!');

    // Redirect to the cleanform route with flash message
    res.redirect('/cleantruck');
  } catch (error) {
    console.error('Error handling form submission:', error);
    req.flash('error', 'Internal Server Error');
    res.redirect('/cleantruck'); // Redirect to cleanform even on error
  }
});


function getSunday(d) {
  d = new Date(d);
  var day = d.getDay();
  var diff = d.getDate() - day; 
  return new Date(d.setDate(diff));
}

function getSaturday(d) {
  d = new Date(d);
  var day = d.getDay();
  var diff = d.getDate() + (6-day);
  return new Date(d.setDate(diff));
}

function dateOnly(d){
const originalDate = new Date(d); // Current date and time

const year = originalDate.getFullYear();
const month = originalDate.getMonth() + 1; // Note: Months are zero-indexed, so we add 1
const day = originalDate.getDate();

return (`${month}/${day}/${year}`);

}

function getCleaningList(endDay) {
  return new Promise((resolve, reject) => {
    let pastEndList = [];
    let nextWeekList = [];
    let completedList =[];

    // Initialize endDay here
    const endDayDate = new Date(endDay);
    const nextEndDate =dateOnly(new Date(endDayDate.getTime() + 7 * 24 * 60 * 60 * 1000));

    db.query(
      `SELECT truck_list.unit_number, truck_style.name AS style, cleaning_list.last_cleaned, cleaning_list.avail_start, cleaning_list.avail_end, cleaning_list.next_start, cleaning_list.next_end 
      FROM truck_list 
      JOIN truck_style ON truck_list.unit_style = truck_style.id 
      JOIN cleaning_list ON truck_list.unit_number = cleaning_list.unit_number
      WHERE cleaning_list.next_end <= $1
      OR cleaning_list.next_end <= $2
      ORDER BY truck_list.unit_number ASC;`,
      [endDayDate, nextEndDate], // 7 days in milliseconds for the next week
      (err, res) => {
        if (err) {
          console.error("Error executing query.", err.stack);
          reject(err);
        } else {
          res.rows.forEach(item => {
            item.last_cleaned = dateOnly(item.last_cleaned);
            item.next_start = dateOnly(item.next_start);
            item.next_end = dateOnly(item.next_end);

            // Check if the item is in the past or the next week
            if (new Date(item.next_end) <= endDayDate) {
              pastEndList.push(item);
            } else {
              nextWeekList.push(item);
            }
          });

          // Resolve with an array containing two lists
          resolve([pastEndList, nextWeekList]);
        }
      }
    );
  });
}

// ...

async function cleaningListUpdate(unit_number, date_cleaned) {
  const unitNumber = unit_number;
  const dateCleaned = date_cleaned;

  try {
    const result = await db.query(
      'SELECT next_start, next_end FROM cleaning_list WHERE unit_number = $1',
      [unitNumber]
    );

    const unitDates = result.rows[0];

    // Check if the dates are valid before updating
    if (unitDates.next_start instanceof Date && unitDates.next_end instanceof Date) {
      // Move forward 8 weeks
      unitDates.next_start.setDate(unitDates.next_start.getDate() + 8 * 7);
      unitDates.next_end.setDate(unitDates.next_end.getDate() + 8 * 7);

      // Set next_start to the next Sunday
      unitDates.next_start.setDate(unitDates.next_start.getDate() + (7 - unitDates.next_start.getDay()));

      // Set next_end to the next Saturday
      unitDates.next_end.setDate(unitDates.next_end.getDate() + (6 - unitDates.next_end.getDay()));

      const updateResult = await db.query(
        'UPDATE cleaning_list SET next_start=$1, next_end=$2, last_cleaned=$3 WHERE unit_number = $4',
        [unitDates.next_start, unitDates.next_end, dateCleaned, unitNumber]
      );

      return updateResult.rows;
    } else {
      console.error('Invalid dates retrieved from the database');
      throw new Error('Invalid dates');
    }
  } catch (error) {
    console.error('Error updating cleaning list data:', error);
    throw error;
  }
}

async function getUnitStyle(number) {
  const unitNumber = number;

  const result = await db.query("SELECT unit_style FROM truck_list WHERE unit_number = $1", [unitNumber]);

  // Assuming the result of the above query is an object with a property named 'unit_style'
  const unitStyleId = result.rows[0].unit_style;

  if (unitStyleId) {
    const styleResult = await db.query("SELECT name FROM truck_style WHERE id = $1", [unitStyleId]);

    return styleResult.rows[0].name;
  } else {
    console.error('Unit style ID not found');
    // Handle the case where the unit style ID is not found
  }
}

async function getCleaningStaff() {
  try {
    const result = await db.query('SELECT id, name FROM cleaning_staff');
    return result.rows;
  } catch (error) {
    console.error('Error fetching cleaning staff data:', error);
    throw error;
  }
}

async function getPendingTrucks() {
  try {
    const result = await db.query(`SELECT unit_number, date_cleaned, price, date_paid FROM cleaning_history
      WHERE date_paid IS NULL;`);

    const pendingTrucks = [];

    for (const row of result.rows) {
      const { unit_number, date_cleaned, price, date_paid } = row;
      const styleData = await getUnitStyle(unit_number); // Assuming getUnitStyle is an asynchronous function

      const truckData = {
        unit_number,
        date_cleaned,
        price,
        date_paid,
        style: styleData, // Assuming styleData is the returned data from getUnitStyle
      };

      pendingTrucks.push(truckData);
    }

    return pendingTrucks;
  } catch (error) {
    console.error('Error fetching pending truck data:', error);
    throw error;
  }
}



  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });