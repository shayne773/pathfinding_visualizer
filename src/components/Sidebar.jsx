import "./Sidebar.css";
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
function Sidebar({ sidebarOpen, setSidebarOpen, setColors}) {

    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setSidebarOpen(false);
        }, 300);
    }
    return (
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${isClosing ? 'closing' : ''}`}>
            <FaTimes onClick={handleClose} className="close-icon" />
            <h2>Settings</h2>
            <h3>Styles</h3>
            <div className="color-picker">
                Start Node Fill Color
                <div className="color-input-container">
                    <input type="color" className="color-input" onChange={(e)=>setColors(prev=>({...prev, start: e.target.value}))}></input>
                </div>
            </div>
            <div className="color-picker">
                End Node Fill Color
                <div className="color-input-container">
                    <input type="color" className="color-input" onChange={(e)=>setColors(prev=>({...prev, end: e.target.value}))}></input>
                </div>
            </div>
            <div className="color-picker">
                Visited Node Fill Color
                <div className="color-input-container">
                    <input type="color" className="color-input" onChange={(e)=>setColors(prev=>({...prev, visited: e.target.value}))}></input>
                </div>
            </div>
            <div className="color-picker">
                Path Node Fill Color
                <div className="color-input-container">
                    <input type="color" className="color-input" onChange={(e)=>setColors(prev=>({...prev, path: e.target.value}))}></input>
                </div>
            </div>
            <div className="color-picker">
                Wall Node Fill Color
                <div className="color-input-container">
                    <input type="color" className="color-input" onChange={(e)=>setColors(prev=>({...prev, wall: e.target.value}))}></input>
                </div>
            </div>
        </div>
    )

}

export default Sidebar;