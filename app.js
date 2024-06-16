// const express = require("express");
// const path = require("path");
// // const fs = require("fs");
// var mongoose = require('mongoose');
// ongoose.connect('mongodb://localhost:27017/ContactDance', {useNewUrlParser: true, useUnifiedTopology: true});
// const app = express();
// const port = 80;


// //define  mongoose Schema
// const contactSchema = new mongoose.Schema({
//   name: String,
//   phne: number,
//   email: String,
//   address: String,
//   description: String,
// });

// const Contact = mongoose.model('Contact', contactSchema);


// // app.use(express.static('static',options))
// // Express Specific Stuff
// app.use('/static', express.static('static'))
// app.use(express.urlencoded())

// //pug specific stuff
// app.set('view engine', 'pug') //set the template engine as pug
// app.set('views',path.join(__dirname,'views')) //set the views directory

// //ENDPOINTS
// app.get('/', (req,res) => {
//     // const con = "This is the best content on the internet so far so  use it wisely"
//     const params = { }
//     res.status(200).render('index.pug',params);
// })
// app.get('/contact', (req,res) => {
//     const params = { }
//     res.status(200).render('contact.pug',params);
// })

// app.post('/contact', (req,res) => {
//     const params = { }
//     res.status(200).render('contact.pug',params);
// })

// //START THE SERVER
// app.listen(port, () =>{
//     console.log(`THe Application Started Successfully on the port ${port}`);
// });
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Import body-parser

const app = express();
const port = 8000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dharaDanceAcademy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// Define Mongoose schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
});
const Contact = mongoose.model('Contact', contactSchema);

// Express Specific Stuff
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser middleware
app.use(bodyParser.json()); // For parsing application/json

// Pug Specific Stuff
app.set('view engine', 'pug'); // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Endpoints
app.get('/', (req, res) => {
  const params = {};
  res.status(200).render('index.pug', params);
});

app.get('/contact', (req, res) => {
  const params = {};
  res.status(200).render('contact.pug', params);
});

// app.post('/contact', (req, res) => {
//   const { name, phone, email, address, description } = req.body;

//   // Basic validation
//   if (!name || !phone || !email || !address || !description) {
//     return res.status(400).send("All fields are required");
//   }

//   const myData = new Contact(req.body);
//   myData.save()
//     .then(() => res.send("This item has been saved to the database"))
//     .catch(err => {
//       console.error('Error saving to database:', err);
//       res.status(500).send("Item was not saved to the database");
//     });
// });

app.post('/contact', (req, res) => {
  console.log('Received data:', req.body);
  const { name, phone, email, address, description } = req.body;

  if (!name || !phone || !email || !address || !description) {
    return res.status(400).send("All fields are required");
  }

  const myData = new Contact(req.body);
  myData.save()
    .then(() => res.send("This item has been saved to the database"))
    .catch(err => {
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        console.error('Validation error:', messages);
        return res.status(400).send("Validation Error: " + messages.join(', '));
      }
      console.error('Error saving to database:', err);
      res.status(500).send("Item was not saved to the database");
    });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Server
app.listen(port, () => {
  console.log(`The Application Started Successfully on port ${port}`);
});
