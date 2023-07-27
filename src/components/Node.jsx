import "./Node.css";
import React from "react";

const Node = ({isStart, isEnd, row, col, isWall}) =>{
    const classes = isStart ? "node-start" : isEnd ? "node-end" : isWall ? "isWall" : "";
    return (
        <div className={`node ${classes}`} id={`node-${row}-${col}`}></div>
    )
}

export default Node;