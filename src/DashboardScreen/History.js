import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = ({user}) => {
  const [accountHistoryData, setAccountHistoryData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if (user.role !== 'admin') {
        window.location.href = '/'; // Redirects the user to the home page
    }
}, [user.role]);

  const fetchLogs = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://plateform.draminesaid.com/app/get_logs.php?page=${pageNumber}&limit=10`);
      const newData = response.data.data;

      if (!Array.isArray(newData)) {
        throw new Error("Format de données inattendu reçu.");
      }

      setAccountHistoryData((prevData) => [...prevData, ...newData]);
      setHasMore(newData.length === 10);
      setError(null); // Clear any previous error if fetch is successful
    } catch (err) {
      setError("Une erreur s'est produite lors de la récupération de l'historique.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="content" style={{ maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="header">
                <h4 className="title">Historique du Compte</h4>
                <p className="category">Liste des actions effectuées sur votre compte</p>
              </div>
              <div className="content table-responsive table-full-width">
                {error && <p className="text-danger">{error}</p>}
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Texte</th>
                      <th>Date</th>
                      <th>Utilisateur</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountHistoryData.map((item) => (
                      <tr key={item.id_log}>
                        <td>{item.id_log}</td>
                        <td>{item.text_log}</td>
                        <td>{new Date(item.date_log).toLocaleString()}</td>
                        <td>{item.user_log}</td>
                        <td>{item.type_log}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loading && <p>Chargement...</p>}
              </div>
              <div className="footer">
                {hasMore && !loading && (
                  <button className="btn btn-primary" onClick={loadMore}>
                    Charger plus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
