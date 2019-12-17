/*
Second take at GraphMaker. 
This one has a separate data structure and uses the General Update Pattern.
As of now (12/16), the text is on top of the circles and attached to the SVG,
not the circles. Hmm...
*/
window.onload = main;

// for now...
const ns = [{'name':'A', id:0, x:200, y:200},
            {'name':'B', id:1, x:400, y:200},
            {'name':'C', id:2, x:400, y:400},
            {'name':'D', id:3, x:200, y:400}];

const RADIUS = 10;

function makeNodes(nodes){
    let svg = d3.select('svg');
    let cs = svg.selectAll('circle').data(nodes, d => d.id);
    cs.exit().remove();
    let newCs = cs.enter().append('circle')
                  .attr('r', RADIUS).attr('fill', 'darkgrey');
    cs = newCs.merge(cs);
    cs.attr('cx', d => d.x).attr('cy', d => d.y);
}

//BUG: labelNodes([]) does not work because we do not follow G.U.P.
//NB: y-offset is in the user coordinate system
function labelNodes(nodes){
    let svg = d3.select('svg');
    let ts = svg.selectAll('text').data(nodes, d => d.id)
    ts.exit().remove();
    let newTs = ts.enter().append('text')
                .attr('text-anchor', 'middle').attr('font-size', 10)
    ts = newTs.merge(ts);
    ts.attr('x', d => d.x).attr('y', d => d.y+3).text(d => d.name);
}

function main(){
    makeNodes(ns);
    labelNodes(ns);
}