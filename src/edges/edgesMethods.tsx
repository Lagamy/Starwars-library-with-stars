import { Edge, Node } from "reactflow";

export const createEdgesFromOneToMany = (source: Node, targets: Node[], animated: boolean): Edge[] => {
    const edges: Edge[] = [];
    if(targets.length > 0) {
    
    targets.forEach( target => {
        edges.push({
            id: `edge-${source.id}-${target.id}`,
            source: source.id,
            target: target.id,
            animated: animated,
            style: {stroke: source.data.strokeColor}
          });
    });
}
    return edges;
};