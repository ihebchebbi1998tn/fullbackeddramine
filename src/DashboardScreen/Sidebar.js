import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useEffect } from 'react';
const Sidebar = ({ user }) => {
    const location = useLocation(); 
    const isActive = (path) => location.pathname === path;
    const handleLogout = () => {
        localStorage.removeItem('user'); 
        window.location.href = 'https://plateform.draminesaid.com/'; 
    };

    useEffect(() => {
        if (!user) {
            window.location.href = 'https://plateform.draminesaid.com/'; // Redirects the user to the home page
        }
    }, [user]);
    
    return (
        <div className="sidebar" data-color="purple" data-image="assets/img/sidebar-5.png">
            <div className="sidebar-wrapper">
                <div className="logo">
                    <a href="http://www.draminesaid.com" className="simple-text">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/logowhite.png`} alt="Creative Tim Logo" style={{ width: '80%', height: 'auto' }} />
                    </a>
                </div>

                <ul className="nav">
                    <li className={isActive('/') ? 'active' : ''}>
                        <Link to="/app/"><i className="pe-7s-graph"></i><p>Accueil</p></Link>
                    </li>
                    <li className={isActive('/settings') ? 'active' : ''}>
                        <Link to="/app/settings"><i className="pe-7s-settings"></i><p>Paramètres</p></Link>
                    </li>
                {/*     <li className={isActive('/history') ? 'active' : ''}>
                        <Link to="/app/history"><i className="pe-7s-clock"></i><p>Historique</p></Link>
                    </li> */}

                    {user && user.id === 1 && (
                        <li className={isActive('/clients') ? 'active' : ''}>
                            <Link to="/app/clients"><i className="pe-7s-users"></i><p>Clients</p></Link>
                        </li>
                    )}

                    {user && user.id === 1 && (
                        <li className={isActive('/upload') ? 'active' : ''}>
                            <Link to="/app/upload"><i className="pe-7s-upload"></i><p>Videos</p></Link>
                        </li>
                    )}
                       <li>
                        <Link onClick={handleLogout}><i className="pe-7s-close"></i><p>Déconnection</p></Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
