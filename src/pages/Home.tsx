import React, { useState, useEffect, useCallback} from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stars from "../custom/stars";
import { fetchCharactersFromAPI } from "../api/fetchAPI";
import "reactflow/dist/style.css";
import { useNavigate } from 'react-router-dom';
import { CharacterType } from "../types";



export default function Home() {

  const [characters, setCharacters] = useState<CharacterType[]>([]); // Add type annotation
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 // Function to fetch all data at once
 const fetchCharacters = async () => {
  try {
    setLoading(true); // Start loading
    await fetchCharactersFromAPI('https://swapi.info/api/people', setCharacters, setError);
  } catch (error) {
    console.error("Error fetching data: ", error);
  } finally {
    setLoading(false);// Set loading to false once all data is fetched / failed to fetch
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
  const background = document.querySelector('.background-container') as HTMLElement;
  background.style.setProperty('--pageHeight', '0px'); // Reset first
  background.style.setProperty('--pageHeight', `${document.body.scrollHeight}px`);
}

function slugifyWithAccents(name: string){
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


function extractIdFromUrl(url: string) {
  // Regex to extract the number from the URL
  const match = url.match(/\/(\d+)(\.|$)/);
  if (match) {
      return match[1]; // Convert the matched string to an integer.[1] - gave me first matched group. 10 - converts  string to decimal(so if it returns 014 for some reason)
  }
  return null; // Return null if no number is found
}
const navigate = useNavigate();

const handleNavigate = (characterData: CharacterType) => (event: React.MouseEvent<HTMLButtonElement>) => { // Higher order function(function that returns another function), I use it to pass  argument to an event handler
  navigate(`${extractIdFromUrl(characterData.url)}`, { state: { character: characterData } });
};

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
<div><h1 className="logo">Star Wars</h1>
{/* Weight - chance for star to spawn per pixel */}
<div className="background-container">
  <Stars Class={"background-stars"} Size={2.5} paralaxSpeed={0.5} Weight={90} Id={'1'} IgnoreScroll={false} ReactFlow={false}/> 
  <Stars Class={"middleground-stars"} Size={3.5} paralaxSpeed={0.3}  Weight={90} Id={'2'} IgnoreScroll={false} ReactFlow={false}/>
  <Stars Class={"foreground-stars"} Size={5.5} paralaxSpeed={0.15} Weight={90} Id={'3'} IgnoreScroll={false} ReactFlow={false}/>
</div>
<div className="cards">
  {characters.map((characterData, index) => (
    
    <button onClick={handleNavigate(characterData)} style={{background: "none", border: "none"}}>
    <Card key={index + 1}>
      <div className="Character-img" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/characters/${index + 1}.jpg')` }}/>
      {/* <Card.Img variant="top" src={`https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`} alt={character.name} /> */}
      <Card.Body>
        <Card.Title>{characterData.name}</Card.Title>
        <Card.Text>
        </Card.Text>
      </Card.Body>
    </Card>
    </button>
  ))}
</div>
</div>
 );
}