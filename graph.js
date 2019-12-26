/*
Class `Graph` holds the graph data - the nodes and edges - for graphMaker.
There is no D3 functionality in here. 
Information from D3 gets here using ids in the datum of each D3 element.
The ids are written into the SVG elements themselves as attributes.
Information from here gets to D3 when the node or edge state is changed,
and then node/edge lists are fed into the data() method of a D3 selection.
*/
class Graph{

    constructor(){
        this.nodeMap = new Map();
        this.edgeMap = new Map();
        this.nextId = 0;
        this.nodeNames = Graph.nodeNameGenerator();
    }

    static* nodeNameGenerator(){
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let lowers = uppers.toLowerCase();
        for(let c of uppers){
            yield c;
        }
        for(let i = 0; i < uppers.length; i++){
            for(let j = 0; j < uppers.length; j++){
                yield uppers[j] + lowers[j];
            }
            lowers = lowers.slice(1) + lowers[0];
        }
        for(;;){
            yield '';
        }
    }

    getID(){
        return this.nextId ++;
    }

    nextNodeName(){
        return this.nodeNames.next().value;
    }

    incidentTo(node){
        return node.edges.map(eid => this.getEdgeById(eid));
    }

    // this could be if...else if...throw Error
    otherEnd(node, edge){
        return (node === edge.s) ? edge.t : edge.s;
    }

    neighbors(node){
        let edges = this.incidentTo(node);
        return edges.map(e => this.otherEnd(node, e));
    }

    addNode(x, y, name=this.nextNodeName()){
        let newId = this.getID();
        this.nodeMap.set(newId, {id:newId, name, x, y, edges:[]});
    }

    addEdge(sid, tid){
        let s = this.getNodeById(sid);
        let t = this.getNodeById(tid);
        let newId = this.getID();
        this.edgeMap.set(newId, {id:newId, s, t});
        s.edges.push(newId);
        t.edges.push(newId);
    }

    removeEdge(edgeId){
        let edge = this.getEdgeById(edgeId);
        edge.s.edges = edge.s.edges.filter(x => x != edgeId)
        edge.t.edges = edge.t.edges.filter(x => x != edgeId)
        this.edgeMap.delete(edge.id);
    }

    removeNode(nodeId){
        let node = this.getNodeById(nodeId);
        // arrow fn avoids mangling `this` pointer
        node.edges.forEach(id => this.removeEdge(id));
        this.nodeMap.delete(node.id)
    }

    moveNode(nodeId, dx, dy){
        let node = this.getNodeById(nodeId);
        node.x += dx;
        node.y += dy;
    }

    get nodes(){
        return [...this.nodeMap.values()];
    }

    get edges(){
        return [...this.edgeMap.values()];
    }

    getNodeById(id){
        let nodeId = Number(id);
        if(this.nodeMap.has(nodeId)){
            return this.nodeMap.get(nodeId);
        }else{
            throw new KeyError(`No node with id:${id}`);
        }
    }

    getEdgeById(id){
        let edgeId = Number(id);
        if(this.edgeMap.has(edgeId)){
            return this.edgeMap.get(edgeId);
        }else{
            throw new KeyError(`No edge with id:${id}`);
        }
    }

    // Not finding a name is not a KeyError because the names are not keys.
    // They are not required and do not have to be unique.
    getNodeByName(name){
        return this.nodes.find(n => (n.name == name));
    }
}

class Node{
    constructor(graph, id, name, x, y){
        this.graph = graph;
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.edges = [];
    }

    neighbors(){
        let out = [];
        for(let eid of this.edges){
            let edge = this.graph.getEdgeById(eid);
            out.push(edge.other(this));
        }
        return out;
    }
}

class Edge{
    constructor(graph, id, s, t){
        this.graph = graph;
        this.id = id;
        this.s = s;
        this.t = t
    }

    get name(){
        return this.s.name + '-' + this.t.name;
    }

    other(node){
        if(this.s === node){
            return this.t;
        }else if(this.t === node){
            return this.s;
        }else{
            throw new Error('Node argument not an endpoint of this edge');
        }
    }
}

class KeyError extends Error{}
