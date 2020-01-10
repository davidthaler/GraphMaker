/*
Canvas Graph creates and renders graphs on a canvas.
It uses the Graph class of graph.js.
*/
window.onload = main

const RADIUS = 10
let canvas, ctx, btnState, activeNodeId
let nodes = []
let edges = []
// The graph
let g

let stateColor = {
    'normal'   : {'fill': 'lightgray', 'stroke': 'darkgray'},
    'selected' : {'fill': 'whitesmoke', 'stroke': 'gray'}
}

function drawNode(node){
    ctx.beginPath()
    ctx.moveTo(node.x + RADIUS, node.y)
    ctx.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
}

function drawEdge(edge){
    ctx.beginPath()
    ctx.moveTo(edge.s.x, edge.s.y)
    ctx.lineTo(edge.t.x, edge.t.y)
    ctx.stroke()
}

// NB: this clears the canvas, it does not replace the graph
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawGraph(){
    clearCanvas()
    g.edges.forEach(drawEdge)
    g.nodes.forEach(drawNode)
}

function removeNode(e){
    if(btnState != 'removeNode') return
    let [x, y] = shiftXY(e.x, e.y)
    let selectedNode = g.withinRadius(x, y, RADIUS)
    if(selectedNode){
        g.removeNode(selectedNode.id)
        drawGraph()
    }
}

function addNode(e){
    if(btnState != 'addNode') return
    let [x, y] = shiftXY(e.x, e.y)
    if(!g.withinRadius(x, y, 2 * RADIUS)){
        g.addNode(x, y)
        drawGraph()
    }
}

function addEdge(e){
    if(btnState != 'addEdge') return
    let [x, y] = shiftXY(e.x, e.y)
    let selectedNode = g.withinRadius(x, y, RADIUS)
    if(selectedNode){
        if(activeNodeId == undefined){
            activeNodeId = selectedNode.id
        }else{
            // no checks for now
            g.addEdge(activeNodeId, selectedNode.id)
            activeNodeId = undefined
            drawGraph()
        }
    }
}

function dragStart(e){
    if(btnState != 'moveNode') return
    let [x, y] = shiftXY(e.x, e.y)
    let selectedNode = g.withinRadius(x, y, RADIUS)
    if(selectedNode){
        activeNodeId = selectedNode.id
        canvas.addEventListener('mousemove', drag)
        canvas.addEventListener('mouseup', dragEnd)
        canvas.addEventListener('mouseleave', dragEnd)
    }
}

function drag(e){
    g.moveNode(activeNodeId, e.movementX, e.movementY)
    drawGraph()
}

function dragEnd(e){
    activeNodeId = undefined
    canvas.removeEventListener('mousemove', drag)
    canvas.removeEventListener('mouseup', dragEnd)
    canvas.removeEventListener('mouseleave', dragEnd)
}

function shiftXY(x, y){
    return [x - canvas.offsetLeft, y - canvas.offsetTop]
}

function main(){
    g = new Graph()
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'gray'
    ctx.fillStyle = 'lightgray'
    canvas.addEventListener('click', removeNode)
    canvas.addEventListener('click', addNode)
    canvas.addEventListener('click', addEdge)
    canvas.addEventListener('mousedown', dragStart)
    document.querySelectorAll('input').forEach(b => 
        b.addEventListener('change', function(){
                btnState=this.value
            }))
}
