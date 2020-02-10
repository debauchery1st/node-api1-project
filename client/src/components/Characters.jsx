import React, { useEffect, useState } from "react";
import axios from "axios";

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then(res => setCharacters(res.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <>
      <h1>peeps</h1>
      <ul>
        {characters.map(person => (
          <li key={person.id}>
            {person.name} : {person.bio}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Characters;
