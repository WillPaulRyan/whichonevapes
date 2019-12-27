const express = require("express");
const mongoose = require("mongoose");

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

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
