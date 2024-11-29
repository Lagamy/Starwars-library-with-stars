import ReactFlow, { Handle } from 'react-flow-renderer';

// Custom Node with handles on the sides
const CustomNode = ({ data }) => {
  return (
    <div style={{ width: '150px', height: '100px', border: '1px solid black' }}>
      {/* Left Handle */}
      <Handle
        type="source"
        position="left"
        id="left"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      {/* Node Content */}
      <div style={{ padding: '10px', textAlign: 'center' }}>
        {data.label}
      </div>

      {/* Right Handle */}
      <Handle
        type="target"
        position="right"
        id="right"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

export default CustomNode;