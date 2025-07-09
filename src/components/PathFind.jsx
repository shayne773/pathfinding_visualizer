import React, {useState, useEffect} from "react";
import "./PathFind.css";
import Node from "./Node.jsx";
import Astar from "../algorithms/astar";
import Header from "./Header.jsx"
import Bfs from "../algorithms/bfs";
import Dijkstra from "../algorithms/dijkstra";
import Dfs from "../algorithms/dfs";

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
    const [isAddWeights, setIsAddWeights] = useState(false);
    const [isAddWalls, setIsAddWalls] = useState(false);
    const [isMoveStart, setIsMoveStart] = useState(false);
    const [isMoveEnd, setIsMoveEnd] = useState(false);
    const [endX, setEndX] = useState(cols-1);
    const [endY, setEndY] = useState(rows-1);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [lastToggledCell, setLastToggledCell] = useState(null); //make sure that the same cell is not toggled multiple times in a row (only toggle after leaving the cell)
    const [algorithm, setAlgorithm] = useState("a-star"); //default algorithm is A*
    const [selectedMode, setSelectedMode] = useState("");

    useEffect(()=>{createGrid();}, []);

    const createGrid = (randomizeFactor = 0) =>{
        setvisited([])
        setpath([])
        setgrid([])
        setIsAddWalls(false)
        setIsAddWeights(false)

        const newGrid = new Array(rows).fill(null).map((_, i) => 
            new Array(cols).fill(null).map((_, j) => new Spot(i, j, randomizeFactor, 1)) 
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
    
    function Spot(i, j, randomizeFactor, weight)
    {
        this.y = i;
        this.x = j;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.isStart = this.x === startX && this.y === startY;
        this.isEnd = this.x === endX && this.y === endY;
        this.isWall = false;
        this.weight = weight;
        
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

    const newGridWithWeightsToggle = (grid, row, col) => {
        const newGrid = grid.map(innterRow => [...innterRow])
        const oldNode = newGrid[row][col]
        if(oldNode.isStart || oldNode.isEnd) return newGrid;

        const newNode = {...oldNode, weight: 2};
        newGrid[row][col] = newNode;
        addNeighbors(newGrid);
        return newGrid;
    }


    
    const newGridWithStartToggle = (grid, row, col, oldStartX, oldStartY) => {
        
        const newGrid = grid.map(innerRow => 
            innerRow.map(node => ({
                ...node,
                g: 0,
                h: 0,
                f: 0,
                parent: undefined, // Reset parent reference
                isVisited: false, // Reset visited status
                isPath: false, // Reset path highlight
                isWall: node.isWall
            }))
        );
    
        const oldStartNode = newGrid[oldStartY][oldStartX];
        const oldNode = newGrid[row][col];
        
        // Update new start node
        const newNode = { 
            ...oldNode, 
            isStart: true, 
            isWall: false 
        };
    
        // Reset old start node
        const newOldStartNode = { 
            ...oldStartNode, 
            isStart: false, 
        };
    
        newGrid[row][col] = newNode;
        newGrid[oldStartY][oldStartX] = newOldStartNode;
    
        setStartX(col);
        setStartY(row);
    
        addNeighbors(newGrid);
        return newGrid;
    };
    

    const newGridWithEndToggle = (grid, row, col, oldEndX, oldEndY) => {
        const newGrid = grid.map(innerRow => 
            innerRow.map(node => ({
                ...node,
                g: 0,
                h: 0,
                f: 0,
                parent: undefined, // Reset parent reference
                isVisited: false, // Reset visited status
                isPath: false, // Reset path highlight
            }))
        );
    
        const oldEndNode = newGrid[oldEndY][oldEndX];
        const oldNode = newGrid[row][col];
    
        // Update new end node
        const newNode = { 
            ...oldNode, 
            isEnd: true, 
            isWall: false 
        };
    
        // Reset old end node
        const newOldEndNode = { 
            ...oldEndNode, 
            isEnd: false,  
        };
    
        newGrid[row][col] = newNode;
        newGrid[oldEndY][oldEndX] = newOldEndNode;
    
        setEndX(col);
        setEndY(row);
    
        addNeighbors(newGrid);
        return newGrid;
    };
    

    

    const handleMouseDown = (row, col) => {
        setMouseIsPressed(true)
        let newGrid = null
        if(grid[row][col].isEnd){
            setIsMoveEnd(true);
            newGrid = newGridWithEndToggle(grid, row, col, endX, endY);
            setgrid(newGrid);
            visualizePathInstant(grid, startY, startX, row, col);
            return;
        }
        else if(grid[row][col].isStart){
            setIsMoveStart(true);
            newGrid = newGridWithStartToggle(grid, row, col, startX, startY);
            setgrid(newGrid);
            visualizePathInstant(grid, row, col, endY, endX);
            return;
        }
        else if(isAddWalls){
            newGrid = newGridWithWallToggle(grid, row, col);
            setgrid(newGrid)
            return;
        }
        else if(isAddWeights){
            newGrid = newGridWithWeightsToggle(grid, row, col);
            setgrid(newGrid)
            return;
        }
        
    }

    const handleMouseEnter = (row, col) => {
        if(mouseIsPressed) {
            let newGrid = null
            
            // Prevent toggling the same cell multiple times in a row
            if (lastToggledCell && lastToggledCell.row === row && lastToggledCell.col === col) return;
            setLastToggledCell({ row, col });

            if(isMoveEnd && !grid[row][col].isWall){
                newGrid = newGridWithEndToggle(grid, row, col, endX, endY);
                setgrid(newGrid);
                visualizePathInstant(grid, row, col, startY, startX);
                return;
            }
            else if(isMoveStart && !grid[row][col].isWall){
                newGrid = newGridWithStartToggle(grid, row, col, startX, startY);
                setgrid(newGrid);
                visualizePathInstant(grid, row, col, endY, endX);
                return;
                
            }  
            else if(isAddWalls && !isMoveEnd && !isMoveStart){
                newGrid = newGridWithWallToggle(grid, row, col);
                setgrid(newGrid);
            }
            else if(isAddWeights && !isMoveEnd && !isMoveStart){
                newGrid = newGridWithWeightsToggle(grid, row, col);
                setgrid(newGrid);
            }
            
            
            
        }
    }

    const handleMouseUp = () => {
        setMouseIsPressed(false)
        setIsMoveStart(false)
        setIsMoveEnd(false)
    }

    const GridWithNode = (
        <div>
            {grid.map((row, rowInd) => {
                return (
                    <div className="row-wrapper" key={rowInd}>
                        {row.map((col, colInd) => {
                            const { isStart, isEnd, isWall, weight} = col;
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
                                    weight={weight}
                                    row={rowInd}
                                    col={colInd}
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

    const clearParents = (grid) => {
        for (let row of grid) {
            for (let node of row) {
                node.parent = null;
                node.g = 0;
                node.h = 0;
                node.f = 0;
            }
        }
    }

    const visualizePath = () => {
        if (!grid.length) return;
        
        setvisited([]);
        setpath([]);
        setSelectedMode("visualize");
        clearParents(grid);
        const startNode = grid[startY][startX];
        const endNode = grid[endY][endX];

        let pathResult = null;
        if(algorithm === "bfs") pathResult = Bfs(startNode, endNode);
        else if(algorithm === "a-star") pathResult = Astar(startNode, endNode);
        else if(algorithm === "dijkstra") pathResult = Dijkstra(startNode, endNode);
        else if(algorithm === "dfs") pathResult = Dfs(startNode, endNode);

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
    
    
    const visualizePathInstant = (grid, startRow, startCol, endRow, endCol) => {

        if (!grid.length) return;
        setvisited([])
        setpath([])
        clearParents(grid);
        const startNode = grid[startRow][startCol];
        const endNode = grid[endRow][endCol];
        
        let pathResult = null;

        if(algorithm === "bfs") pathResult = Bfs(startNode, endNode);
        else if(algorithm === "a-star") pathResult = Astar(startNode, endNode);
        else if(algorithm === "dijkstra") pathResult = Dijkstra(startNode, endNode);
        else if(algorithm === "dfs") pathResult = Dfs(startNode, endNode);

        setvisited(pathResult.visited);
        setpath(pathResult.path);

    }
    
    const randomizeHandler = () =>{
        createGrid(0.2);
        setSelectedMode("randomize");
    }

    const resetHandler = () => {
        createGrid(0);
        setSelectedMode("reset");
    }

    const addWeightsHandler = () => {
        setIsAddWeights(true)
        setIsMoveStart(false)
        setIsAddWalls(false)
        setIsMoveEnd(false)
        setSelectedMode("add-weight");
    }

    const addWallsHandler = () => {
        setIsAddWalls(true)
        setIsAddWeights(false)
        setIsMoveStart(false)
        setIsMoveEnd(false)
        setSelectedMode("add-wall");
    }

    const selectAlgorithmHandler = (algorithm) => {
        setAlgorithm(algorithm);
        if(algorithm === "bfs") {
            console.log("BFS selected");
        } else if(algorithm === "a-star") {
            console.log("A* selected");
        } else if(algorithm === "dijkstra") {
            console.log("Dijkstra selected");
        } else {
            console.log("Unknown algorithm selected");
        }
    }

    return(
        <div className="path-find-container">
            <Header onVisualizePath={visualizePath} onResetGrid={resetHandler} grid={grid} onRandomize={randomizeHandler} onAddWeights={addWeightsHandler} onAddWalls={addWallsHandler} onSelectAlgorithm={selectAlgorithmHandler} selectedMode={selectedMode}></Header>
            <div className="grid-wrapper">
                {GridWithNode}
            </div>
        </div>

        
    )

    
}

export default PathFind;