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
        this.nameState = 0;
    }

    toJSON(){
        function simplify(e){
            let out = {};
            for(let k of Object.keys(e)){
                if(['s','t'].includes(k)){
                    out[k] = e[k].id;
                }else{out[k]=e[k];}
            }
            return out;
        }
        let altEdges = this.edges.map(simplify);
        let output = {nextId    :this.nextId,
                      nameState :this.nameState,
                      nodes     :this.nodes,
                      edges     :altEdges};
        return JSON.stringify(output);
    }

    static fromJSON(json){
        let data = JSON.parse(json);
        let g = new Graph();
        g.nextId = data.nextId;
        g.nameState = data.nameState;
        for(let n of data.nodes){
            g.nodeMap.set(n.id, n);
        }
        for(let e of data.edges){
            e.s = g.getNodeById(e.s);
            e.t = g.getNodeById(e.t);
            g.edgeMap.set(e.id, e);
        }
        return g;
    }

    getID(){
        return this.nextId ++;
    }

    nextNodeName(){
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let len = uppers.length;
        let label;
        if(this.nameState < len){
            label = uppers[this.nameState];
        }else if(this.nameState < (len + len * len)){
            let i = this.nameState % len;
            let jOffset = ((this.nameState - len) / len) | 0;
            let j = (i + jOffset) % len;
            label = uppers[i] + uppers[j].toLowerCase();
        }else{
            label = '';
        }
        this.nameState += 1;
        return label;
    }

    fillNodeProperty(name, value){
        this.nodeMap.forEach(n => n[name] = value);
    }

    fillEdgeProperty(name, value){
        this.edgeMap.forEach(n => n[name] = value);
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
        if(sid==tid) return false;
        let s = this.getNodeById(sid);
        let t = this.getNodeById(tid);
        if(this.neighbors(t).includes(s)) return false;
        let newId = this.getID();
        this.edgeMap.set(newId, {id:newId, s, t});
        s.edges.push(newId);
        t.edges.push(newId);
        return true;
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

    getNodeByName(name){
        return this.nodes.find(n => (n.name == name));
    }
}

class KeyError extends Error{}
