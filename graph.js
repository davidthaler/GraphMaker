/*
TODO:
X fix up getID
2. fix up getName
X specify the errors in get*ById
4. commit, merge, push
*/

// Name and ID generators

getName = function(){
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let i=0;
        return (function(){
            i %= 26;
            return letters[i++];
        });
    }();    //evaluated


class Graph{

    constructor(){
        this.nodeMap = new Map();
        this.edgeMap = new Map();
        this.nextId = 0;
    }

    getID(){
        return this.nextId ++;
    }

    addNode(x, y, name=getName()){
        let newId = this.getID();
        this.nodeMap.set(newId, {name, id:newId, x, y, edges:[]});
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
        //NB: arrow fn prevents `this` from getting mangled
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
}

class KeyError extends Error{}
