import React from "react";
import PathFind from "./components/PathFind"
import Header from "./components/Header.jsx"
import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";


const App = () => {
    return(
        <div className="app-container">
            <Sidebar></Sidebar>
            <PathFind></PathFind>
        </div>
        
    )

}

export default App;
