import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './DashboardScreen/Sidebar';
import MainContent from './DashboardScreen/MainContent';
import TopBar from './DashboardScreen/TopBar';
import UserSettings from './DashboardScreen/UserSettings';
import History from './DashboardScreen/History';
import Clients from './DashboardScreen/Clients';
import Videos from './DashboardScreen/Videos';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));



    const ProtectedRoute = ({ element }) => {
        return user ? element : <Navigate to="https://platform.draminesaid.com/" replace />;
    };

    return (
        <Router>
            <div className="wrapper">
                <Sidebar user={user} />
                <div className="main-panel">
                    <TopBar />
                    <Routes>
                        <Route path="/app/settings" element={<ProtectedRoute element={<UserSettings user={user} />} />} />
                        <Route path="/app/history" element={<ProtectedRoute element={<History user={user} />} />} />
                        <Route path="/app/clients" element={<ProtectedRoute element={<Clients user={user} />} />} />
                        <Route path="/app/upload" element={<ProtectedRoute element={<Videos user={user} />} />} />
                        <Route path="/app/" element={<MainContent user={user} />} exact />
                    </Routes>
                    <footer className="footer">
                        <div className="container-fluid">
                            <nav className="pull-left"></nav>
                            <p className="copyright pull-right">
                                &copy; {new Date().getFullYear()} <a href="http://draminesaid.com">draminesaid.com</a>
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </Router>
    );
};

export default App;
