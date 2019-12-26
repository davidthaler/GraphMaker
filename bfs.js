/*
Using BFS as a first cut at an algorithm to run on graphMaker.
Explores the connected component from startNode
*/

const nodeStates = {'unexplored': 'darkgray',
                    'visited'   : 'red',
                    'completed' : 'darkslategray'};

const edgeStates = {'unexplored': 'lightgray',
                    'visited'   : 'pink',
                    'completed' : 'black'};

function BFS(g, startNodeName){
    g.fillEdgeProperty('stateColor', edgeStates.unexplored);
    g.fillNodeProperty('stateColor', nodeStates.unexplored);
    drawGraph();
    g.fillNodeProperty('visited', false);
    let startNode = g.getNodeByName(startNodeName);
    let Q = [startNode];
    startNode.visited = true;
    startNode.stateColor = nodeStates.visited;
    while(Q.length > 0){
        let currentNode = Q.shift();
        for(let n of g.neighbors(currentNode)){
            if(!n.visited){
                Q.push(n);
                n.visited = true;
                n.stateColor = nodeStates.visited;
                drawGraph();
            }
        }
        currentNode.stateColor = nodeStates.completed;
        drawGraph();
    }
}