import "./Node.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWeightHanging } from "@fortawesome/free-solid-svg-icons";

const Node = ({ isStart, isEnd, row, col, isWall, isVisited, isPath, onMouseDown, onMouseEnter, onMouseUp, weight}) => {
    const classes = `
        node
        ${isStart ? "node-start" : ""}
        ${isEnd ? "node-end" : ""}
        ${isWall ? "isWall" : ""}
        ${isVisited ? "node-visited" : ""}
        ${isPath ? "node-shortest-path" : ""}
        ${weight > 1 ? "node-weight" : ""}
    `.trim();

    return (
        <div className={classes}
            id={`node-${row}-${col}`}
            onMouseDown={()=>{onMouseDown(row, col)}}
            onMouseEnter={()=>{onMouseEnter(row, col)}}
            onMouseUp={()=>{onMouseUp()}}>
            {weight > 1 && !isWall && (
                <FontAwesomeIcon icon={faWeightHanging} className="weight-icon" />
            )}
        </div>
    );
};

export default Node;