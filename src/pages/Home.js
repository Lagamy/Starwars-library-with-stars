import { Background, Controls, ReactFlow, addEdge, useNodesState, useEdgesState, MiniMap} from "reactflow";
import React, { useState, useEffect, useCallback} from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stars from "../custom/stars";
import { fetchAPI } from "../api/fetchAPI";
import Character from "../pages/Character";
import "reactflow/dist/style.css";
import { Link } from 'react-router-dom';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // Function to fetch all data at once
 const fetchCharacters = async () => {
  try {
    setLoading(true); // Start loading
    await fetchAPI('https://swapi.info/api/people', setCharacters, setError);
    setLoading(false); // Set loading to false once all data is fetched
  } catch (err) {
    setError(err);
    setLoading(false);
  }
};

useEffect(() => {
  fetchCharacters();

  function handleResize() {
    setBackgroundSize();
  }
  window.addEventListener('resize', handleResize)

  // Clean up on component unmount
  return () => { 
    window.removeEventListener('resize', handleResize);
  }
}, []); 

// After 
useEffect( () => {
    if(!loading) setBackgroundSize();
}, [loading]);

function setBackgroundSize() {
  const background = document.querySelector('.background-container');
  background.style.setProperty('--pageHeight', '0px'); // Reset first
  background.style.setProperty('--pageHeight', `${document.body.scrollHeight}px`);
}

function slugifyWithAccents(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
<div><h1 className="logo">Star Wars</h1>
{/* Weight - chance for star to spawn per pixel */}
<div Class={"background-container"}> 
  <Stars Loading={loading} Class={"background-stars"} Size={2.5} paralaxSpeed={0.5} Weight={90} SetId={'1'} IgnoreScroll={false} ReactFlow={false}/> 
  <Stars Loading={loading} Class={"middleground-stars"} Size={3.5} paralaxSpeed={0.3}  Weight={90} SetId={'2'} IgnoreScroll={false} ReactFlow={false}/>
  <Stars Loading={loading} Class={"foreground-stars"} Size={5.5} paralaxSpeed={0.15} Weight={90} SetId={'3'} IgnoreScroll={false} ReactFlow={false}/>
</div>
<div className="cards">
  {characters.map((character, index) => (
    <Link to={{ pathname: `/${index + 1}`,}}>
    <Card key={index + 1}>
      <div className="Character-img" style={{ backgroundImage: `url('assets/characters/${index + 1}.jpg')` }}/>
      {/* <Card.Img variant="top" src={`https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`} alt={character.name} /> */}
      <Card.Body>
        <Card.Title>{character.name}</Card.Title>
        <Card.Text>
        </Card.Text>
      </Card.Body>
    </Card>
    </Link>
  ))}
</div>
</div>
 );
}