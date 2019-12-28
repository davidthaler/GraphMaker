/*
Using BFS as a first cut at an algorithm to run on graphMaker.
Explores the connected component from startNode
*/

const nodeStates = {'unexplored': 'darkgray',
                    'visited'   : 'pink',
                    'active'    : 'yellow',
                    'completed' : 'red'};

const edgeStates = {'unexplored': 'lightgray',
                    'visited'   : 'pink',
                    'completed' : 'black'};

function BFS(g, startNodeName){
    g.fillNodeProperty('visited', false);
    let startNode = g.getNodeByName(startNodeName);
    startNode.visited = true;
    let Q = [startNode];
    let k = 0

    g.fillEdgeProperty('stateColor', edgeStates.unexplored);
    g.fillNodeProperty('stateColor', nodeStates.unexplored);
    startNode.stateColor = nodeStates.visited;
    colorGraph(k++);

    while(Q.length > 0){
        let currentNode = Q.shift();
        currentNode.stateColor = nodeStates.active;
        colorGraph(k++);
        for(let n of g.neighbors(currentNode)){
            if(!n.visited){
                Q.push(n);
                n.visited = true;
                n.stateColor = nodeStates.visited;
                colorGraph(k++);
            }
        }
        currentNode.stateColor = nodeStates.completed;
        colorGraph(k++);
    }
}
