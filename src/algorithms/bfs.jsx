function Bfs(startNode, endNode) {

    let queue = [];
    let visited = [];
    let path = [];

    queue.push(startNode);
    
    while(queue.length > 0) {

        let node = queue.shift();
        visited.push(node);

        if(node === endNode) {
            let temp = node;
            while(temp) {
                path.push(temp);
                temp  = temp.parent;
            }

            path = path.reverse();
            return {path, visited};
        }

        for (let i = 0; i < node.neighbors.length; i++) {
            let neighbor = node.neighbors[i];

            if (!visited.includes(neighbor) && !neighbor.isWall) {
                neighbor.parent = node;
                queue.push(neighbor);
                visited.push(neighbor);
            }
        }
    }
    
    return {path, visited};

}

export default Bfs;