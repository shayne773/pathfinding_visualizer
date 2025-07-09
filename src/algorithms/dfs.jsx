function Dfs(startNode, endNode) {

    let stack = [];
    let visited = [];
    let path = [];

    stack.push(startNode);

    while(stack.length > 0) {

        let node = stack.pop();
        if (visited.includes(node)) continue;
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
                stack.push(neighbor);
            }
        }
    }
    
    return {path, visited};

}

export default Dfs;