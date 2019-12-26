/*
Using BFS as a first cut at an algorithm to run on graphMaker.
Explores the connected component from startNode
*/

function BFS(startNode){
    let Q = [startNode];
    startNode.visited = true;
    while(Q.length > 0){
        let currentNode = Q.shift();
        console.log(`Expanding ${currentNode.name}`);
        for(let n of currentNode.neighbors()){
            if(!n.visited){
                Q.push(n);
                n.visited = true;
                console.log(`enqueueing node ${n.name}`);
            }

        }
        console.log(`Completing ${currentNode.name}`);
    }
    console.log(`Completed BFS starting from node ${startNode.name}`);
}