var express = require("express");
var User = require("../models/user");
const { celebrate, Segments } = require("celebrate");
const validation = require("../validations/user");
const generateAccessToken = require("../utils/generateAccessToken");

var router = express.Router();

router.get("/", function (req, res) {
  console.log("getting all users");
  User.find({}).exec(function (err, users) {
    if (err) {
      res.send("error has occured");
    } else {
      console.log(users);
      res.json(users);
    }
  });
});

router.get("/:id", function (req, res) {
  console.log("getting one user");
  User.findOne({
    _id: req.params.id,
  }).exec(function (err, user) {
    if (err) {
      res.send("error has occured");
    } else {
      console.log(user);
      const token = res.json(user);
    }
  });
});

router.post(
  "/login",
  celebrate({ [Segments.BODY]: validation.loginSchema }),
  function (req, res) {
    User.findOne({
      email: req.body.email,
      password: req.body.password,
    }).exec(function (err, user) {
      if (err) {
        res.send("error has occured");
      } else {
        if (!user) {
          return res
            .status(401)
            .send({ status: "error", message: "User not found" });
        }
        const token = generateAccessToken(user);
        res.send({ sessionToken: token, status: "success" });
      }
    });
  }
);

router.post("/", function (req, res) {
  var newUser = new User();
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  newUser.save(function (err, user) {
    if (err) {
      res.send("error saving user");
    } else {
      console.log(user);
      res.send(user);
    }
  });
});

router.post(
  "/client",
  celebrate({ [Segments.BODY]: validation.createUserSchema }),
  function (req, res) {
    var newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.city = req.body.city;
    newUser.type = req.body.type;

    newUser.save((err, user) => {
      if (err) {
        res.send("error saving user");
      } else {
        const token = generateAccessToken(user);
        res.send({ sessionToken: token });
      }
    });
  }
);

router.put("/:id", function (req, res) {
  User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
      },
    },
    {
      upsert: true,
    },
    function (err, newUser) {
      if (err) {
        res.send("error updating user");
      } else {
        console.log(newUser);
        res.send(newUser);
      }
    }
  );
});

router.delete("/:id", function (req, res) {
  User.findByIdAndRemove(
    {
      _id: req.params.id,
    },
    function (err, user) {
      if (err) {
        res.send("error deleting user");
      } else {
        console.log(user);
        res.send(user);
      }
    }
  );
});

router.post("/webhook", async function (req, res) {
  if (req.body.type === "checkout.session.completed") {
    const email = req.body.data.object.customer_email

    await User.updateOne(
      { email },
      { checkoutSessionId: req.body.data.object.id }
    );
    res.send("Handle webhook");
  } else {
    res.send("error saving checkoutSessionId");
  }
});

module.exports = router;
