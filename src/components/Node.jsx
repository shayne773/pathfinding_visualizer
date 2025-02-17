import "./Node.css";
import React from "react";

const Node = ({ isStart, isEnd, row, col, isWall, isVisited, isPath }) => {
    const classes = `
        node
        ${isStart ? "node-start" : ""}
        ${isEnd ? "node-end" : ""}
        ${isWall ? "isWall" : ""}
        ${isVisited ? "node-visited" : ""}
        ${isPath ? "node-shortest-path" : ""}
    `.trim();

    return (
        <div className={classes} id={`node-${row}-${col}`}></div>
    );
};

export default Node;