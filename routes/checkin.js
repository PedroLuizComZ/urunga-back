var express = require("express");
var Checkin = require("../models/checkin");
const { celebrate, Segments } = require("celebrate");
const validation = require("../validations/checkin");
var router = express.Router();

router.post(
  "/",
  celebrate({ [Segments.BODY]: validation.checkinSchema }),
  function (req, res) {
    var newCheckin = new Checkin();
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

module.exports = router;
