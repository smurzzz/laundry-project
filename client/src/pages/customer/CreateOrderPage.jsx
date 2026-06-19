import { useEffect, useState } from 'react';
import apiClient from '../../services/apiService';
import { toast } from 'react-toastify';
import StickyActionBar from '../../components/StickyActionBar';

const CreateOrderPage = () => {
  const [services, setServices] = useState([]);
  const [items, setItems] = useState([]);
  const [deliveryType, setDeliveryType] = useState('Pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');

  const addItem = (service, option = null) => {
    setItems((prev) => [
      ...prev,
      {
        serviceId: service._id,
        itemType: 'Service',
        name: service.name,
        category: service.category,
        basePrice: service.price,
        quantity: 1,
        instructions: '',
        option,
      },
    ]);
  };

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const { data: servicesData } = await apiClient.get('/services');
        setServices(servicesData);
      } catch (error) {
        console.error(error);
      }
    };
    loadCatalog();
  }, []);

  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitHandler = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (items.length === 0) {
      toast.error('Add at least one service item');
      return;
    }

    try {
      await apiClient.post('/orders', { items, pickupType: deliveryType, deliveryAddress, customerNotes: notes });
      toast.success('Order created successfully');
      setItems([]);
      setDeliveryAddress('');
      setNotes('');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="app-card space-y-8 pb-32">
      <div>
        <p className="app-kicker">New request</p>
        <h2 className="app-page-title mt-3">Create new laundry order</h2>
        <p className="mt-2 app-muted">Choose services, add instructions, and schedule pickup or delivery.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
              <div className="app-panel">
            <h3 className="font-semibold text-slate-900 dark:text-white">Service catalog</h3>
            {services.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300">
                No service choices are available yet. Please ask an admin to add orderable services in the Services catalog.
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {services.map((service) => (
                  <div key={service._id} className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                    <button type="button" onClick={() => addItem(service)} className="w-full text-left">
                      <p className="font-semibold text-slate-900 dark:text-white">{service.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{service.category} · ₱{service.price.toFixed(2)} · {service.duration}</p>
                    </button>
                    {service.options?.length > 0 && (
                      <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/10 dark:text-slate-300">
                        <p className="font-semibold">Service choices</p>
                        {service.options.map((option, idx) => (
                          <button key={idx} type="button" onClick={() => addItem(service, option)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-left transition hover:bg-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            {option.name}
                            {option.priceAdjustment ? ` (+₱${option.priceAdjustment.toFixed(2)})` : ''}
                            {option.description && <span className="block text-xs text-slate-500 dark:text-slate-400">{option.description}</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <form className="space-y-6" onSubmit={submitHandler}>
            <div className="app-panel space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Current order items</h3>
              {items.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">Add a service above to begin your order.</p>
              ) : (
                items.map((item, index) => {
                  const optionAdjustment = item.option?.priceAdjustment ?? 0;
                  const itemPrice = item.basePrice + optionAdjustment;
                  return (
                    <div key={index} className="space-y-3 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                          {item.option && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">Choice: {item.option.name} {optionAdjustment ? `(+${optionAdjustment.toFixed(2)})` : ''}</p>
                          )}
                        </div>
                        <button type="button" onClick={() => removeItem(index)} className="text-rose-600 hover:text-rose-500">Remove</button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-600 dark:text-slate-300">
                          Quantity
                          <input type="number" value={item.quantity} min="1" onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} className="app-input mt-2" />
                        </label>
                        <label className="block text-sm text-slate-600 dark:text-slate-300">
                          Instructions
                          <input type="text" value={item.instructions} onChange={(e) => updateItem(index, 'instructions', e.target.value)} className="app-input mt-2" />
                        </label>
                      </div>
                      {item.options?.length > 0 && (
                        <label className="block text-sm text-slate-600 dark:text-slate-300">
                          Service choice
                          <select
                            value={item.option?.name || ''}
                            onChange={(e) => {
                              const selected = item.options.find((opt) => opt.name === e.target.value) || null;
                              updateItem(index, 'option', selected);
                            }}
                            className="app-input mt-2"
                          >
                            <option value="">None</option>
                            {item.options.map((opt, optIndex) => (
                              <option key={optIndex} value={opt.name}>{opt.name}{opt.priceAdjustment ? ` (+${opt.priceAdjustment.toFixed(2)})` : ''}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      <p className="text-sm text-slate-500 dark:text-slate-400">Unit price: ₱{itemPrice.toFixed(2)} · Total: ₱{(itemPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Pickup type
                <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)} className="app-input mt-2">
                  <option>Pickup</option>
                  <option>Delivery</option>
                </select>
              </label>
              <label className="block text-sm text-slate-600 dark:text-slate-300">
                Delivery address
                <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Street address" className="app-input mt-2" />
              </label>
            </div>
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" placeholder="Add any special instructions" className="app-input mt-2" />
            </label>
            <button type="submit" className="app-button-primary w-full">Submit order</button>
          </form>
        </div>
        <aside className="app-card">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Order summary</h3>
          <p className="mt-4 text-slate-500 dark:text-slate-400">Track each step from pending to completed with email alerts and QR order tracking.</p>
          <div className="app-panel mt-6">
            <p className="app-kicker">Selected items</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{items.length}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Estimated total: ₱{items.reduce((sum, item) => {
              const itemPrice = item.basePrice + (item.option?.priceAdjustment ?? 0);
              return sum + itemPrice * item.quantity;
            }, 0).toFixed(2)}</p>
          </div>
        </aside>
      </div>
      <StickyActionBar label="Submit order" onClick={submitHandler} />
    </div>
  );
};

export default CreateOrderPage;

