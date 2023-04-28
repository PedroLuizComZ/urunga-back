var express = require("express");
var Store = require("../models/store");
var router = express.Router();

router.get("/", function (req, res) {
  console.log("getting all stores");
  let filter = {};
  if (req.query.city) {
    filter.city = req.query.city;
  }
  Store.find(filter).exec(function (err, stores) {
    if (err) {
      res.send("error has occured");
    } else {
      console.log(stores);
      res.json(stores);
    }
  });
});

router.get("/:id", function (req, res) {
  Store.findOne({
    _id: req.params.id,
  }).exec(function (err, store) {
    if (err) {
      res.send("error has occured");
    } else {
      console.log(store);
      res.json(store);
    }
  });
});

router.get("/list-by-category/:category", function (req, res) {
  Store.find({
    category: req.params.category,
  }).exec(function (err, store) {
    if (err) {
      res.send("error has occured");
    } else {
      res.json(store);
    }
  });
});

router.get("/list-by-email/:email", function (req, res) {
  Store.find({
    email: req.params.email,
  }).exec(function (err, store) {
    if (err) {
      res.send("error has occured");
    } else {
      res.json(store);
    }
  });
});

router.post("/list", function (req, res) {
  Store.find({
    email: req.body.email,
  }).exec(function (err, store) {
    if (err) {
      res.send("error has occured");
    } else {
      res.json(store);
    }
  });
});

router.post("/", function (req, res) {
  const {
    name,
    logo,
    description,
    email,
    promotions,
    category,
    city,
    google,
    instagram,
  } = req.body;
  var newStore = new Store();
  newStore.name = name;
  newStore.logo = logo;
  newStore.description = description;
  newStore.instagram = instagram;
  newStore.google = google;
  newStore.email = email;
  newStore.promotions = promotions;
  newStore.category = category;
  newStore.city = city;
  newStore.save(function (err, store) {
    if (err) {
      res.send("error saving store");
    } else {
      console.log(store);
      res.send(store);
    }
  });
});

router.put("/:id", function (req, res) {
  const {
    name,
    logo,
    description,
    promotions,
    category,
    city,
    google,
    instagram,
  } = req.body;
  Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        name,
        logo,
        description,
        promotions,
        city,
        category,
        google,
        instagram,
      },
    },
    {
      upsert: true,
    },
    function (err, newStore) {
      if (err) {
        res.send("error updating store");
      } else {
        console.log(newStore);
        res.send(newStore);
      }
    }
  );
});

router.delete("/:id", function (req, res) {
  Store.findByIdAndRemove(
    {
      _id: req.params.id,
    },
    function (err, store) {
      if (err) {
        res.send("error deleting store");
      } else {
        console.log(store);
        res.send(store);
      }
    }
  );
});

module.exports = router;
