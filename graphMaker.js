/*
Third take on graphMaker. 
*/
window.onload = main;

let s, t;
const RADIUS = 10;
const FONTSIZE = 10;
const OFFSET = 3;
let state = 'none';
let g = new Graph();

// Event handlers
function clickNode(){
    let nodeId = Number(this.getAttribute('nodeId'));
    if(state == 'removeNode'){
        g.removeNode(nodeId);
        drawGraph();
    }else if(state == 'pickS'){
        s = g.getNodeById(nodeId);
        state = 'pickT';
    }else if(state =='pickT'){
        t = g.getNodeById(nodeId);
        // create s-t edge
        g.addEdge(s, t);
        // reset state
        state = 'pickS';
        s = undefined;
        t = undefined;
        drawGraph();
    }
}

function clickEdge(){
    if(state=='removeEdge'){
        g.removeEdge(this.getAttribute('edgeId'));
        drawGraph();
    }
}

// Closure that returns button click handlers
function buttonClick(states){
    states = (states instanceof Array) ? states : [states];
    return function(){
        d3.selectAll('button').classed('state-active', false);
        if(states.includes(state)){
            state = 'none';
        }else{
            state = states[0];
            d3.select(this).classed('state-active', true);
        }
    }
}

// D3 graphics
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

function drawNodes(nodes){
    let nodeSel = d3.select('svg').selectAll('g').data(nodes, d => d.id);
    nodeSel.exit().remove();
    let newNodes = nodeSel.enter()
                          .append('g')
                          .call(node)
                          .attr('nodeId', d => d.id)
                          .on('click', clickNode)
                          .call(d3.drag().on('drag', function(){
                            if(state == 'none'){
                                let [dx, dy] = d3.mouse(this);
                                g.moveNode(this.getAttribute('nodeId'), dx, dy);
                                drawGraph();
                            }
                          }));
    nodeSel = newNodes.merge(nodeSel);
    nodeSel.attr('transform', translate).raise();
}

function drawEdges(edges){
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

function drawGraph(){
    drawEdges(g.edges);
    drawNodes(g.nodes);
}

// Set up graphMaker
function main(){
    d3.select('#addNode').on('click', buttonClick('addNode'));
    d3.select('#removeNode').on('click', buttonClick('removeNode'));
    d3.select('#addEdge').on('click', buttonClick(['pickS', 'pickT']));
    d3.select('#removeEdge').on('click', buttonClick('removeEdge'));
    d3.select('svg').on('click', function(){
        if(state == 'addNode'){
            let [x, y] = d3.mouse(this);
            g.addNode(x, y);
            drawGraph();
        }
    });
}