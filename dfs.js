/*
DFS traversal.
*/
function DFS(g, startNodeId){
    let k = 0;
    g.fillNodeProperty('stateColor', nodeStates.unexplored);
    g.fillEdgeProperty('stateColor', edgeStates.unexplored);
    colorGraph(k++);
    dfs(g, g.getNodeById(startNodeId), k);
}

function dfs(g, s, k){
    s.stateColor = nodeStates.visited;
    colorGraph(k++);
    for(let e of g.incidentTo(s)){
        let n = g.otherEnd(s, e);
        if(n.stateColor == nodeStates.unexplored){
            e.stateColor = edgeStates.visited;
            k = dfs(g, n, k);
            e.stateColor = edgeStates.completed;
        }else if(e.stateColor == edgeStates.unexplored){
            // NB: unexamined edge to a previously seen node
            e.stateColor = edgeStates.unused;
        }
        colorGraph(k++);
    }
    s.stateColor = nodeStates.completed;
    colorGraph(k++);
    return k;
}
