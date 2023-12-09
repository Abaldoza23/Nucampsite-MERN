const express = require("express");
const PromotionsRouter = express.Router();

const Promotions = require("../models/promotions");

PromotionsRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end("Will send all promotions to you");
    Promotions.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .post((req, res) => {
    // res.end(
    //   //   "Will add promotions: " + req.body.name + "with description" + req.body.description
    //   `Will create promotions: ${req.body.name} with description ${req.body.description}`
    // );
    Promotions.create(req.body)
    //   name: req.body.name,
    //   image: req.body.image,
    //   description: req.body.description,
    //   featured: req.body.featured,
    // })
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT request not supported on /promotions");
  })
  .delete((req, res) => {
    // res.end("Will eventually delete all promotions");
    Promotions.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => console.log(e));
      });

PromotionsRouter
  .route("/:promotionsId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end(`Will send details of the promotions: ${req.params.promotionsId} to you`);
    Promotions.findById(req.params.promotionsId)
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => console.log(e));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionsId}`
    );
  })
  .put((req, res) => {
    // res.write(`Updating the promotions: ${req.params.promotionsId}\n`);
    // res.end(`Will update the promotions: ${req.body.name}
    // with description: ${req.body.description}`);
    Promotions.findByIdAndUpdate(
      req.params.promotionsId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => console.log(e));
  })
  .delete((req, res) => {
    // res.end(`Deleting promotions: ${req.params.promotionsId}`);
    Promotions.findByIdAndDelete(req.params.promotionsId)
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => console.log(e));
  });

// Test: Use Postman to test each of your newly created endpoints and verify that you receive the expected responses.
// Test GET/POST/PUT/DELETE requests to: localhost:3000/promotions/1
// You do not have to use /1. You could just as well use /23, or /foo, or any other string in its place.
// For the PUT request, make sure to send a JSON string in the body of the request with a name and description, the same way you did in the exercises.

module.exports = PromotionsRouter;
