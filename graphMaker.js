/*
A first-cut at a graph maker for representing graphs in the browser.
This one will keep the data in the svg elements.

This one has a few problems:
1) The edges are on top of the nodes. 
   This is not visible if they are the same color, but causes odd UI behavior.
2) Double edges are possible, but not visible.
3) Overlapping nodes are possible. They may be visible.
4) There is repeated code in the button-state toggle.
*/
window.onload = main;

function main(){
    const RADIUS = 10;
    let svg = d3.select('svg');
    let state;
    let x, y;
    let s, t;
    let NodeId = 0;

    d3.select('#addNode').on('click', function(){
        d3.selectAll('button').style('background-color', null);
        if(state == 'addNode'){
            state = undefined;
        }else{
            state = 'addNode';
            d3.select(this).style('background-color', 'lightgrey');
        }
    });

    d3.select('#removeNode').on('click', function(){
        d3.selectAll('button').style('background-color', null);
        if(state == 'removeNode'){
            state = undefined;
        }else{
            state = 'removeNode';
            d3.select(this).style('background-color', 'lightgrey');
        }
    });

    d3.select('#addEdge').on('click', function(){
        d3.selectAll('button').style('background-color', null);
        if((state == 'pickS') || (state == 'pickT') ){
            state = undefined
        }else{
            state = 'pickS';
            d3.select(this).style('background-color', 'lightgrey');
        }
    });

    d3.select('#removeEdge').on('click', function(){
        d3.selectAll('button').style('background-color', null);
        if(state == 'removeEdge'){
            state = undefined;
        }else{
            state = 'removeEdge';
            d3.select(this).style('background-color', 'lightgrey');
        }
    });

    function clickNode(){
        if(state == 'removeNode'){
            let n = d3.select(this);
            let id = n.attr('id');
            n.remove();
            d3.selectAll(`line[sid="${id}"]`).remove();
            d3.selectAll('line[tid="' + id + '"]').remove();
        }else if(state == 'pickS'){
            s = d3.select(this);
            state = 'pickT';
        }else if(state == 'pickT'){
            t = d3.select(this);
            state = 'pickS';
            svg.append('line')
               .attr('stroke', 'darkgray').attr('stroke-width', '2')
               .attr('x1', s.attr('cx')).attr('y1', s.attr('cy'))
               .attr('x2', t.attr('cx')).attr('y2', t.attr('cy'))
               .attr('sid', s.attr('id')).attr('tid', t.attr('id'))
               .on('click', clickEdge);
            s = undefined;
            t = undefined;
        }
        d3.event.stopPropagation();
    }

    function clickEdge(){
        if(state == 'removeEdge'){
            d3.select(this).remove();
        }
        d3.event.stopPropagation();
    }

    svg.on('click', function(){
        [x, y] = d3.mouse(this);
        if(state == 'addNode'){
            svg.append('circle')
                .attr('cx', x).attr('cy', y)
                .attr('r', RADIUS)
                .attr('fill', 'darkgray')
                .attr('id', NodeId++)
                .on('click', clickNode);  
        }
    });
}