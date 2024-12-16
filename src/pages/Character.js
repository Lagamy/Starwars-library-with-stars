import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback} from 'react';
import { Background, Controls, ReactFlow, addEdge, useNodesState, useEdgesState, MiniMap} from "reactflow";
import { fetchDataRelatedToCharacter } from '../api/fetchAPI';
import { createNodeFromCharacter, createNodesFromFilms, createNodesFromStarships} from "../nodes/nodesMethods";
import { createEdgesFromOneToMany } from "../edges/edgesMethods";

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
  if(character != null) {
    fetchDataRelatedToCharacter(setFilms, setError, character.films)
    fetchDataRelatedToCharacter(setStarships, setError, character.starships)
    setLoading(false);
  }
}, [character]);


useEffect(() => {
  if(!loading) {
  let characterNode = createNodeFromCharacter(character);

  let filmNodes = createNodesFromFilms(characterNode, films);
  let filmEdges = createEdgesFromOneToMany(characterNode, filmNodes, characterNode.data.strokeColor, false);
  
  let starshipNodes = [];
  let starshipEdges = [];

  filmNodes.forEach(filmNode => {
    starshipNodes = createNodesFromStarships(characterNode, filmNode, starships);
    starshipEdges = createEdgesFromOneToMany(filmNode, starshipNodes, characterNode.data.strokeColor, true);
  });

  let allNodes = [characterNode, ...filmNodes, ...starshipNodes];
  let allEdges = [...filmEdges, ...starshipEdges];
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
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
    </ReactFlow>
  );
}