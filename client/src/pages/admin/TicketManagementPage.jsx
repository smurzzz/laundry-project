import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { toast } from 'react-toastify';

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/support-tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      setLoading(false);
    }
  };

  const handleAddMessage = async (ticketId) => {
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/support-tickets/${ticketId}/message`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` } }
      );
      setSelectedTicket(response.data);
      setNewMessage('');
      fetchTickets();
    } catch (error) {
      toast.error('Failed to add message');
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/support-tickets/${ticketId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` } }
      );
      fetchTickets();
      toast.success('Ticket updated');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Ticket Management</h2>
        <p className="text-slate-600 dark:text-slate-400">Handle customer support requests</p>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              filter === status
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && ` (${tickets.filter((t) => t.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">No tickets found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`bg-white dark:bg-slate-800 rounded-lg border ${
                selectedTicket?._id === ticket._id
                  ? 'border-sky-500 dark:border-sky-500'
                  : 'border-slate-200 dark:border-slate-700'
              } p-4 cursor-pointer transition`}
              onClick={() => setSelectedTicket(selectedTicket?._id === ticket._id ? null : ticket)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{ticket.subject}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    From: {ticket.user?.name} ({ticket.user?.email})
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>

              {selectedTicket?._id === ticket._id && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  {/* Ticket Details */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Category</p>
                    <p className="font-medium text-slate-900 dark:text-white capitalize">{ticket.category}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Description</p>
                    <p className="text-slate-900 dark:text-white">{ticket.description}</p>
                  </div>

                  {/* Messages */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Conversation</p>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 max-h-64 overflow-y-auto space-y-4">
                      {ticket.messages?.length === 0 ? (
                        <p className="text-sm text-slate-600 dark:text-slate-400">No messages yet</p>
                      ) : (
                        ticket.messages?.map((msg, idx) => (
                          <div key={idx} className="border-b border-slate-200 dark:border-slate-600 pb-3 last:border-0">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{msg.sender?.name || 'Admin'}</p>
                            <p className="text-sm text-slate-900 dark:text-white mt-1">{msg.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Status Update & Message */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Change Status</label>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {ticket.status !== 'closed' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Add Reply</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your response..."
                            className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddMessage(ticket._id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddMessage(ticket._id)}
                            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketManagementPage;

