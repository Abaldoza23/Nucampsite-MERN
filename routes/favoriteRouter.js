const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.forEach((campsite) => {
          if (!favorite.campsites.includes(campsite._id)) {
            favorite.campsites.push(campsite._id);
          }
        });
        favorite
          .save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        Favorite.create({ user: req.user._id }).then((newFavorite) => {
          req.body.forEach((campsite) => {
            if (!newFavorite.campsites.includes(campsite._id)) {
              newFavorite.campsites.push(campsite._id);
            }
          });
          newFavorite.save().then((newFavorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(newFavorite);
          });
        });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Yo put operations not supported in route /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id }).then(
      (deletedFavorite) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(deletedFavorite);
      }
    );
  });

favoriteRouter
  .route("/:campsiteId")
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(
      "GET requests not supported in route /favorites/:campsiteId, try /favorites instead"
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (!favorite) {
        Favorite.create({ user: req.user._id }).then((newFavorite) => {
          newFavorite.campsites.push(req.params.campsiteId);
          newFavorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => {
              next(err);
            });
        });
      } else {
        favorite.campsites.push(req.params.campsiteId);
        favorite
          .save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => {
            next(err);
          });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT requests not supported on /favorites/:campsiteId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        const indexOfCampsiteIdWeWantToDelete = favorite.campsites.indexOf(
          req.params.campsiteId
        );
        if (indexOfCampsiteIdWeWantToDelete >= 0) {
          favorite.campsites.splice(indexOfCampsiteIdWeWantToDelete, 1);
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 403;
          res.setHeader("Content-Type", "text/plain");
          res.end("No favorite campsite to delete!");
        }
      }
    });
  });

module.exports = favoriteRouter;
