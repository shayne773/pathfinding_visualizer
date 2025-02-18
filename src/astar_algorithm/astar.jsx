function Astar(startNode, endNode){

    let open = [];
    let closed = [];
    let path = [];
    let visited = [];

    open.push(startNode);

    while(open.length>0)
    {
        let leastIndex = 0;

        for(let i=0; i<open.length; i++)
        {
            if(open[i].f < open[leastIndex].f)
            {
                leastIndex = i;
            }
        }

        let current = open[leastIndex];
        visited.push(current);

        if(current === endNode){
            let temp = current;
            while(temp){
                path.push(temp);
                temp = temp.parent;
            }
            path = path.reverse()
            return {path, visited};

        }
        
        open.splice(leastIndex, 1);
        closed.push(current);
        
        let neighbors = current.neighbors;

        for(let i=0; i<neighbors.length; i++)
        {
            let neighbor = neighbors[i];
            let newPath = false;

            if(!closed.includes(neighbor) && !neighbor.isWall)
            {
                let tentative_gscore = current.g + 1;
                
                if(open.includes(neighbor))
                {
                    if(tentative_gscore<neighbor.g)
                    {
                        neighbor.g = tentative_gscore;
                        newPath = true;        
                    }
                }
                else
                {
                    neighbor.g = tentative_gscore;
                    open.push(neighbor);
                    newPath = true;

                }

                if(newPath)
                {
                    neighbor.h = heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                }
                

            }
            

    
        }

    }

    return {
        path,
        visited,
        error: "no path found"
    };
        


}

function heuristic(current, endNode){

    return Math.abs(current.x-endNode.x)+Math.abs(current.y-endNode.y);
}

 export default Astar;