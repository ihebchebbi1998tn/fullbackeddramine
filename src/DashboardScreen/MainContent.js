import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Modal from './Modal';
import './Content.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MainContent = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const videosPerPage = 6;
    const connectedUserId = user.id;

    useEffect(() => {
        if (!user) {
            window.location.href = '/'; // Redirects the user to the home page
        }
    }, [user]);
    

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://plateform.draminesaid.com/app/get_videos.php?key=3845755');
            if (response.data.success) {
                const formattedVideos = response.data.data.map(video => ({
                    id: video.id_video,
                    title: video.name_video,
                    description: video.descri_video,
                    videoUrl: `https://plateform.draminesaid.com/app/${video.url_video}`,
                    thumbnail: `https://plateform.draminesaid.com/app/${video.url_thumbnail}`
                }));
                setVideos(formattedVideos);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError(error.message || 'Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    const handleDeleteVideo = async () => {
        try {
            const response = await axios.post('https://plateform.draminesaid.com/app/delete_video.php', {
                key: '3845755',
                id_video: videoToDelete
            });
            if (response.data.success) {
                fetchVideos();
                alert('Vidéo supprimée avec succès !');
            } else {
                alert('Error deleting video: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        } finally {
            setShowModal(false);
            setVideoToDelete(null);
        }
    };

    const openDeleteModal = (id) => {
        setVideoToDelete(id);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setShowModal(false);
        setVideoToDelete(null);
    };

    return (
        <div className="content">
            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Chargement des vidéos...</p>
                </div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Rechercher des vidéos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="video-grid">
                        {currentVideos.map((video) => (
                            <div className="video-card" key={video.id} onClick={() => handleVideoClick(video)}>
                                <div className="thumbnail-container">
                                    <img src={video.thumbnail} alt={video.title} className="thumbnail" />
                                    {connectedUserId === 1 && (
                                        <button 
                                            className="delete-button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteModal(video.id);
                                            }}
                                            title="Supprimer la vidéo"
                                        >
                                            <i className="bi bi-x-circle"></i>
                                        </button>
                                    )}
                                </div>
                                <div className="video-details">
                                    <h5>{video.title}</h5>
                                    <p>{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {selectedVideo && (
                        <div className="video-overlay" onClick={handleCloseVideo} onContextMenu={(e) => e.preventDefault()}>
                            <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
                                <ReactPlayer
                                    url={selectedVideo.videoUrl}
                                    controls
                                    playing
                                    width="100%"
                                    height="100%"
                                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                                />
                            </div>
                        </div>
                    )}

                    {showModal && (
                        <Modal 
                            action="supprimer"
                            message="Cette vidéo sera supprimée définitivement. Voulez-vous continuer ?" 
                            onConfirm={handleDeleteVideo} 
                            onCancel={closeDeleteModal} 
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default MainContent;
