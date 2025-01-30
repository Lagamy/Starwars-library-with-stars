import { useLocation  } from 'react-router-dom';
import React, { useState, useEffect, useCallback} from 'react';
import { Node, Edge, Connection, ReactFlow, addEdge, useNodesState, useEdgesState} from "reactflow";
import { fetchFilmsRelatedToCharacter, fetchStarshipsRelatedToCharacter } from '../api/fetchAPI';
import { createNodeFromCharacter, createNodeFromFilms, createNodesFromStarships} from "../nodes/nodesMethods";
import { createEdgesFromOneToMany } from "../edges/edgesMethods";
import {CharacterType, StarshipType, FilmType} from "../types";
import Stars from '../custom/stars';

export default function Character() {

const location = useLocation();
const { character } = location.state as { character: CharacterType };
const [films, setFilms] = useState<FilmType[]>([]);
const [starships, setStarships] = useState<StarshipType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] =  useState<string | null>(null);
const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

useEffect(() => {
  const fetchAllData = async () => {
    if (character != null) {
      try {
        await fetchFilmsRelatedToCharacter(setFilms, setError, character.films);
        await fetchStarshipsRelatedToCharacter(setStarships, setError, character.starships);
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
  let allNodes: Node[];

  let characterNode = createNodeFromCharacter(character);

  let filmNodes: Node[] = [];
  console.log(films)
  films.forEach((film, index) => {
    filmNodes = [...filmNodes, createNodeFromFilms(characterNode, film, films.length, index)];
  });

  let filmEdges = createEdgesFromOneToMany(characterNode, filmNodes, false);
  
  allNodes = [characterNode, ...filmNodes];

  let starshipNodes: Node[] = [];
  let starshipEdges: Edge[] = [];

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
    (connection: Connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );


if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

return (
    // <div></div>
    <div style={{ height: '100vh', width: '100vw'}}>
    <Stars Class={"background-stars"} Size={2.5} paralaxSpeed={0.5} Weight={80} Id={'1'} IgnoreScroll={true} ReactFlow={true}/> 
    <Stars Class={"middleground-stars"} Size={3.5} paralaxSpeed={0.3}  Weight={80} Id={'2'} IgnoreScroll={true} ReactFlow={true}/>
    <Stars Class={"foreground-stars"} Size={5.5} paralaxSpeed={0.15} Weight={80} Id={'3'} IgnoreScroll={true} ReactFlow={true}/>
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