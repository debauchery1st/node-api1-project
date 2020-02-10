// implement your API here
const express = require("express");
const api = require("./data/db");
const server = express();
server.use(express.json());

const PORT = 5000;
// (C)reate
server.post("/api/users", (req, res) => {
  api
    .insert(req.body)
    .then(apiResult => res.status(201).json(apiResult))
    .catch(err => res.status(500).json({ message: err }));
});

// (R)equest
server.get("/api/users", (req, res) => {
  api
    .find()
    .then(users => res.status(200).json(users))
    .catch(errors => {
      console.log(errors);
      res.status(500).json({ error: errors });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  api
    .findById(id)
    .then(userWithID => res.status(200).json(userWithID))
    .catch(errors => res.status(500).json({ error: errors }));
});

server.get("/", (req, res) => {
  res.status(200).json({ message: "read the friendly manual" });
});

server.listen(PORT, () => console.log(`**API listening on port ${PORT}**`));
