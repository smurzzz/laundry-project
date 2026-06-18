const asyncHandler = require('express-async-handler');
const PromoCode = require('../models/promoCodeModel');
const ActivityLog = require('../models/activityLogModel');

const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discount, discountType, maxUses, minOrderValue, validFrom, validUntil, applicableServices } = req.body;
  const userId = req.user.id;

  if (!code || !discount || !validFrom || !validUntil) {
    res.status(400);
    throw new Error('Code, discount, and validity period required');
  }

  const existing = await PromoCode.findOne({ code: code.toUpperCase() });
  if (existing) {
    res.status(400);
    throw new Error('Promo code already exists');
  }

  const promo = await PromoCode.create({
    code: code.toUpperCase(),
    discount,
    discountType,
    maxUses,
    minOrderValue,
    validFrom,
    validUntil,
    applicableServices: applicableServices || [],
    createdBy: userId,
  });

  await ActivityLog.create({ user: userId, action: 'Promo code created', details: `Code: ${code}` });

  res.status(201).json(promo);
});

const getPromoCodes = asyncHandler(async (req, res) => {
  const { active } = req.query;
  const filter = {};
  if (active === 'true') filter.active = true;
  if (active === 'false') filter.active = false;

  const promos = await PromoCode.find(filter).populate('applicableServices').sort({ createdAt: -1 });
  res.json(promos);
});

const validatePromoCode = asyncHandler(async (req, res) => {
  const { code, orderValue, serviceId } = req.body;

  const promo = await PromoCode.findOne({ code: code.toUpperCase(), active: true });

  if (!promo) {
    res.status(404);
    throw new Error('Promo code not found or inactive');
  }

  if (new Date() < promo.validFrom || new Date() > promo.validUntil) {
    res.status(400);
    throw new Error('Promo code expired');
  }

  if (promo.maxUses && promo.currentUses >= promo.maxUses) {
    res.status(400);
    throw new Error('Promo code usage limit reached');
  }

  if (orderValue && orderValue < promo.minOrderValue) {
    res.status(400);
    throw new Error(`Minimum order value ${promo.minOrderValue} required`);
  }

  if (promo.applicableServices.length > 0 && serviceId && !promo.applicableServices.includes(serviceId)) {
    res.status(400);
    throw new Error('Service not eligible for this promo');
  }

  const discountAmount = promo.discountType === 'percentage' ? (orderValue * promo.discount) / 100 : promo.discount;

  res.json({ valid: true, discount: discountAmount, discountType: promo.discountType, discountValue: promo.discount });
});

const applyPromoCode = asyncHandler(async (req, res) => {
  const { code, userId } = req.body;

  const promo = await PromoCode.findOne({ code: code.toUpperCase() });
  if (!promo) {
    res.status(404);
    throw new Error('Promo code not found');
  }

  if (!promo.usedBy.includes(userId)) {
    promo.usedBy.push(userId);
    promo.currentUses += 1;
    await promo.save();
  }

  res.json({ message: 'Promo code applied', discount: promo.discount });
});

const updatePromoCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { discount, maxUses, active, validUntil } = req.body;

  const promo = await PromoCode.findByIdAndUpdate(
    id,
    {
      ...(discount && { discount }),
      ...(maxUses && { maxUses }),
      ...(active !== undefined && { active }),
      ...(validUntil && { validUntil }),
    },
    { new: true }
  );

  if (!promo) {
    res.status(404);
    throw new Error('Promo code not found');
  }

  res.json(promo);
});

const deletePromoCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await PromoCode.findByIdAndDelete(id);
  res.json({ message: 'Promo code deleted' });
});

module.exports = { createPromoCode, getPromoCodes, validatePromoCode, applyPromoCode, updatePromoCode, deletePromoCode };
