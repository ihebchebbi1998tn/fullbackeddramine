import React, { useState } from 'react';
import './allowermodal.css'; // Add your styles here

const chapters = [
    { id: 1, name: 'Chapitre 1' },
    { id: 2, name: 'Chapitre 2' },
    { id: 3, name: 'Chapitre 3' },
];

const AllowerModal = ({ userId, isOpen, onClose }) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedChapters, setSelectedChapters] = useState([]);

    // Toggle selection of chapters
    const handleChapterSelection = (chapterId) => {
        setSelectedChapters((prev) =>
            prev.includes(chapterId)
                ? prev.filter((id) => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    // Handle allocation logic here
    const handleAllocation = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://plateform.draminesaid.com/app/allocation.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    chapters: selectedChapters,
                }),
            });
            const data = await response.json();

            if (data.success) {
                setAlertMessage('Utilisateur a été alloué avec succès!');
            } else {
                setAlertMessage(data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error("Error during allocation:", error);
            setAlertMessage("Erreur lors de l'allocation. Veuillez réessayer.");
        } finally {
            setLoading(false);
            setShowAlert(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div id="allomodaldesign">
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Allouer Utilisateur</h3>
                <p>Choisissez les chapitres auxquels cette utilisateur aura accès :</p>

                <div className="chapter-selection">
                    {chapters.map((chapter) => (
                        <label key={chapter.id} className="chapter-option">
                            <input
                                type="checkbox"
                                checked={selectedChapters.includes(chapter.id)}
                                onChange={() => handleChapterSelection(chapter.id)}
                            />
                            {chapter.name}
                        </label>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="btn btn-primary" onClick={handleAllocation} disabled={loading || selectedChapters.length === 0}>
                        {loading ? 'En cours...' : "Confirmer l'allocation"}
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Fermer
                    </button>
                </div>

                {showAlert && (
                    <div className="alert-message">
                        <p>{alertMessage}</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default AllowerModal;
