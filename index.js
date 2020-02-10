// implement your API here
const express = require("express");
const api = require("./data/db");
const server = express();
server.use(express.json());

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
        : res
            .status(500)
            .json({
              errorMessage: "The user information could not be retrieved."
            });
    })
    .catch(() =>
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." })
    );
});

server.get("/", (req, res) => {
  res.status(200).json({ message: "read the friendly manual" });
});

// (U)pdate
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  api
    .update(id, req.body)
    .then(apiResult => res.status(200).json(apiResult))
    .catch(err => res.status(204).json({ message: err }));
});

// (D)elete
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  api
    .remove(id)
    .then(recordsRemoved => res.status(200).json(recordsRemoved))
    .catch(err => res.status(204).json({ messgage: err }));
});

server.listen(PORT, () => console.log(`**API listening on port ${PORT}**`));
