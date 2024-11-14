import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 

const Sidebar = ({ user }) => {
    const location = useLocation(); // Get the current location object

    // Function to check if the link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar" data-color="purple" data-image="assets/img/sidebar-5.png">
            <div className="sidebar-wrapper">
                <div className="logo">
                    <a href="http://www.creative-tim.com" className="simple-text">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/logowhite.png`} alt="Creative Tim Logo" style={{ width: '70%', height: 'auto' }} />
                    </a>
                </div>

                <ul className="nav">
                    <li className={isActive('/') ? 'active' : ''}>
                        <Link to="apipsy/dashboard/"><i className="pe-7s-graph"></i><p>Accueil</p></Link>
                    </li>
                    <li className={isActive('/settings') ? 'active' : ''}>
                        <Link to="apipsy/dashboard/settings"><i className="pe-7s-settings"></i><p>Paramètres</p></Link>
                    </li>
                    <li className={isActive('/history') ? 'active' : ''}>
                        <Link to="apipsy/dashboard/history"><i className="pe-7s-clock"></i><p>Historique</p></Link>
                    </li>

                    {/* Conditionally render Clients link based on user ID */}
                    {user && user.id === '1' && (
                        <li className={isActive('/clients') ? 'active' : ''}>
                            <Link to="apipsy/dashboard/clients"><i className="pe-7s-users"></i><p>Clients</p></Link>
                        </li>
                    )}

                    {/* Conditionally render Videos link based on user ID */}
                    {user && user.id === '1' && (
                        <li className={isActive('/upload') ? 'active' : ''}>
                            <Link to="apipsy/dashboard/upload"><i className="pe-7s-upload"></i><p>Videos</p></Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
