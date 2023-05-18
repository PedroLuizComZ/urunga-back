const express = require("express");
const Checkin = require("../models/checkin");
const { celebrate, Segments } = require("celebrate");
const validation = require("../validations/checkin");
const router = express.Router();

router.post(
  "/",
  celebrate({ [Segments.BODY]: validation.checkinSchema }),
  function (req, res) {
    const newCheckin = new Checkin();
    newCheckin.userId = req.body.userId;
    newCheckin.storeId = req.body.storeId;
    newCheckin.promotionId = req.body.promotionId;
    newCheckin.save(function (err, checkin) {
      if (err) {
        res.send("error saving checkin");
      } else {
        console.log(checkin);
        res.send(checkin);
      }
    });
  }
);

router.get("/:id", function (req, res) {
  console.log("getting one user");

  const storeId = req.query.storeId;

  Checkin.find({
    userId: req.params.id,
    storeId: storeId,
  })
    .sort({ checkinAt: -1 })
    .exec(function (err, checkin) {
      if (err) {
        console.error("Erro ao buscar check-ins:", err);
        res.status(500).send("error has occured");
      } else {
        if(checkin.length === 0) {
          return res.send({ status: "success" });
        } 
        const today = new Date();
        const oneWeekAgo = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        const dateToCheck = new Date(checkin[0].checkinAt);
        // Compare the two dates
        if (dateToCheck.getTime() < oneWeekAgo.getTime()) {
          return res.send({ status: "success" });
        } else {
          return res.send({ status: "error" });
        }
      }
    });
});

module.exports = router;
