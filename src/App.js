import { useCallback } from "react";
import React, { useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stars from "./custom/stars";
import { fetchAPI } from "./api/fetchAPI";


export default function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // Function to fetch all data at once
 const fetchCharacters = async () => {
  try {
    setLoading(true); // Start loading
    await fetchAPI('https://sw-api.starnavi.io/people', setCharacters, setError);
    setLoading(false); // Set loading to false once all data is fetched
  } catch (err) {
    setError(err);
    setLoading(false);
  }
};

useEffect(() => {
  fetchCharacters();
}, []); 

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
<div><h1 className="logo">Starnavi</h1>
{/* Weight - chance for star to spawn per pixel */}
<Stars Loading={loading} Class={"background-stars"} Size={2.5} paralaxSpeed={0.6} Weight={0.00033}/> 
<Stars Loading={loading} Class={"middleground-stars"} Size={3.5} paralaxSpeed={0.3}  Weight={0.00055}/>
<Stars Loading={loading} Class={"foreground-stars"} Size={5} paralaxSpeed={0} Weight={0.00025}/>
<div className="cards">
  {characters.map(character => (
    <Card key={character.id}>
      <div className="Character-img" style={{backgroundImage: `url(https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg)`}}/>

      {/* <Card.Img variant="top" src={`https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`} alt={character.name} /> */}
      <Card.Body>
        <Card.Title>{character.name}</Card.Title>
        <Card.Text>
        </Card.Text>
      </Card.Body>
    </Card>
  ))}
</div>
</div>
 );
}
