import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiService';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [{ data: inventoryData }, { data: servicesData }] = await Promise.all([
          apiClient.get('/inventory', { params: { category: 'Product' } }),
          apiClient.get('/services'),
        ]);

        let inventoryProducts = inventoryData;
        if (inventoryProducts.length === 0) {
          const fallback = await apiClient.get('/inventory');
          inventoryProducts = fallback.data;
        }

        const inventoryItems = inventoryProducts.map((item) => ({
          ...item,
          _source: 'inventory',
        }));

        const serviceProducts = servicesData
          .filter((service) => service.category?.toLowerCase() === 'product')
          .map((service) => ({
            ...service,
            _source: 'service',
            itemName: service.name,
            imageUrl: service.imageUrl || '',
          }));

        setProducts([...inventoryItems, ...serviceProducts]);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="space-y-6">
      <div className="app-card bg-gradient-to-br from-white/90 to-cyan-50/80 dark:from-slate-900/90 dark:to-cyan-950/30">
        <p className="app-kicker">Product catalog</p>
        <h2 className="app-page-title mt-3">Customer products</h2>
        <p className="mt-2 app-muted">Browse detergent and supply items available to order through the Create Order page.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, idx) => (
            <div key={idx} className="h-40 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800" />
          ))
        ) : products.length === 0 ? (
          <div className="app-card">
            <p className="app-muted">No products are available right now. Ask an admin to add detergent or supply items under the Services catalog with category "Product."</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={`${product._source || 'inventory'}-${product._itemId || product._id}`} className="app-card flex flex-col justify-between gap-4 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Product</p>
                <div className="mt-4 h-40 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.itemName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{product.itemName}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{product.description || 'No description available.'}</p>
              </div>
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">₱{product.price.toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => navigate('/customer/create-order', {
                    state: product._source === 'service'
                      ? { prefillService: product }
                      : { prefillInventory: product },
                  })}
                  className="app-button-primary"
                >
                  Order now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
