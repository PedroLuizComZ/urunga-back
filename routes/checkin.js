const express = require("express");
const Checkin = require("../models/checkin");
const User = require("../models/user");

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
        if (checkin.length === 0) {
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

router.get("/dashboard/:id", async function (req, res) {
  console.log("Dashboard by storeId");

  const now = new Date();
  const startOfLastMonth = new Date();

  startOfLastMonth.setMonth(now.getMonth() - 1);
  startOfLastMonth.setDate(1);
  startOfLastMonth.setHours(0, 0, 0, 0);

  let payload = {};

  await Checkin.find({
    storeId: req.params.id,
    checkinAt: {
      $gte: startOfLastMonth,
      $lt: now,
    },
  }).exec(async function (err, checkin) {
    if (err) {
      console.error("Erro ao buscar dados:", err);
      res.status(500).send("error has occured");
    } else {
      let firstPeriod = 0;
      let secondPeriod = 0;
      let thirdPeriod = 0;

      checkin.forEach((item) => {
        const date = new Date(item.checkinAt);
        if (date.getDate() <= 10) {
          firstPeriod = firstPeriod + 1;
        } else if (date.getDate() <= 20) {
          secondPeriod = secondPeriod + 1;
        } else {
          thirdPeriod = thirdPeriod + 1;
        }
      });

      payload.checkinLine = [firstPeriod, secondPeriod, thirdPeriod];
    }
  });

  await Checkin.find({
    storeId: req.params.id,
  }).exec(async function (err, checkin) {
    if (err) {
      console.error("Erro ao buscar dados:", err);
      res.status(500).send("error has occured");
    } else {
      const ids = checkin.map((item) => item.userId);

      const listNames = await User.find(
        {
          _id: { $in: ids },
        },
        "gender birthdate"
      );

      payload.dataLine = countUsersByGender(listNames);
      payload.pieData = countUsersByAgeBracket(listNames);
      return res.send(payload);
    }
  });

});

const countUsersByGender = (users) => {
  return users.reduce((acc, user) => {
    if (acc[user.gender]) {
      acc[user.gender]++;
    } else {
      acc[user.gender] = 1;
    }
    return acc;
  }, {});
};

const getAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const determineAgeBracket = (age) => {
  if (age < 20) return "<20";
  if (age >= 20 && age < 30) return "20-29";
  if (age >= 30 && age < 40) return "30-39";
  if (age >= 40 && age < 50) return "40-49";
  if (age >= 50 && age < 60) return "50-59";
  return "60+";
};

const countUsersByAgeBracket = (users) => {
  return users.reduce((acc, user) => {
    const age = getAge(user.birthdate);
    const bracket = determineAgeBracket(age);
    if (acc[bracket]) {
      acc[bracket]++;
    } else {
      acc[bracket] = 1;
    }
    return acc;
  }, {});
};

module.exports = router;
