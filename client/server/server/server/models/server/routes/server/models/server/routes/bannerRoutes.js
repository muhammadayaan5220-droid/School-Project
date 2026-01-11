// server/routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all active banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create banner (admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    
    const banner = new Banner({
      ...req.body,
      image: imageUrl
    });
    
    const newBanner = await banner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update banner (admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    // Update fields
    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle || banner.subtitle;
    banner.videoUrl = req.body.videoUrl || banner.videoUrl;
    banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
    banner.order = req.body.order !== undefined ? req.body.order : banner.order;
    
    // Update image if provided
    if (req.file) {
      banner.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE banner (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    await banner.remove();
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
