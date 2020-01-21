const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get DB password
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

// Connect to Mongo
mongoose
  .connect(
    `mongodb+srv://will:${process.env.DB_PASS}@will-h7azy.mongodb.net/whichonevapes?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// Use routes
app.use("/api/celebs", require("./routes/api/celebs"));

// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
