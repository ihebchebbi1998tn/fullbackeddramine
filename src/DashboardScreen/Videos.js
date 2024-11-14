import React, { useState, useEffect } from 'react';
import './Videos.css';
import axios from 'axios';
import { BrowserRouter as Navigate } from 'react-router-dom';

const Videos = ({ user }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedMB, setUploadedMB] = useState(0);
    const [totalMB, setTotalMB] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        handleFile(selectedFile);
    };

    useEffect(() => {
        if (user.role !== 'admin') {
            <Navigate to="/" />;
        }
    }, [user.role]);

    const handleFile = (selectedFile) => {
        if (selectedFile && selectedFile.size <= 2147483648) { // Limit of 2 GB
            setVideoFile(selectedFile);
            setTotalMB((selectedFile.size / (1024 * 1024)).toFixed(2)); // Total size in MB
            setError('');
        } else {
            setError('Veuillez sélectionner un fichier vidéo de moins de 2 Go.');
        }
    };

    const handleThumbnailChange = (event) => {
        const selectedThumbnail = event.target.files[0];
        if (selectedThumbnail) {
            setThumbnailFile(selectedThumbnail);
        }
    };

    const handleDrop = (event, type) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        if (type === 'video') {
            handleFile(selectedFile);
        } else if (type === 'thumbnail') {
            setThumbnailFile(selectedFile);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const logUploadEvent = async (video) => {
        try {
            await axios.post('https://plateform.draminesaid.com/app/data_logs.php', {
                id_log: 'uniqueLogId',
                text_log: 'Vidéo ' +video+ ' téléchargée avec succès',
                date_log: new Date().toISOString(),
                user_log: user.email,
                type_log: 'téléchargements',
            });
        } catch (err) {
            console.error('Failed to log the event:', err);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!videoFile || !thumbnailFile) {
            setError('Veuillez sélectionner un fichier vidéo et une miniature à télécharger.');
            return;
        }

        setIsUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('thumbnail', thumbnailFile);
        formData.append('title', title);
        formData.append('description', description);

        try {
            await axios.post('https://plateform.draminesaid.com/app/upload.php', formData, {
                onUploadProgress: (progressEvent) => {
                    const total = progressEvent.total;
                    const current = progressEvent.loaded;
                    const percentCompleted = Math.floor((current * 100) / total);
                    const uploadedMB = (current / (1024 * 1024)).toFixed(2);

                    setUploadProgress(percentCompleted);
                    setUploadedMB(uploadedMB);
                },
            });
            setUploadProgress(90);
            logUploadEvent(title);
            alert('Vidéo téléchargée avec succès !');
            setUploadProgress(100);

        } catch (err) {
            setError("Une erreur s'est produite lors du téléchargement.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow-sm">
                            <div className="header">
                                <h4 className="title">Télécharger une Nouvelle Vidéo</h4>
                            </div>
                            <div className="content">
                                <form onSubmit={handleUpload}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Titre</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Titre de la Vidéo"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    rows="3"
                                                    className="form-control"
                                                    placeholder="Description de la Vidéo"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="drop-zone" onDrop={(e) => handleDrop(e, 'thumbnail')} onDragOver={handleDragOver}>
                                        <input
                                            type="file"
                                            id="thumbnailInput"
                                            className="file-input"
                                            onChange={handleThumbnailChange}
                                            accept="image/*"
                                            hidden
                                        />
                                        <p className="drop-zone-text" onClick={() => document.getElementById('thumbnailInput').click()}>
                                            Glissez-déposez votre miniature ici ou cliquez pour sélectionner une miniature.
                                        </p>
                                        {error && !videoFile && <div className="text-danger mt-2">{error}</div>}
                                        {thumbnailFile && <div className="mt-2">Fichier miniature sélectionné : {thumbnailFile.name}</div>}
                                    </div>
                                    <br />
                                    <div className="drop-zone" onDrop={(e) => handleDrop(e, 'video')} onDragOver={handleDragOver}>
                                        <input
                                            type="file"
                                            id="videoInput"
                                            className="file-input"
                                            onChange={handleFileChange}
                                            accept="video/*"
                                            hidden
                                        />
                                        <p className="drop-zone-text" onClick={() => document.getElementById('videoInput').click()}>
                                            Glissez-déposez votre vidéo ici ou cliquez pour sélectionner un fichier.
                                        </p>
                                        {error && videoFile && <div className="text-danger mt-2">{error}</div>}
                                        {videoFile && <div className="mt-2">Fichier vidéo sélectionné : {videoFile.name}</div>}
                                    </div>

                                    {isUploading && (
                                        <div className="progress mb-3">
                                            <div
                                                className="progress-bar progress-bar-striped progress-bar-animated"
                                                role="progressbar"
                                                style={{ width: `${uploadProgress}%` }}
                                                aria-valuenow={uploadProgress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {uploadProgress}% ({uploadedMB} MB / {totalMB} MB)
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-fill pull-right"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Téléchargement en cours...' : 'Télécharger la Vidéo'}
                                    </button>
                                    <div className="clearfix" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Videos;
