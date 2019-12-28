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
    let startNode = g.getNodeByName(startNodeName);
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
        for(let e of g.incidentTo(currentNode)){
            let n = g.otherEnd(currentNode, e);
            if(n.stateColor == nodeStates.unexplored){
                Q.push(n);
                n.stateColor = nodeStates.visited;
                colorGraph(k++);
            }
            e.stateColor = (n.stateColor == nodeStates.completed) 
                                ? edgeStates.completed : edgeStates.visited;
        }
        currentNode.stateColor = nodeStates.completed;
        colorGraph(k++);
    }
}
