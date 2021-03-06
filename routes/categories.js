const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// getting list of category
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if(!categoryList) {
        return res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
});

// getting a single category
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        return res.status(500).json({ message:'Category not found!' });
    }

    res.status(200).send(category);
});

// creating a category
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();
    
    if(!category) {
        return res.status(400).send('the category cannot be created !');
    }
    
    res.status(200).send(category);
});

// updating a category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color
        },
        { new: true }
    )

    if(!category) {
        return res.status(400).send('category cannot be updated.');
    }

    res.status(200).send(category);
});

// deleting a category
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'category not found!' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, err: err });
    });
});

module.exports = router;