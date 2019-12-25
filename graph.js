class Graph{

    constructor(){
        this.nodeMap = new Map();
        this.edgeMap = new Map();
    }

    get nodes(){
        return [...this.nodeMap.values()];
    }

    get edges(){
        return [...this.edgeMap.values()];
    }
}