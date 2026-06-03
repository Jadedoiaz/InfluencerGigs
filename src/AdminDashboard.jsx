import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, DollarSign, Eye, EyeOff, TrendingUp, Users, Video } from 'lucide-react';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showRewardInput, setShowRewardInput] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalEarnings: 0
  });

  // Fetch submissions on mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://influencer-gig-api-production.up.railway.app/api/submissions', {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      // Calculate stats
      const pending = data.filter(s => s.Status === 'Pending Review').length;
      const approved = data.filter(s => s.Status === 'Approved').length;
      const rejected = data.filter(s => s.Status === 'Rejected').length;
      const totalEarnings = data
        .filter(s => s.Status === 'Approved')
        .reduce((sum, s) => sum + (s['Reward Amount'] || 0), 0);

      setSubmissions(data);
      setStats({ pending, approved, rejected, totalEarnings });
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission || !rewardAmount) {
      alert('Please enter a reward amount');
      return;
    }

    try {
      const response = await fetch(
        'https://influencer-gig-api-production.up.railway.app/api/admin/approve-submission',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submissionId: selectedSubmission.id,
            influencerId: selectedSubmission.Influencer?.[0] || '',
            rewardAmount: parseFloat(rewardAmount)
          })
        }
      );

      if (response.ok) {
        alert('✅ Video approved and payment initiated!');
        setShowRewardInput(false);
        setRewardAmount('');
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        alert('❌ Failed to approve submission');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    try {
      // Update submission status to Rejected
      const response = await fetch(
        `https://influencer-gig-api-production.up.railway.app/api/submissions/${selectedSubmission.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Status: 'Rejected' })
        }
      );

      if (response.ok) {
        alert('❌ Video rejected');
        setSelectedSubmission(null);
        fetchSubmissions();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'pending') return sub.Status === 'Pending Review';
    if (filter === 'approved') return sub.Status === 'Approved';
    if (filter === 'rejected') return sub.Status === 'Rejected';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage submissions & creator payouts</p>
          </div>
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-blue-100">{stats.pending}</p>
              </div>
              <Video className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-100">{stats.approved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-100">{stats.rejected}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold text-purple-100">${stats.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
          {['pending', 'approved', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map(submission => (
            <div
              key={submission.id}
              className="group bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition cursor-pointer"
              onClick={() => setSelectedSubmission(submission)}
            >
              {/* Video Thumbnail */}
              <div className="w-full aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                <Video className="w-12 h-12 text-slate-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-purple-900/30 transition" />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                  {submission['Submission ID']}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500">Reward:</span> ${submission['Reward Amount']?.toFixed(2) || 'TBD'}
                  </p>
                  <p className="text-sm text-slate-300">
                    <span className="text-slate-500">Status:</span>{' '}
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      submission.Status === 'Pending Review' ? 'bg-yellow-900/50 text-yellow-200' :
                      submission.Status === 'Approved' ? 'bg-green-900/50 text-green-200' :
                      'bg-red-900/50 text-red-200'
                    }`}>
                      {submission.Status}
                    </span>
                  </p>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedSubmission(submission);
                  }}
                  className="w-full px-3 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 rounded text-sm font-medium transition"
                >
                  {submission.Status === 'Pending Review' ? '⚡ Review' : '👁️ View'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              {/* Modal Header */}
              <div className="sticky top-0 border-b border-slate-700 bg-slate-800/90 p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Submission Details</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Video URL</label>
                  <a
                    href={selectedSubmission['Video URL']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-all"
                  >
                    🎬 {selectedSubmission['Video URL']}
                  </a>
                </div>

                {/* Submission ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Submission ID</label>
                  <p className="text-white font-mono">{selectedSubmission['Submission ID']}</p>
                </div>

                {/* Caption */}
                {selectedSubmission.Caption && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Caption</label>
                    <p className="text-slate-300">{selectedSubmission.Caption}</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
                  <p className={`inline-block px-3 py-1 rounded font-medium ${
                    selectedSubmission.Status === 'Pending Review' ? 'bg-yellow-900/50 text-yellow-200' :
                    selectedSubmission.Status === 'Approved' ? 'bg-green-900/50 text-green-200' :
                    'bg-red-900/50 text-red-200'
                  }`}>
                    {selectedSubmission.Status}
                  </p>
                </div>

                {/* Reward Amount */}
                {selectedSubmission.Status === 'Pending Review' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Reward Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rewardAmount}
                      onChange={e => setRewardAmount(e.target.value)}
                      placeholder="e.g., 25.00"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                {selectedSubmission.Status === 'Pending Review' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleApprove}
                      disabled={!rewardAmount}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" /> Approve & Pay
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
