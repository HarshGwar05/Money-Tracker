var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// For local MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/MoneyList')
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((error) => {
        console.error("Error connecting to the Database", error);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection error:"));

// Route to add data
app.post("/add", (req, res) => {
    var category = req.body.Category; // Matches the request body data
    var amount = req.body.Amount; // Matches the request body data
    var info = req.body.Info; // Matches the request body data
    var date = req.body.Date; // Matches the request body data

    var data = {
        "Category": category,
        "Amount": amount,
        "Info": info,
        "Date": date
    };

    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            return res.status(500).send(err);
        }
        console.log("Record Inserted Successfully");
        res.status(200).send("Record Inserted Successfully");
    });
});

// Route to fetch data
app.get("/fetch", (req, res) => {
    db.collection('users').find().toArray((err, result) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).send(err);
        }
        res.json(result); // Send the fetched data as a JSON response
    });
});

// Default route
app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
}).listen(5000);

console.log("Listening on port 5000");
