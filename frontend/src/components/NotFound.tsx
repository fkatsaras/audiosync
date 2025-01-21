import React from "react";
import "../styles/NotFound.css"

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1>Something went wrong!</h1>
                <p>Sorry, the page you're looking for doesn't exist.</p>
            </div>
        </div>
    );
};

export default NotFound;