import express from 'express';
import Good from '../models/Good.js';

const router = express.Router();

// Get all goods
router.get('/', async (req, res) => {
  const goods = await Good.find().sort({ lastUpdated: -1 });
  res.json(goods);
});

// Add a new good
router.post('/', async (req, res) => {
  const good = new Good(req.body);
  await good.save();
  res.status(201).json(good);
});

// Update a good
router.put('/:id', async (req, res) => {
  const updated = await Good.findByIdAndUpdate(req.params.id, {
    ...req.body,
    lastUpdated: new Date()
  }, { new: true });
  res.json(updated);
});

// Delete a good
router.delete('/:id', async (req, res) => {
  await Good.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

export default router;
