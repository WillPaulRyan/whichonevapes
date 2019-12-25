const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const celebSchema = require("./celebSchema.js");
const Celeb = mongoose.model("Celeb", celebSchema);
var EloRating = require("elo-rating");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
}

// MongoDB Atlas connection
mongoose.connect(
  `mongodb+srv://will:${process.env.DB_PASS}@will-h7azy.mongodb.net/whichonevapes?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("MongoDB connected...");
  // Get all celebs
  router.get("/", (req, res) => {
    Celeb.find({}, (err, celebs) => {
      res.send(celebs);
    });
  });

  // Get single celeb
  router.get("/:id", (req, res) => {
    Celeb.findById(req.params.id, (err, celeb) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(celeb);
    });
  });

  // Create celeb
  router.post("/", async (req, res) => {
    // Check if name already in database
    if (await Celeb.find({ name: req.body.name }).countDocuments())
      return res.status(400).json({
        msg: `Celebrity with name ${req.body.name} already in database!`
      });

    // Find highst id in database
    const latest = await Celeb.findOne({})
      .sort({ _id: -1 })
      .exec()
      .catch(err => {
        return res.status(500).send(err);
      });

    // Create new celeb, with id +1 of previous highest
    const newCeleb = new Celeb({
      _id: latest._id + 1,
      name: req.body.name,
      pic: req.body.pic
    });

    if (!newCeleb.name || !newCeleb.pic) {
      return res
        .status(400)
        .json({ msg: "Please include a name and a pic url" });
    }

    // Save new celeb to database
    newCeleb.save((err, celeb) => {
      if (err) return res.status(500).send(err);
      res.send({
        msg: `${celeb.name} added to database with an id of ${celeb._id}.`
      });
    });
  });

  // Elo functionality
  router.post("/:a/:b", async (req, res) => {
    // Get relevant celebs
    let winner = await Celeb.findById(req.params.a, (err, celeb) => {
      if (err) return res.status(500).send(err);
    });
    let loser = await Celeb.findById(req.params.b, (err, celeb) => {
      if (err) return res.status(500).send(err);
    });

    result = EloRating.calculate(winner.elo, loser.elo);

    // Update winner elo
    Celeb.updateOne(
      { _id: winner._id },
      { $set: { elo: result.playerRating } }
    ).catch(err => {
      return res.status(500).send(err);
    });

    // Update loser elo
    Celeb.updateOne(
      { _id: loser._id },
      { $set: { elo: result.opponentRating } }
    ).catch(err => {
      return res.status(500).send(err);
    });

    res.send({
      msg: `${winner.name}:${result.playerRating} is the winner and ${loser.name}:${result.opponentRating} is the loser`
    });
  });
}).on("error", function(err) {
  console.log(err);
});

module.exports = router;
