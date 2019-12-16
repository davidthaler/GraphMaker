/*
A first-cut at a graph maker for representing graphs in the browser.
This one will keep the data in the svg elements.
*/
window.onload = main;

function main(){
    let state;
    const RADIUS = 10;
    let svg = d3.select('svg');
    let x, y;
    let s, t;

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

    function clickNode(){
        if(state == 'removeNode'){
            d3.select(this).remove();
        }else if(state == 'pickS'){
            s = d3.select(this);
            state = 'pickT';
        }else if(state == 'pickT'){
            t = d3.select(this);
            state = 'pickS';
            svg.append('line')
               .attr('stroke', 'darkgray').attr('stroke-width', '2')
               .attr('x1', s.attr('cx')).attr('y1', s.attr('cy'))
               .attr('x2', t.attr('cx')).attr('y2', t.attr('cy'));
            s = undefined;
            t = undefined;
        }
        d3.event.stopPropagation();
    }

    d3.select('#addEdge').on('click', function(){
        d3.selectAll('button').style('background-color', null);
        if((state == 'pickS') || (state == 'pickT') ){
            state = undefined
        }else{
            state = 'pickS';
            d3.select(this).style('background-color', 'lightgrey');
        }
    });

    svg.on('click', function(){
        [x, y] = d3.mouse(this);
        if(state == 'addNode'){
            svg.append('circle')
                .attr('cx', x).attr('cy', y)
                .attr('r', RADIUS)
                .attr('fill', 'darkgray')
                .on('click', clickNode);  
        }
    });
}