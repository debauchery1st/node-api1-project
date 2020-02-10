// implement your API here
const express = require("express");
const cors = require("cors");
const api = require("./data/db");
const server = express();
server.use(express.json());
server.use(cors());

const PORT = 5000;
// (C)reate
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  !name || !bio
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." })
    : api
        .insert({ name, bio })
        .then(apiResult =>
          api
            .findById(apiResult.id)
            .then(userDocument => res.status(201).json(userDocument))
        )
        .catch(err =>
          res.status(500).json({
            errorMessage:
              "There was an error while saving the user to the database"
          })
        );
});

// (R)equest
server.get("/api/users", (req, res) => {
  api
    .find()
    .then(users => res.status(200).json(users))
    .catch(() =>
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      })
    );
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  api
    .findById(id)
    .then(userWithID => {
      userWithID
        ? res.status(200).json(userWithID)
        : res.status(500).json({
            errorMessage: "The user with the specified ID does not exist."
          });
    })
    .catch(() =>
      res
        .status(404)
        .json({ message: "The user information could not be retrieved." })
    );
});

server.get("/", (req, res) => {
  res.status(200).json({ message: "read the friendly manual" });
});

// (U)pdate
server.put("/api/users/:id", (req, res) => {
  const { newName, newBio } = req.body; // required
  if (newName && newBio) {
    const { id } = req.params;
    // find record with ID
    api.findById(id).then(userWithID => {
      if (userWithID.id) {
        // yes we have a record for this id; Update it.
        api
          .update(id, req.body)
          .then(apiResult => {
            // why return the updated record ?
            // the user has this information already.
            apiResult > 0
              ? api.findById(id).then(finalResult => {
                  // nevertheless...
                  res.status(200).json(finalResult);
                })
              : res.status(500).json({});
          })
          .catch(() =>
            res.status(500).json({
              errorMessage: "The user information could not be modified."
            })
          );
      } else {
        // no, we don't have a record with that ID
        res
          .status(400)
          .json({ message: "The user with the specified ID does not exist." });
      }
    });
  } else
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
});

// (D)elete
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  api.findById(id).then(userWithID => {
    userWithID
      ? api
          .remove(id)
          .then(
            cnt =>
              cnt > 0
                ? res.status(200).json(cnt)
                : res.status(500).json({ errorMessage: `${cnt} items deleted` }) // a rare case
          )
          .catch(() =>
            res
              .status(500)
              .json({ errorMessage: "The user could not be removed" })
          )
      : res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
  });
});

server.listen(PORT, () => console.log(`**API listening on port ${PORT}**`));
