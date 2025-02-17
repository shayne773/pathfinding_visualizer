import React, {useState, useEffect} from "react";
import "./PathFind.css";
import Node from "./Node.jsx";
import Astar from "../astar_algorithm/astar";
import Header from "./Header.jsx"

const rows = 10;
const cols = 35;
const NODE_START_X = 0;
const NODE_START_Y = 0;
const NODE_END_X = cols-1;
const NODE_END_Y = rows-1;

const PathFind = () =>{
    
    const [grid, setgrid] = useState([]);
    const [path, setpath] = useState([]);
    const [visited, setvisited] = useState([]);

    useEffect(()=>{createGrid();}, []);

    const createGrid = () =>{
        setvisited([])
        setpath([])
        setgrid([])

        const newGrid = new Array(rows).fill(null).map((_, i) => 
            new Array(cols).fill(null).map((_, j) => new Spot(i, j)) 
        );


        addNeighbors(newGrid); 
        setgrid(newGrid); 
        
    }

    const addNeighbors = (grid)=>{
        for(var i=0; i<rows; i++)
        {
            for (var j=0; j<cols; j++)
            {
                grid[i][j].addneighbors(grid);
            }
        }
    }
    
    function Spot(i, j)
    {
        this.y = i;
        this.x = j;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.isStart = this.x === NODE_START_X && this.y === NODE_START_Y;
        this.isEnd = this.x === NODE_END_X && this.y === NODE_END_Y;
        this.isWall = false;
        if(Math.random(1)<0.2)
        {
            this.isWall = true;
        }

        if(this.isStart || this.isEnd){
            this.isWall = false;
        }

        this.neighbors = [];
        this.parent = undefined;
        this.addneighbors = function(grid)
        {
            let j = this.x;
            let i = this.y;

            if(i>0) this.neighbors.push(grid[i-1][j]);
            if(j>0) this.neighbors.push(grid[i][j-1]);
            if(i<rows-1) this.neighbors.push(grid[i+1][j]);
            if(j<cols-1) this.neighbors.push(grid[i][j+1]);

        }
    }

    const GridWithNode = (
        <div>
            {grid.map((row, rowInd) => {
                return (
                    <div className="row-wrapper" key={rowInd}>
                        {row.map((col, colInd) => {
                            const { isStart, isEnd, isWall } = col;
                            const isVisited = visited.some(node => node && node.x === col.x && node.y === col.y);
                            const isPath = path.some(node => node && node.x === col.x && node.y === col.y);
                            
                            return (
                                <Node
                                    key={colInd}
                                    isWall={isWall}
                                    isStart={isStart}
                                    isEnd={isEnd}
                                    isVisited={isVisited}
                                    isPath={isPath}
                                    row={rowInd}
                                    col={colInd}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );

    const visualizeShortestPath = (shortestPathNodes) => {
        let index = 0;
        const interval = setInterval(() => {
            if (index >= shortestPathNodes.length) {
                clearInterval(interval);
                return;
            }
            if (shortestPathNodes[index]) { 
                setpath(prevPath => [...prevPath, shortestPathNodes[index]]);
            }
            index++;
        }, 50);
    };

    const visualizePath = () => {
        if (!grid.length) return;
    
        const startNode = grid[NODE_START_Y][NODE_START_X];
        const endNode = grid[NODE_END_Y][NODE_END_X];
        let pathResult = Astar(startNode, endNode);

        console.log(`pathResult path: ${pathResult.path}`)
        console.log(`pathResult visited: ${pathResult.visited}`)
    
        let index = 0;
        const interval = setInterval(() => {
            if (index >= pathResult.visited.length) {
                clearInterval(interval);
                visualizeShortestPath(pathResult.path);
                return;
            }
            if (pathResult.visited[index]) {
                setvisited(prevVisited => [...prevVisited, pathResult.visited[index]]);
            }
            index++;
        }, 20);
    };
    
    console.log(`Path: ${path}`);
    console.log(`Visited: ${visited}`);
    return(
        <div className="path-find-container">
            <Header onVisualizePath={visualizePath} onResetGrid={createGrid}></Header>
            <div className="grid-wrapper">
                {GridWithNode}           
            </div>
        </div>

        
    )

    
}

export default PathFind;