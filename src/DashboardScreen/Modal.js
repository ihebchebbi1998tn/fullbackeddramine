import React from 'react';
import './Modal.css'; // Add your styles here

const Modal = ({ action, message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Êtes-vous sûr ?</h4>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-button">Annuler</button>
                    <button onClick={onConfirm} className="confirm-button">{action}</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
