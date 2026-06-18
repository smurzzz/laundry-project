import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ServiceRatingsPage = () => {
  const [myRatings, setMyRatings] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({ score: 5, comment: '' });

  useEffect(() => {
    fetchRatingsAndOrders();
  }, []);

  const fetchRatingsAndOrders = async () => {
    try {
      const token = localStorage.getItem('cw_token');
      const [ratingsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/ratings/my-ratings', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:5001/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMyRatings(ratingsRes.data);
      setCompletedOrders(ordersRes.data.filter((o) => o.status === 'completed'));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch ratings');
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cw_token');
      await axios.post(
        'http://localhost:5001/api/ratings',
        {
          orderId: selectedOrder._id,
          serviceId: selectedOrder.services?.[0],
          score: parseInt(formData.score),
          comment: formData.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Rating submitted');
      setFormData({ score: 5, comment: '' });
      setShowRatingForm(false);
      fetchRatingsAndOrders();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const unratedOrders = completedOrders.filter(
    (order) => !myRatings.some((r) => r.order._id === order._id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Ratings</h2>
        <p className="text-slate-600 dark:text-slate-400">Rate your service experience</p>
      </div>

      {/* My Ratings */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Ratings</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-sky-500"></div>
          </div>
        ) : myRatings.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No ratings yet</p>
        ) : (
          <div className="grid gap-4">
            {myRatings.map((rating) => (
              <div key={rating._id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-slate-900 dark:text-white">{rating.service?.name}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < rating.score ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {rating.comment && <p className="text-sm text-slate-600 dark:text-slate-400">{rating.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rate Service */}
      {unratedOrders.length > 0 && (
        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800 p-4">
          <h3 className="font-semibold text-sky-900 dark:text-sky-100 mb-4">Rate your completed orders</h3>
          <div className="grid gap-3">
            {unratedOrders.map((order) => (
              <button
                key={order._id}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowRatingForm(true);
                }}
                className="text-left p-3 bg-white dark:bg-slate-800 rounded border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-slate-700 transition"
              >
                <p className="font-medium text-slate-900 dark:text-white">Order #{order._id?.slice(-6)}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{order.services?.length} services</p>
              </button>
            ))}
          </div>

          {showRatingForm && (
            <form onSubmit={handleSubmitRating} className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, score: num })}
                        className={`text-2xl ${parseInt(formData.score) >= num ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Comment</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    rows="3"
                    placeholder="Share your experience..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition"
                  >
                    Submit Rating
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRatingForm(false)}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceRatingsPage;

