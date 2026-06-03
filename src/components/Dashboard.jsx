import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // TODO: Load submissions for logged-in creator
    setSubmissions([
      { id: 1, product: 'Skincare Serum', status: 'Approved', reward: 25 },
      { id: 2, product: 'Workout Protein', status: 'Pending', reward: 0 }
    ]);
    setEarnings(25);
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Dashboard</h2>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-value">${earnings.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Videos Submitted</h3>
          <p className="stat-value">{submissions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p className="stat-value">{submissions.filter(s => s.status === 'Approved').length}</p>
        </div>
      </div>

      <h3>Your Submissions</h3>
      {submissions.length === 0 ? (
        <p>No submissions yet. Start creating videos to earn!</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Reward</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub.id}>
                <td>{sub.product}</td>
                <td><span className={`status-${sub.status.toLowerCase()}`}>{sub.status}</span></td>
                <td>${sub.reward}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
