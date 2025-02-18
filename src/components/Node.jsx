import "./Node.css";
import React from "react";

const Node = ({ isStart, isEnd, row, col, isWall, isVisited, isPath, mouseIsPressed, onMouseDown, onMouseEnter, onMouseUp}) => {
    const classes = `
        node
        ${isStart ? "node-start" : ""}
        ${isEnd ? "node-end" : ""}
        ${isWall ? "isWall" : ""}
        ${isVisited ? "node-visited" : ""}
        ${isPath ? "node-shortest-path" : ""}
    `.trim();

    return (
        <div className={classes}
            id={`node-${row}-${col}`}
            onMouseDown={()=>{onMouseDown(row, col)}}
            onMouseEnter={()=>{onMouseEnter(row, col)}}
            onMouseUp={()=>{onMouseUp()}}></div>
    );
};

export default Node;