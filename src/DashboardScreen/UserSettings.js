import React, { useState } from 'react';
import Modal from './Modal'; // Adjust the import path as necessary
import axios from 'axios';
import './Settings.css'; // Add your styles here

const UserSettings = ({ user }) => {
    const [userData, setUser] = useState({
        id_client: user.id,
        email_client: user.email,
        nom_client: user.nom,
        prenom_client: user.prenom,
        telephone_client: user.phone,
        passe: '',
        passe2: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const logUploadEvent = async (nom) => {
        try {
            await axios.post('https://plateform.draminesaid.com/app/data_logs.php', {
                id_log: 'uniqueLogId',
                text_log: nom + 'a changé ses informations',
                date_log: new Date().toISOString(),
                user_log: user.email,
                type_log: 'compte',
            });
        } catch (err) {
            console.error('Failed to log the event:', err);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (userData.passe !== userData.passe2) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        // Show modal confirmation
        setModalMessage('Voulez-vous vraiment modifier vos informations ?');
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        setIsModalOpen(false);

        try {
            const response = await fetch('https://plateform.draminesaid.com/app/modify_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_client: userData.id_client,
                    nom_client: userData.nom_client,
                    prenom_client: userData.prenom_client,
                    email_client: userData.email_client,
                    password_client: userData.passe,
                    telephone_client: userData.telephone_client,
                }),
            });

            const result = await response.json();
            if (result.success) {
                logUploadEvent(userData.nom_client);
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
            } else {
                alert(`Erreur: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Une erreur est survenue lors de la mise à jour du profil.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="header">
                                <h4 className="title">Modifier le Profil</h4>
                            </div>
                            <div className="content">
                                {showSuccessAlert && (
                                    <div className="alert alert-success" role="alert">
                                        Profil mis à jour avec succès!
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="email">Adresse e-mail</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email_client"
                                                    placeholder="Email"
                                                    value={userData.email_client} // Update this line
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Prénom</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="prenom_client"
                                                    placeholder="Prénom"
                                                    value={userData.prenom_client} // Update this line
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Nom de famille</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="nom_client"
                                                    placeholder="Nom de famille"
                                                    value={userData.nom_client} // Update this line
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label>Téléphone</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="telephone_client"
                                                    placeholder="Téléphone"
                                                    value={userData.telephone_client} // Update this line
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Nouveau Mot de passe</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="passe"
                                                    placeholder="Mot de passe"
                                                    value={userData.passe} // Update this line
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Confirmer nouveau mot de passe</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    name="passe2"
                                                    placeholder="Mot de passe"
                                                    value={userData.passe2} // Update this line
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn  pull-right custom-button">
    Mettre à jour le Profil
</button>
                                    <div className="clearfix"></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    action="modified"
                    message={modalMessage}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default UserSettings;
