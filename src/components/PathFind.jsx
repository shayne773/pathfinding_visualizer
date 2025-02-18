import React, {useState, useEffect} from "react";
import "./PathFind.css";
import Node from "./Node.jsx";
import Astar from "../astar_algorithm/astar";
import Header from "./Header.jsx"

const rows = 20;
const cols = 35;
const NODE_START_X = 0;
const NODE_START_Y = 0;
const NODE_END_X = cols-1;
const NODE_END_Y = rows-1;

const PathFind = () =>{
    
    const [grid, setgrid] = useState([]);
    const [path, setpath] = useState([]);
    const [visited, setvisited] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    useEffect(()=>{createGrid();}, []);

    const createGrid = (randomizeFactor = 0) =>{
        setvisited([])
        setpath([])
        setgrid([])

        const newGrid = new Array(rows).fill(null).map((_, i) => 
            new Array(cols).fill(null).map((_, j) => new Spot(i, j, randomizeFactor)) 
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
    
    function Spot(i, j, randomizeFactor)
    {
        this.y = i;
        this.x = j;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.isStart = this.x === NODE_START_X && this.y === NODE_START_Y;
        this.isEnd = this.x === NODE_END_X && this.y === NODE_END_Y;
        this.isWall = false;

        
        if(randomizeFactor>0){
            if(Math.random(1)<randomizeFactor)
            {
                this.isWall = true;
            }
        }
        

        if(this.isStart || this.isEnd){
            this.isWall = false;
        }

        this.neighbors = [];
        this.parent = undefined;
        this.addneighbors = function(grid)
        {
            this.neighbors = [];
            let j = this.x;
            let i = this.y;

            if(i>0) this.neighbors.push(grid[i-1][j]);
            if(j>0) this.neighbors.push(grid[i][j-1]);
            if(i<rows-1) this.neighbors.push(grid[i+1][j]);
            if(j<cols-1) this.neighbors.push(grid[i][j+1]);

        }
    }

    const newGridWithWallToggle = (grid, row, col) => {
        // Deep copy the grid
        const newGrid = grid.map(innerRow => [...innerRow]);
    
        const oldNode = newGrid[row][col];
        if (oldNode.isStart || oldNode.isEnd) return newGrid; // Prevent modifying start/end node
    
        const newNode = { ...oldNode, isWall: !oldNode.isWall }; 
        newGrid[row][col] = newNode;
        addNeighbors(newGrid);
        return newGrid;
    };

    const handleMouseDown = (row, col) => {
        setMouseIsPressed(true)
        const newGrid = newGridWithWallToggle(grid, row, col)
        setgrid(newGrid)
    }

    const handleMouseEnter = (row, col) => {
        if(mouseIsPressed) {
            const newGrid = newGridWithWallToggle(grid, row, col)
            setgrid(newGrid)
        }
    }

    const handleMouseUp = () => {
        setMouseIsPressed(false)
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
                                    mouseIsPressed = {mouseIsPressed}
                                    onMouseDown = {handleMouseDown}
                                    onMouseEnter = {handleMouseEnter}
                                    onMouseUp = {handleMouseUp}
                                    grid = {grid}
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
        }, 40);
    };

    const visualizePath = () => {
        if (!grid.length) return;
        
        for(var i=0; i<rows; i++)
        {
            for (var j=0; j<cols; j++)
            {
                console.log(`node ${i}-${j} is wall = ${grid[i][j].isWall}`);
                const neighbors = grid[i][j].neighbors;
                for(var k=0; k<neighbors.length; k++){
                    console.log(`neighbor ${neighbors[k].y}-${neighbors[k].x} iswall: ${neighbors[k].isWall}`)
                }
            }
        }

        const startNode = grid[NODE_START_Y][NODE_START_X];
        const endNode = grid[NODE_END_Y][NODE_END_X];
        let pathResult = Astar(startNode, endNode);
    
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
        }, 15);
    };
    
    const randomizeHandler = () =>{
        createGrid(0.2);
    }

    const resetHandler = () => {
        createGrid(0);
    }

    console.log(`Path: ${path}`);
    console.log(`Visited: ${visited}`);
    return(
        <div className="path-find-container">
            <Header onVisualizePath={visualizePath} onResetGrid={resetHandler} grid={grid} onRandomize={randomizeHandler}></Header>
            <div className="grid-wrapper">
                {GridWithNode}           
            </div>
        </div>

        
    )

    
}

export default PathFind;