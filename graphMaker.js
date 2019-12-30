/*
Third take on graphMaker. 
*/
window.onload = main;

let sid, tid;
const RADIUS = 10;
const FONTSIZE = 10;
const OFFSET = 3;
let DURATION_MS = 100;
let DELAY_MS = 500;
let state = 'none';
let g = new Graph();
const indexName = 'GraphMakerSavedGraphNames';

// Event handlers
function clickNode(){
    let nodeId = this.getAttribute('nodeId');
    if(state == 'removeNode'){
        g.removeNode(nodeId);
        drawGraph();
    }else if(state == 'pickS'){
        sid = nodeId;
        state = 'pickT';
    }else if(state =='pickT'){
        tid = nodeId;
        g.addEdge(sid, tid);
        state = 'pickS';
        s = undefined;
        t = undefined;
        drawGraph();
    }else if(state=='runBFS'){
        BFS(g, nodeId);
    }
}

function clickEdge(){
    if(state=='removeEdge'){
        g.removeEdge(this.getAttribute('edgeId'));
        drawGraph();
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

    sel.classed('node', true);
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
           .attr('x2', d => d.t.x).attr('y2', d => d.t.y);
}

function drawGraph(){
    drawEdges(g.edges);
    drawNodes(g.nodes);
}

function colorGraph(k){
    d3.selectAll('line.edge')
        .data(g.edges)
        .transition().duration(DURATION_MS).delay(DELAY_MS * k)
        .attr('stroke', d => d.stateColor);
    d3.selectAll('circle.nodeCircle')
        .data(g.nodes)
        .transition().duration(DURATION_MS).delay(DELAY_MS * k)
        .attr('fill', d => d.stateColor);
}

function loadSavedGraph(graphName){
    let graphString = localStorage.getItem(graphName);
    if(graphString){
        g = Graph.fromJSON(graphString);
        drawGraph();
    }else{
        console.error(`No saved graph: ${graphName}`);
    }
}

function savedGraphNames(){
    return JSON.parse(localStorage.getItem(indexName)) || [];
}

function makeLoadSelector(){
    let gnames = savedGraphNames();
    let sel = document.getElementById('loadSavedGraph');
    for(let l of gnames){
        let opt = document.createElement('option');
        opt.value = l;
        opt.text = l;
        sel.append(opt);
    }
    sel.addEventListener('change', function(){
        if(this.value != 'noSelection'){
            loadSavedGraph(this.value);
            drawGraph();
        }
    });
}

function saveGraph(graphName){
    let gnames = savedGraphNames();
    if(!gnames.includes(graphName)){
        gnames.push(graphName);
        localStorage.setItem(indexName, JSON.stringify(gnames));
    }else{
        console.warn(`Overwriting existing graph ${graphName}`);
    }
    localStorage.setItem(graphName, g.toJSON());
    console.log(`Saved current graph as ${graphName}`);
}

function clearGraph(){
    g = new Graph();
    drawGraph();
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

// Set up graphMaker
function main(){
    d3.select('#addNode').on('click', buttonClick('addNode'));
    d3.select('#removeNode').on('click', buttonClick('removeNode'));
    d3.select('#addEdge').on('click', buttonClick(['pickS', 'pickT']));
    d3.select('#removeEdge').on('click', buttonClick('removeEdge'));
    d3.select('#runBFS').on('click', buttonClick('runBFS'));
    makeLoadSelector();
    d3.select('svg').on('click', function(){
        if(state == 'addNode'){
            let [x, y] = d3.mouse(this);
            g.addNode(x, y);
            drawGraph();
        }
    });
}