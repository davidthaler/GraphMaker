/*
Third take on graphMaker. This one uses a component to try to get around the 
text-circle issue and hopefully simplify the code.


*/
window.onload = main;

// for now...
const ns = [{'name':'A', id:0, x:200, y:200},
            {'name':'B', id:1, x:400, y:200},
            {'name':'C', id:2, x:400, y:400},
            {'name':'D', id:3, x:200, y:400}];

const es = [{id:4, s:ns[0], t:ns[1]},
            {id:5, s:ns[3], t:ns[0]},
            {id:6, s:ns[0], t:ns[2]}];

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

function makeNodes(nodes){
    let nodeSel = d3.select('svg').selectAll('g').data(nodes, d => d.id);
    nodeSel.exit().remove();
    let newNodes = nodeSel.enter().append('g').call(node);
    nodeSel = newNodes.merge(nodeSel);
    nodeSel.attr('transform', translate);
}

function makeEdges(edges){
    let edgeSel = d3.select('svg').selectAll('line.edge').data(edges, d => d.id)
    edgeSel.exit().remove();
    let newEdges = edgeSel.enter().append('line')
                          .attr('stroke', 'darkgray').attr('stroke-width', 2)
                          .classed('edge', true);
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
    drawGraph(ns, es);
}