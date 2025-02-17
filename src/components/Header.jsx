import React from "react";
import "./Header.css";

const Header = ({onVisualizePath, onAddWeights, onSelectAlgorithm, onResetGrid }) => {
  return (
    <div className="header">
      <h1 >Pathfinding Visualizer</h1>
      <div className="buttons">
        <button onClick={onVisualizePath}>
            Visualize Path
        </button>
        <button onClick={onAddWeights}>Add Weights</button>
        <select onChange={(e) => onSelectAlgorithm(e.target.value)}>
          <option value="" disabled selected>Select Algorithm</option>
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="a-star">A* Search</option>
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
        </select>
        <button onClick={onResetGrid}>Reset Grid</button>
      </div>
    </div>
  );
};

export default Header;