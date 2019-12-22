/*
Third take on graphMaker. 
*/
window.onload = main;

// Name and ID generators
getID = function(){let i=0;return function(){return i++}}();
getName = function(){
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let i=0;
        return (function(){
            i %= 26;
            return letters[i++];
        });
    }();    //evaluated

let nodeMap = new Map();
let edgeMap = new Map();
let s, t;
const RADIUS = 10;
const FONTSIZE = 10;
const OFFSET = 3;
let state = undefined;

function node(sel){
    sel.append('circle').attr('r', RADIUS)
        .attr('cx', 0).attr('cy', 0)
        .attr('fill', 'darkgrey')
        .classed('nodeCircle', true);

    sel.append('text').attr('x', 0).attr('y', OFFSET)
        .attr('text-anchor', 'middle').attr('font-size', FONTSIZE)
        .attr('font-family', 'sans-serif')
        .classed('nodeLabel', true)
        .text(d => d.name);
}

function translate(d){
    return `translate(${d.x},${d.y})`;
}

function clickNode(){
    let nodeId = Number(this.getAttribute('nodeId'));
    if(state == 'removeNode'){
        let node = nodeMap.get(nodeId);
        for(edgeId of node.edges){
            let edge = edgeMap.get(edgeId);
            let other = (edge.s === node ? edge.t:edge.s);
            other.edges = other.edges.filter(x => x != edgeId);
            edgeMap.delete(edgeId);
        }
        nodeMap.delete(nodeId)
        drawGraph();
    }else if(state == 'pickS'){
        s = nodeMap.get(nodeId);
        state = 'pickT';
    }else if(state =='pickT'){
        t = nodeMap.get(nodeId);
        // create s-t edge
        let newId = getID();
        edgeMap.set(newId, {id:newId, s, t});
        s.edges.push(newId);
        t.edges.push(newId);
        // reset state
        state = 'pickS';
        s = undefined;
        t = undefined;
        drawGraph();
    }
}

function makeNodes(nodes){
    let nodeSel = d3.select('svg').selectAll('g').data(nodes, d => d.id);
    nodeSel.exit().remove();
    let newNodes = nodeSel.enter()
                          .append('g')
                          .call(node)
                          .attr('nodeId', d => d.id)
                          .on('click', clickNode);
    nodeSel = newNodes.merge(nodeSel);
    nodeSel.attr('transform', translate).raise();
}

function clickEdge(){
    if(state=='removeEdge'){
        let edgeId = Number(this.getAttribute('edgeId'));
        let edge = edgeMap.get(edgeId);
        edge.s.edges = edge.s.edges.filter(x => x != edgeId)
        edge.t.edges = edge.t.edges.filter(x => x != edgeId)
        edgeMap.delete(edgeId);
        drawGraph();
    }
}

function makeEdges(edges){
    let edgeSel = d3.select('svg').selectAll('line.edge').data(edges, d => d.id)
    edgeSel.exit().remove();
    let newEdges = edgeSel.enter().append('line')
                          .attr('stroke', 'lightgray').attr('stroke-width', 2)
                          .attr('edgeId', d => d.id)
                          .classed('edge', true)
                          .on('click', clickEdge);
    edgeSel = newEdges.merge(edgeSel);
    edgeSel.attr('x1', d => d.s.x).attr('y1', d => d.s.y)
           .attr('x2', d => d.t.x).attr('y2', d => d.t.y)
}

function buttonClick(states){
    states = (states instanceof Array) ? states : [states];
    return function(){
        d3.selectAll('button').classed('state-active', false);
        if(states.includes(state)){
            state = undefined;
        }else{
            state = states[0];
            d3.select(this).classed('state-active', true);
        }
    }
}


function drawGraph(){
    makeEdges([...edgeMap.values()]);
    makeNodes([...nodeMap.values()]);
}

function main(){
    d3.select('#addNode').on('click', buttonClick('addNode'));
    d3.select('#removeNode').on('click', buttonClick('removeNode'));
    d3.select('#addEdge').on('click', buttonClick(['pickS', 'pickT']));
    d3.select('#removeEdge').on('click', buttonClick('removeEdge'));
    drawGraph();
    d3.select('svg').on('click', function(){
        [x, y] = d3.mouse(this);
        if(state == 'addNode'){
            let newId = getID();
            nodeMap.set(newId, {name:getName(), id:newId, x, y, edges:[]});
            drawGraph();
        }
    });
}