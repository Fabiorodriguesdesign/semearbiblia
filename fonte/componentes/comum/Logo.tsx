import React from 'react';

const Logo = ({ width = 60, height = 60, color = 'currentColor' }) => (
    <div className="logo-container" style={{ width: `${width}px`, height: `${height}px`, color: color }}>
        <i className="material-icons" style={{ fontSize: `${Math.min(width, height) * 0.9}px` }}>
            spa
        </i>
    </div>
);

export default Logo;
