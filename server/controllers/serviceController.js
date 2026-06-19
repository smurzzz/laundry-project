const asyncHandler = require('express-async-handler');
const LaundryService = require('../models/laundryServiceModel');
const ActivityLog = require('../models/activityLogModel');

const createService = asyncHandler(async (req, res) => {
  const { name, category, description, price, duration, options, active } = req.body;
  const service = await LaundryService.create({ name, category, description, price, duration, imageUrl: req.body.imageUrl || '', options, active });
  await ActivityLog.create({ user: req.user._id, action: 'Service created', details: `${name} added to service catalog` });
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
  const service = await LaundryService.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  service.name = req.body.name || service.name;
  service.description = req.body.description || service.description;
  service.price = req.body.price ?? service.price;
  service.duration = req.body.duration || service.duration;
  service.options = req.body.options ?? service.options;
  service.active = req.body.active ?? service.active;

  const updated = await service.save();
  await ActivityLog.create({ user: req.user._id, action: 'Service updated', details: `${service.name} updated` });
  res.json(updated);
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await LaundryService.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  await service.remove();
  await ActivityLog.create({ user: req.user._id, action: 'Service deleted', details: `${service.name} removed` });
  res.json({ message: 'Service removed' });
});

module.exports = { createService, getServices, updateService, deleteService };
