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

let ns = [];
let es = [];
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
    let nodeId = this.getAttribute('nodeId');
    if(state == 'removeNode'){
        es = es.filter(edge => ((edge.s.id != nodeId) 
                                && (edge.t.id != nodeId)));
        ns = ns.filter(node => (node.id != nodeId));
        drawGraph();
    }else if(state == 'pickS'){
        s = ns.filter(node => (node.id == nodeId))[0];
        state = 'pickT';
    }else if(state =='pickT'){
        t = ns.filter(node => (node.id == nodeId))[0];
        // create s-t edge
        es.push({id:getID(), s, t});
        state = 'pickS';
        drawGraph();
        s = undefined;
        t = undefined;
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
    /*
    NB: raise() removes all of the nodes in a selection and then appends
    them to their parent, putting them at the end of the child nodes. 
    This is what keeps the nodes on top of the edges.
    */
    nodeSel.attr('transform', translate).raise();
}

function clickEdge(){
    if(state=='removeEdge'){
        // could use d3.select(this).attr('edgeId')
        let edgeId = this.getAttribute('edgeId');
        es = es.filter(x => (x.id != edgeId));
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

/*
Closure to get a button click callback. 
Expects state to be a global.
Requires a "state-active" CSS class in the HTML.
*/
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

function drawGraph(nodes, edges){
    makeEdges(es);
    makeNodes(ns);
}

function main(){
    d3.select('#addNode').on('click', buttonClick('addNode'));
    d3.select('#removeNode').on('click', buttonClick('removeNode'));
    d3.select('#addEdge').on('click', buttonClick(['pickS', 'pickT']));
    d3.select('#removeEdge').on('click', buttonClick('removeEdge'));
    drawGraph(ns, es);
    d3.select('svg').on('click', function(){
        [x, y] = d3.mouse(this);
        if(state == 'addNode'){
            ns.push({name:getName(), id:getID(), x, y});
            drawGraph();
        }
    });
}