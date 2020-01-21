const express = require("express");
const router = express.Router();
var EloRating = require("elo-rating");

// Celeb model
const Celeb = require("../../models/celebSchema");

// @route   GET api/celebs
// @desc    Get all celebs
// @acess   Public
router.get("/", (req, res) => {
  Celeb.find({}, (err, celebs) => {
    res.send(celebs);
  });
});

// @route   GET api/celebs/:id
// @desc    Get single celeb
// @acess   Public
router.get("/:id", (req, res) => {
  Celeb.findById(req.params.id, (err, celeb) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(celeb);
  });
});

// @route   POST api/celebs
// @desc    Create new celeb
// @acess   Public
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
    return res.status(400).json({ msg: "Please include a name and a pic url" });
  }

  // Save new celeb to database
  newCeleb.save((err, celeb) => {
    if (err) return res.status(500).send(err);
    res.send({
      msg: `${celeb.name} added to database with an id of ${celeb._id}.`
    });
  });
});

// @route   POST api/celebs/:id1/:id2
// @desc    2 celebs elo comparison and update
// @acess   Public
router.post("/:a/:b", async (req, res) => {
  // Check for identical ids
  if (req.params.a === req.params.b)
    return res.status(400).json({ msg: "Cannot compare celeb with themself" });

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
    msg: `${winner.name} (elo: ${result.playerRating}) is the winner and ${loser.name} (elo: ${result.opponentRating}) is the loser`
  });
});

module.exports = router;
