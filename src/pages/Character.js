import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback} from 'react';
import { Background, Controls, ReactFlow, addEdge, useNodesState, useEdgesState, MiniMap} from "reactflow";
import { fetchDataRelatedToCharacter } from '../api/fetchAPI';
import { createNodeFromCharacter, createNodesFromFilms, createNodesFromStarships} from "../nodes/nodesMethods";
import { createEdgesFromOneToMany } from "../edges/edgesMethods";
import Stars from '../custom/stars';

export default function Character() {

const { characterId } = useParams();
const [films, setFilms] = useState([]);   
const [starships, setStarships] = useState([]);  
const [character, setCharacter] = useState(null);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [nodes, setNodes, onNodesChange] = useNodesState([]);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);

useEffect(() => {
  async function fetchCharacter() {
    try {
      const response = await fetch(`https://swapi.info/api/people/${characterId}`);
      const data = await response.json();
      setCharacter(data);
    } catch (error) {
      setError('Error fetching character:', error);
    }
  }

  fetchCharacter();
}, [characterId]);


useEffect(() => {
  const fetchAllData = async () => {
    if (character != null) {
      try {
        await fetchDataRelatedToCharacter(setFilms, setError, character.films);
        await fetchDataRelatedToCharacter(setStarships, setError, character.starships);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false only after all async calls finish
      }
    }
  };

  fetchAllData();
}, [character]);


useEffect(() => {
  
  if(!loading) {
  let allNodes = [];

  let characterNode = createNodeFromCharacter(character);

  let filmNodes = [];
  console.log(films)
  films.forEach((film, index) => {
    filmNodes = [...filmNodes, createNodesFromFilms(characterNode, film, films.length, index)];
  });

  let filmEdges = createEdgesFromOneToMany(characterNode, filmNodes, false);
  
  allNodes = [characterNode, ...filmNodes];

  let starshipNodes = [];
  let starshipEdges = [];

  filmNodes.forEach(filmNode => {
    starshipNodes = createNodesFromStarships(filmNode, starships);
    starshipEdges = [...starshipEdges, ...createEdgesFromOneToMany(filmNode, starshipNodes, true)];
    allNodes = [...allNodes, ...starshipNodes];
  });

  let allEdges = [...filmEdges, ...starshipEdges];

  //console.log(allNodes);
  setNodes(allNodes);
  setEdges(allEdges);
  }
}, [loading]);

const onConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );


if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
    // <div></div>
    <div style={{ height: '100vh', width: '100vw'}}>
    <Stars Loading={loading} Class={"background-stars"} Size={2.5} paralaxSpeed={0.5} Weight={80} SetId={'1'} IgnoreScroll={true} ReactFlow={true}/> 
    <Stars Loading={loading} Class={"middleground-stars"} Size={3.5} paralaxSpeed={0.3}  Weight={80} SetId={'2'} IgnoreScroll={true} ReactFlow={true}/>
    <Stars Loading={loading} Class={"foreground-stars"} Size={5.5} paralaxSpeed={0.15} Weight={80} SetId={'3'} IgnoreScroll={true} ReactFlow={true}/>
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      panOnDrag={false}           // Prevent panning by dragging
      panOnScroll={false}         // Prevent panning by scrolling
      zoomOnScroll={false}        // Prevent zooming with scroll
      zoomOnPinch={false}         // Prevent zooming with pinch
      zoomOnDoubleClick={false}   // Prevent zooming with double-click
      fitView
    >
    </ReactFlow>
    </div>
  );
}