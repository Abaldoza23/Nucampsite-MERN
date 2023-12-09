const express = require("express");
const partnerRouter = express.Router();

const Partner = require("../models/partner");

partnerRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end("Will send all partners to you");
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .post((req, res) => {
    // res.end(
    //   //   "Will add partner: " + req.body.name + "with description" + req.body.description
    //   `Will create partner: ${req.body.name} with description ${req.body.description}`
    // );
    Partner.create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      featured: req.body.featured,
    })
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT request not supported on /partners");
  })
  .delete((req, res) => {
    // res.end("Will eventually delete all partners");
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => {
        console.log(e);
      });
  });

partnerRouter
  .route("/:partnerId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => console.log(e));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`
    );
  })
  .put((req, res) => {
    // res.write(`Updating the partner: ${req.params.partnerId}\n`);
    // res.end(`Will update the partner: ${req.body.name}
    // with description: ${req.body.description}`);
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => console.log(e));
  })
  .delete((req, res) => {
    // res.end(`Deleting partner: ${req.params.partnerId}`);
    Partner.findByIdAndDelete(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => console.log(e));
  });

module.exports = partnerRouter;
