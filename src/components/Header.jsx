import React from "react";
import "./Header.css";

const Header = ({onVisualizePath, onAddWeights, onSelectAlgorithm, onResetGrid, onRandomize, onAddWalls, selectedMode}) => {

  return (
    <div className="header">
      <h1 >Pathfinding Visualizer</h1>
      <div className="buttons">
        <button onClick={onVisualizePath} className={selectedMode === "visualize" ? "selected" : ""}>
            Visualize Path
        </button>
        <button onClick={onAddWeights} className={selectedMode === "add-weight" ? "selected" : ""}>Add Weights</button>
        <button onClick={onAddWalls} className={selectedMode === "add-wall" ? "selected" : ""}>Add Walls</button>
        <select onChange={(e) => onSelectAlgorithm(e.target.value)}>
          <option value="" disabled selected>Select Algorithm</option>
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="a-star">A* Search</option>
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
        </select>
        <button onClick={onResetGrid} className={selectedMode === "reset" ? "selected" : ""}>Reset Grid</button>
        <button onClick={onRandomize} className={selectedMode === "randomize" ? "selected" : ""}>Randomize Grid</button>
      </div>
    </div>
  );
};

export default Header;