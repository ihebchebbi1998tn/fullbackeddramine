import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // Adjust the import path if necessary
import axios from 'axios';
import AllowerModal from './Allowermodal';
const Clients = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAllowerModalOpen, setIsAllowerModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    const key = "38457";

    const logUploadEvent = async (title) => {
        try {
            await axios.post('https://plateform.draminesaid.com/app/data_logs.php', {
                id_log: 'uniqueLogId',
                text_log: title,
                date_log: new Date().toISOString(),
                user_log: user.email,
                type_log: 'compte',
            });
        } catch (err) {
            console.error('Failed to log the event:', err);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://plateform.draminesaid.com/app/get_users.php');
                const data = await response.json();
                if (data.success) {
                    setUsers(data.users);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id_client) => {
        setIsModalOpen(false);
        try {
            const response = await fetch('https://plateform.draminesaid.com/app/delete_user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_client, key }),
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.filter(user => user.id_client !== id_client));
                setAlertMessage('Utilisateur a été supprimé avec succès!');
                logUploadEvent('Utilisateur a été supprimé avec succès');
                setShowAlert(true);
            } else {
                console.error("Failed to delete user:", data.message);
                setAlertMessage(data.message);
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setAlertMessage('Failed to delete user. Please try again.');
            setShowAlert(true);
        }
    };

    const handleActivate = async (id_client, email_client) => {
        setIsModalOpen(false);
        try {
            const response = await fetch('https://plateform.draminesaid.com/app/useractivation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: id_client, key, email_client }),
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.map(user => user.id_client === id_client ? { ...user, status_client: '1' } : user));
                setAlertMessage('Utilisateur a été activé avec succès!');
                logUploadEvent('Utilisateur a été activé avec succès');
                setShowAlert(true);
            } else {
                console.error("Failed to activate user:", data.message);
                setAlertMessage(data.message);
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setAlertMessage('Impossible d\'activer l\'utilisateur. Veuillez réessayer.');
            setShowAlert(true);
        }
    };

    const handleDeActivate = async (id_client) => {
        setIsModalOpen(false);
        try {
            const response = await fetch('https://plateform.draminesaid.com/app/deuseractivation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: id_client, key }),
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.map(user => user.id_client === id_client ? { ...user, status_client: '0' } : user));
                setAlertMessage('Utilisateur a été désactivé avec succès!');
                logUploadEvent('Utilisateur a été désactivé avec succès');
                setShowAlert(true);
            } else {
                console.error("Failed to deactivate user:", data.message);
                setAlertMessage(data.message);
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setAlertMessage('Impossible de désactiver l\'utilisateur. Veuillez réessayer.');
            setShowAlert(true);
        }
    };

    const confirmAction = (id_client, email_client, action) => {
        setSelectedUserId(id_client);
        setSelectedUserEmail(email_client); 
        setActionType(action);
        setIsModalOpen(true);
    };
    
    const openAllowerModal = (id_client) => {
        setSelectedUserId(id_client);
        setIsAllowerModalOpen(true);
    };
    if (loading) {
        return <div>Chargement des utilisateurs...</div>;
    }

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="header">
                                <h4 className="title">User Information</h4>
                                <p className="category">List of registered users</p>
                            </div>
                            <div className="content table-responsive table-full-width">
                                {showAlert && (
                                    <div className="alert alert-success" role="alert">
                                        {alertMessage}
                                    </div>
                                )}
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nom</th>
                                            <th>Prénom</th>
                                            <th>Email</th>
                                            <th>Téléphone</th>
                                            <th>Date de création</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id_client}>
                                                <td>{user.id_client}</td>
                                                <td>{user.nom_client}</td>
                                                <td>{user.prenom_client}</td>
                                                <td>{user.email_client}</td>
                                                <td>{user.telephone_client}</td>
                                                <td>{new Date(user.createdat_client).toLocaleDateString()}</td>
                                                <td>{user.status_client === '1' ? "Active" : "Inactive"}</td>
                                                <td>
                                                    {user.status_client === '0' && (
                                                        <button className="btn btn-success" onClick={() => confirmAction(user.id_client, user.email_client, 'activate')}>
                                                            <i className="pe-7s-check"></i> Activer
                                                        </button>
                                                    )}
                                                    {user.status_client === '1' && (
                                                        <>
                                                            <button className="btn btn-warning" onClick={() => confirmAction(user.id_client, user.email_client, 'deactivate')}>
                                                                <i className="pe-7s-pause"></i> Désactiver
                                                            </button>
                                                            <button className="btn btn-primary" onClick={() => openAllowerModal(user.id_client)}>
                                                                <i className="pe-7s-box2"></i> Allouer
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="btn btn-danger" onClick={() => confirmAction(user.id_client, user.email_client, 'delete')}>
                                                        <i className="pe-7s-delete-user"></i> Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    action={actionType}
                    message={`Êtes-vous sûr de vouloir ${actionType === 'delete' ? 'supprimer' : actionType === 'activate' ? 'activer' : 'désactiver'} cet utilisateur?`}
                    onConfirm={() => {
                        if (actionType === 'activate') {
                            handleActivate(selectedUserId, selectedUserEmail); 
                        } else if (actionType === 'deactivate') {
                            handleDeActivate(selectedUserId);
                        } else if (actionType === 'delete') {
                            handleDelete(selectedUserId);
                        }
                    }}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

{isAllowerModalOpen && (
    <AllowerModal 
        userId={selectedUserId}
        isOpen={isAllowerModalOpen}
        onClose={() => setIsAllowerModalOpen(false)}
    />
)}
        </div>
    );
};

export default Clients;
