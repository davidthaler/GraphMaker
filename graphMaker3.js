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

const RADIUS = 10;
const FONTSIZE = 10;
const OFFSET = 3;

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

// As of now, makeNodes works once, but does not update due to lack of GUP
function makeNodes(nodes){
    let nodeSel = d3.select('svg').selectAll('g').data(nodes, d => d.id);
    nodeSel.exit().remove();
    let newNodes = nodeSel.enter()
                          .append('g')
                          .call(node);
    nodeSel = newNodes.merge(nodeSel);
    nodeSel.attr('transform', translate);
}

function main(){
    makeNodes(ns);
}