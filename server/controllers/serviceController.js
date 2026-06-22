const asyncHandler = require('express-async-handler');
const LaundryService = require('../models/laundryServiceModel');
const ActivityLog = require('../models/activityLogModel');

const logActivity = async (userId, action, details) => {
  try {
    await ActivityLog.create({ user: userId, action, details });
  } catch (error) {
    console.error(`Failed to write activity log for "${action}":`, error.message);
  }
};

const createService = asyncHandler(async (req, res) => {
  const { name, category, description, price, duration, options, active } = req.body;
  const service = await LaundryService.create({ name, category, description, price, duration, imageUrl: req.body.imageUrl || '', options, active });
  await logActivity(req.user._id, 'Service created', `${name} added to service catalog`);
  res.status(201).json(service);
});

const getServices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.includeInactive !== 'true') {
    filter.active = true;
  }
  const services = await LaundryService.find(filter);
  res.json(services);
});

const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const update = Object.fromEntries(
    Object.entries({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
      options: req.body.options,
      active: req.body.active,
    }).filter(([, value]) => value !== undefined)
  );

  const service = await LaundryService.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await logActivity(req.user._id, 'Service updated', `${service.name} updated`);
  res.json(service);
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await LaundryService.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await LaundryService.deleteOne({ _id: service._id });
  await logActivity(req.user._id, 'Service deleted', `${service.name} removed`);
  res.json({ message: 'Service removed' });
});

module.exports = { createService, getServices, updateService, deleteService };
