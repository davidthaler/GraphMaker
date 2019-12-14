/*
A first-cut at a graph maker for representing graphs in the browser.
This one will keep the data in the svg elements.
*/
window.onload = main;

function main(){
    const RADIUS = 10;
    let svg = d3.select('svg');
    let x, y;
    function clickNode(e){
        d3.select(this).attr('fill', 'red');
        d3.event.stopPropagation();
    }
    svg.on('click', function(){
        [x, y] = (d3.mouse(this));
        svg.append('circle')
           .attr('cx', x).attr('cy', y)
           .attr('r', RADIUS)
           .attr('fill', 'darkgray')
           .on('click', clickNode);
    });
}