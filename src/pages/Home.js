import { useCallback } from "react";
import { Background, Controls, ReactFlow, addEdge, useNodesState, useEdgesState, MiniMap} from "reactflow";
import React, { useState, useEffect} from 'react';

import "reactflow/dist/style.css";
import { fetchAPI } from "./api/fetchAPI";
import {createGroupNodes, createNodesFromFilms, createNodesFromStarships} from "../nodes/nodesMethods";
import { createEdgesFromOneToMany } from "./edges/edgesMethods";

function Home() {
  const [characters, setCharacters] = useState([]);
  const [films, setFilms] = useState([]);   
  const [starships, setStarships] = useState([]);  
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // Function to fetch all data at once
 const fetchAllData = async () => {
  try {
    setLoading(true); // Start loading
    await fetchAPI('https://sw-api.starnavi.io/people', setCharacters, setError);
    await fetchAPI('https://sw-api.starnavi.io/films', setFilms, setError);
    await fetchAPI('https://sw-api.starnavi.io/starships', setStarships, setError);
    setLoading(false); // Set loading to false once all data is fetched
  } catch (err) {
    setError(err);
    setLoading(false);
  }
};


// Fetch all data once on component mount
useEffect(() => {
  console.log("triggered")
  fetchAllData();
}, []); // Empty dependency array ensures this runs only once

// once loading is complete and all data is available, create nodes and edges
useEffect(() => {
  if (!loading && characters.length > 0 && films.length > 0 && starships.length > 0) {
    // accumulate nodes and edges in local arrays before updating state
    let allEdges = [];

    let { groupNodes, characterNodes } = createGroupNodes(characters); 

    let allNodes = [...groupNodes, ...characterNodes];
    
    // //for each character, create film nodes and edges
    // characterNodes.forEach(characterNode => {
    //   let filmNodes = createNodesFromFilms(characterNode, films);
    //   let filmEdges = createEdgesFromOneToMany(characterNode, filmNodes, characterNode.data.strokeColor, false);

    //   allNodes = [...allNodes, ...filmNodes];
    //   allEdges = [...allEdges, ...filmEdges];
    
    //   // for each film, create starship nodes and edges
    //   filmNodes.forEach(filmNode => {
    //     let starshipNodes = createNodesFromStarships(characterNode, filmNode, starships);
    //     let starshipEdges = createEdgesFromOneToMany(filmNode, starshipNodes, characterNode.data.strokeColor, true);

    //     allNodes = [...allNodes, ...starshipNodes];
    //     allEdges = [...allEdges, ...starshipEdges];
    //   });
    // });

    
    //console.log(allEdges);

    //console.log(allNodes);
    setNodes(allNodes);
    setEdges(allEdges);
}
}, [loading]);


const handleNodeClick = (event, node) => {
  // only handle clicks for certain nodes based on node.id or node.data
  if(node.data.pressed) 
    return;

  let updatedNodes = nodes.map((n) => {
    if (n.id === node.id) {
      // Update the node's className and pressed state
      return {
        ...n,
        data: {
          ...n.data,
          pressed: true,  // mark node as pressed
        },
        className: 'clicked-node',  // Update the className
      };
    }
    return n;
  });

  if (node.id.startsWith('character-')) {
    let filmNodes = createNodesFromFilms(node, films)
    let filmEdges = createEdgesFromOneToMany(node, filmNodes)
    let allNodes = [...updatedNodes, ...filmNodes];
    let allEdges = [...edges, ...filmEdges];
    setNodes(allNodes);
    setEdges(allEdges);
  }
  else if (node.id.startsWith('film-')) {
    node.className = 'clicked-node'
    node.data.pressed = true;
    const index = node.id.indexOf('character-');
    const characterId = node.id.substring(index)
    console.log(characterId);
    const characterNode = nodes.find((n) => n.id === characterId);
    console.log(characterNode);

    let starshipNodes = createNodesFromStarships(characterNode, node, starships);
    let starshipEdges = createEdgesFromOneToMany(node, starshipNodes, characterNode.data.strokeColor, true);
    let allNodes = [...updatedNodes, ...starshipNodes];
    let allEdges = [...edges, ...starshipEdges];
    setNodes(allNodes);
    setEdges(allEdges);
  }
};
  const onConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onConnect={onConnect}
      fitView
    >
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}

export default Home