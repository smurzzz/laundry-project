import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { toast } from 'react-toastify';

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'other',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/support-tickets/my-tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      setTickets(response.data.tickets || response.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE_URL + '/support-tickets', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('cw_token')}` },
      });
      toast.success('Ticket created');
      setFormData({ subject: '', description: '', category: 'other' });
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      toast.error('Failed to create ticket');
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
      toast.success('Message added');
    } catch (error) {
      toast.error('Failed to add message');
    }
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Support Tickets</h2>
          <p className="text-slate-600 dark:text-slate-400">Get help with your orders</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition"
        >
          New Ticket
        </button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create Support Ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="other">Other</option>
                <option value="payment">Payment Issue</option>
                <option value="service">Service Issue</option>
                <option value="delivery">Delivery Issue</option>
                <option value="quality">Quality Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition">
                Create Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">No support tickets yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedTicket(selectedTicket?._id === ticket._id ? null : ticket)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{ticket.subject}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">#{ticket._id?.slice(-6)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status] || 'bg-gray-100'}`}>
                  {ticket.status}
                </span>
              </div>

              {selectedTicket?._id === ticket._id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{ticket.description}</p>

                  {/* Messages */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
                    {ticket.messages?.map((msg, idx) => (
                      <div key={idx} className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-600 last:border-0">
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{msg.sender?.name || 'Admin'}</p>
                        <p className="text-sm text-slate-900 dark:text-white mt-1">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Message */}
                  {ticket.status !== 'closed' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Add message..."
                        className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddMessage(ticket._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddMessage(ticket._id)}
                        className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-500 transition text-sm"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
