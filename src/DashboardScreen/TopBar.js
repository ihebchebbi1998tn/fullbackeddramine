import React from 'react';

const TopBar = () => {
    // Logout function to clear user from local storage and redirect
  
    return (
        <nav className="navbar navbar-default navbar-fixed">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="/app/">Accueil</a>
                </div>
            </div>
        </nav>
    );
};

export default TopBar;
