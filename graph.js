// Name and ID generators
getID = function(){let i=0;return function(){return i++}}();
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
    }

    addNode(x, y, name=getName()){
        let newId = getID();
        this.nodeMap.set(newId, {name, id:newId, x, y, edges:[]});
    }

    addEdge(sid, tid){
        let s = this.getNodeById(sid);
        let t = this.getNodeById(tid);
        let newId = getID();
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
        //NB: arrow fn prevents this from getting mangled
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
        id = Number(id);
        if(this.nodeMap.has(id)){
            return this.nodeMap.get(id);
        }else{
            // some error 
        }
    }

    getEdgeById(id){
        id = Number(id);
        if(this.edgeMap.has(id)){
            return this.edgeMap.get(id);
        }else{
            // some error
        }
    }
}