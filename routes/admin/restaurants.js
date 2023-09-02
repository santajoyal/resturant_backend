var express = require("express");
const { closeConnection, connectDb } = require("../../config");
const { authenticate } = require("../../lib/authorize");
const mongodb =require("mongodb")
var router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const db = await connectDb();
    let restaurants = await db.collection("restaurants").find().toArray();
    await closeConnection();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/create", authenticate, async function (req, res, next) {
  try {
    const db = await connectDb();
    await db.collection("restaurants").insertOne(req.body);
    res.json({ message: "Restaurant created successfully" });
    await closeConnection();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// create Dishes
router.post("/dish/:rId", authenticate, async function (req, res, next) {
  try {
    const db = await connectDb();
    // const restaurant = await db.collection("restaurants").findOne({_id:mongodb.ObjectId(req.params.rId)});
    // if(restaurant){
    //    console.log(restaurant)
    // }
    await db
      .collection("dishes")
      .insertOne({ rId:mongodb.ObjectId(req.params.rId), ...req.body});
    res.json({ message: "Dish Added successfully" });
    await closeConnection();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Get Dishes
router.get("/dish/:rId", authenticate, async function (req, res, next) {
  try {
    const db = await connectDb();
    // const restaurant = await db.collection("restaurants").findOne({_id:mongodb.ObjectId(req.params.rId)});
    // if(restaurant){
    //    console.log(restaurant)
    // }
    let dishes = await db
      .collection("dishes")
      .find({ rId:mongodb.ObjectId(req.params.rId)}).toArray();
    res.json(dishes);
    await closeConnection();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
