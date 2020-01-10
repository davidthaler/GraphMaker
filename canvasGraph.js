/*
First step towards GraphMaker on canvas: adding nodes/circles.
*/
window.onload = main

const RADIUS = 10
let canvas, ctx, btnState, activeNode
let nodes = []
let edges = []

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
    edges.forEach(drawEdge)
    nodes.forEach(drawNode)
}

//Returns index in nodes of first node within distance d of point x, y
function withinDist(x, y, d){
    return nodes.findIndex(n => ((n.x - x)**2 + (n.y - y)**2) <= d**2)
}

function removeNode(e){
    if(btnState != 'removeNode') return
    let [x, y] = shiftXY(e.x, e.y)
    let nIdx = withinDist(x, y, RADIUS)
    if(nIdx != -1){
        nodes.splice(nIdx, 1)
        drawGraph()
    }   
}

function addNode(e){
    if(btnState != 'addNode') return
    let [x, y] = shiftXY(e.x, e.y)
    if(withinDist(x, y, 2 * RADIUS) == -1){
        nodes.push({x, y})
        drawGraph()
    }
}

function addEdge(e){
    if(btnState != 'addEdge') return
    let [x, y] = shiftXY(e.x, e.y)
    let nIdx = withinDist(x, y, RADIUS)
    if(nIdx != -1){
        if(activeNode == undefined){
            activeNode = nodes[nIdx]
        }else{
            // no checks for now
            edges.push({s:activeNode, t:nodes[nIdx]})
            activeNode = undefined
            drawGraph()
        }
    }
}

function dragStart(e){
    if(btnState != 'moveNode') return
    let [x, y] = shiftXY(e.x, e.y)
    let nIdx = withinDist(x, y, RADIUS)
    if(nIdx != -1){
        activeNode = nodes[nIdx]
        canvas.addEventListener('mousemove', drag)
        canvas.addEventListener('mouseup', dragEnd)
        canvas.addEventListener('mouseleave', dragEnd)
    }
}

function drag(e){
    activeNode.x += e.movementX
    activeNode.y += e.movementY
    drawGraph()
}

function dragEnd(e){
    activeNode = undefined
    canvas.removeEventListener('mousemove', drag)
    canvas.removeEventListener('mouseup', dragEnd)
    canvas.removeEventListener('mouseleave', dragEnd)
}

function shiftXY(x, y){
    return [x - canvas.offsetLeft, y - canvas.offsetTop]
}

function main(){
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
