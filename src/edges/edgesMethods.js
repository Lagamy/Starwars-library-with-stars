export const createEdgesFromOneToMany = (source, targets, animated) => {
    const edges = [];
    if(targets != []) {
    
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