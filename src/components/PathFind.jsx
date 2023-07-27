import React, {useState, useEffect} from "react";
import "./PathFind.css";
import Node from "./Node.jsx";
import Astar from "../astar_algorithm/astar";

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
        const grid = new Array(rows);
    
        for(var i =0; i<rows; i++)
        {
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        setgrid(grid);
        addNeighbors(grid);
        const startNode = grid[NODE_START_Y][NODE_START_X];
        const endNode = grid[NODE_END_Y][NODE_END_X];
        let path = Astar(startNode, endNode);
        setpath(path.path);
        setvisited(path.visited);
    }

    const createSpot = (grid)=>{

        for(var i=0; i<rows; i++)
            {
                for(var j=0; j<cols; j++)
                {
                    grid[i][j] = new Spot(i, j);
                }
            }
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
                    <div className='row-wrapper' key={rowInd}>
                        {row.map((col, colInd) =>{
                            const {isStart, isEnd, isWall} = col
                            return <Node key={colInd} isWall={isWall} isStart={isStart} isEnd={isEnd} row={rowInd} col={colInd}/>
                        })}
                    </div>
                );
            })}
        </div>
    )

    const visualizeShortestPath = (shortestPathNodes) =>{
        
        for(let i=0; i<shortestPathNodes.length; i++)
        {
            setTimeout(()=>{
            let node = shortestPathNodes[i]
            document.getElementById(`node-${node.y}-${node.x}`).className = "node node-shortest-path"
            }, i*10)
        }
    }

    const visualizePath = () =>{
        for(let i=0; i<=visited.length; i++)
        {
            if(i===visited.length)
            {
                
                setTimeout(() => {
                    visualizeShortestPath(path)
                    }, 20 * i);
                
            }
            else{
                setTimeout(()=>{
                    let node = visited[i];
                    document.getElementById(`node-${node.y}-${node.x}`).className = "node node-visited"
                    }, 20 * i)
            }
        }
    }
    
    console.log(path);
    return(
        <div className="grid-wrapper">
            <button onClick = {visualizePath}>visualize path</button>
            <h1>Pathfinding Visualizer</h1>
            {GridWithNode}           
        </div>
        
    )

    
}

export default PathFind;