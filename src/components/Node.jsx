import "./Node.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWeightHanging } from "@fortawesome/free-solid-svg-icons";

const Node = ({ isStart, isEnd, row, col, isWall, isVisited, isPath, onMouseDown, onMouseEnter, onMouseUp, weight, colors}) => {
    
    
    const classes = `
        node
        ${isStart ? "node-start" : ""}
        ${isEnd ? "node-end" : ""}
        ${isWall ? !isStart && !isEnd ? "isWall" : "" : ""}
        ${isVisited && !isStart && !isEnd ? "node-visited" : ""}
        ${isPath && !isStart && !isEnd ? "node-shortest-path" : ""}
        ${weight > 1 ? "node-weight" : ""}
    `.trim();

    let style = {};
    if (isStart) style.backgroundColor = colors.start;
    else if (isEnd) style.backgroundColor = colors.end;
    else if (isWall) style.backgroundColor = colors.wall;
    else if (isVisited) style.backgroundColor = colors.visited;
    else if (isPath) style.backgroundColor = colors.path;

    return (
        <div className={classes}
            style={style}
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