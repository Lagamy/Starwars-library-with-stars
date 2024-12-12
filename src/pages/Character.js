import React from 'react'
export default function Character() {
const [films, setFilms] = useState([]);   
const [starships, setStarships] = useState([]);  

const [nodes, setNodes, onNodesChange] = useNodesState([]);
const [edges, setEdges, onEdgesChange] = useEdgesState([]);





const onConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

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