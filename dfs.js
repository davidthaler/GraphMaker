/*
DFS traversal.
*/

let k;

function DFS(g, startNodeId){
    k = 0;
    g.fillNodeProperty('stateColor', nodeStates.unexplored);
    g.fillEdgeProperty('stateColor', edgeStates.unexplored);
    colorGraph(k++);
    dfs(g, g.getNodeById(startNodeId));
}

function dfs(g, s){
    s.stateColor = nodeStates.visited;
    colorGraph(k++);
    for(let e of g.incidentTo(s)){
        let n = g.otherEnd(s, e);
        if(n.stateColor == nodeStates.unexplored){
            e.stateColor = edgeStates.visited;
            dfs(g, n);
            e.stateColor = edgeStates.completed;
        }else if(e.stateColor == edgeStates.unexplored){
            // NB: unexamined edge to a previously seen node
            e.stateColor = edgeStates.unused;
        }
        colorGraph(k++);
    }
    s.stateColor = nodeStates.completed;
    colorGraph(k++);
}