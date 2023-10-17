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
  let filter = {
    category: req.params.category,
  };
  if (req.query.city) {
    filter.city = req.query.city;
  }
  Store.find(filter).exec(function (err, store) {
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
  const newStore = new Store({
    ...req.body,
  });
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
    review,
    veggie,
    petFriendly,
    kids,
    accessibility,
    contactName,
    contactPhone,
    contactEmail,
    pix,
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
        review,
        veggie,
        petFriendly,
        kids,
        accessibility,
        contactName,
        contactPhone,
        contactEmail,
        pix,
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

router.put("/rating/:storeId", async function (req, res) {
  const { userId, commentary, ratingValue } = req.body;
  const storeResult = await Store.findOne({
    _id: req.params.storeId,
  });

  const index = storeResult.rating.findIndex((item) => item.userId === userId);
  let rating = storeResult.rating;

  if (index === -1) {
    rating.push({ userId, commentary, ratingValue });
  } else {
    rating[index] = { userId, commentary, ratingValue };
  }

  Store.findOneAndUpdate(
    {
      _id: req.params.storeId,
    },
    {
      $set: {
        rating,
      },
    },
    function (err, rating) {
      if (err) {
        res.send("error updating rating");
      } else {
        console.log(rating);
        res.send(rating);
      }
    }
  );

  console.log(storeResult);
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
