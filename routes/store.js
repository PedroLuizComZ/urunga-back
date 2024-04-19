var express = require("express");
var Store = require("../models/store");
var User = require("../models/user");
const transporter = require("../utils/transporter");

var router = express.Router();

router.get("/", function (req, res) {
  console.log("getting all stores");
  let filter = {
    active: true,
  };
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

router.get("/admin", function (req, res) {
  console.log("getting all stores to admin");
  Store.find({}).exec(function (err, stores) {
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
  }).exec(async function (err, store) {
    if (err) {
      res.send("error has occured");
    } else {
      const ids = store.rating.map((item) => item.userId);

      if (ids.length !== 0) {
        const listNames = await User.find(
          {
            _id: { $in: ids },
          },
          "name"
        );

        const storeWithName = JSON.parse(JSON.stringify(store));

        storeWithName.rating = storeWithName.rating.map((ratingItem) => {
          const user = listNames.find((u) => u._id == ratingItem.userId);
          console.log(user);
          if (user) {
            ratingItem.userName = user.name;
          }
          return ratingItem;
        });

        return res.json(storeWithName);
      }

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
      const mailOptions = {
        from: "app.urunga@gmail.com",
        to: "app.urunga@gmail.com",
        subject: "Urunga - Solicitação de restaurante",
        html: `<h1>Ola Vini</h1> 
        <p>Informo que um novo restaurante foi recentemente registrado em nosso sistema. No entanto, a aprovação para este restaurante está atualmente pendente e requer sua atenção.</p>

        <p>Detalhes do Restaurante:</p>
        <br/>
        <br/>
        
        </p>Nome: ${req.body.name}</p>
        </p>Contato: ${req.body.contactName}</p>
        </p>Telefone: ${req.body.contactPhone}</p>
        </p>Email: ${req.body.contactEmail}</p>
        <br/>

        O restaurante aguarda sua avaliação e aprovação antes de ser totalmente integrado ao sistema. Por favor, reserve um momento para revisar os detalhes fornecidos e tomar as medidas necessárias.</p>

        <a href='https://www.urunga.com.br/login'>Revisar Agora</a>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
      });
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

router.post("/rating/:id", function (req, res) {
  const { rating } = req.body;
  Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        rating,
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

router.post("/approval/:id", function (req, res) {
  Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    [
      {
        $set: {
          active: {
            $cond: {
              if: { $eq: ["$active", true] },
              then: false,
              else: true,
            },
          },
        },
      },
    ],
    function (err, rating) {
      console.log(err);

      if (err) {
        res.send("error updating rating");
      } else {
        console.log(rating);
        res.send(rating);
      }
    }
  );
});

module.exports = router;
