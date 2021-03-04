const { Product } = require('../models/product');
const { Category } = require('../models/category');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// File types for Images
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// For saving Images in public/uplloads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type.');
        if(isValid) {
            uploadError = null
        }
        cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extention = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extention}`);
    },
});

const uploadOptions = multer({ storage: storage });

// getting list of products
router.get('/', async (req, res) => {
    // 127.0.0.1/api/v1/products/?categories=1234,2345
    let filter = {};
    if(req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }

    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        return res.status(500).json({ success: false })
    }
    res.status(200).send(productList);
});

// getting a single product
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        return res.status(500).json({ success: false, message: 'product not found!' })
    }
    res.status(200).send(product);
});

// creating a product
router.post('/', uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(400).send('Invalid category');
    }

    const file = req.file;
    if(!file) {
        return res.status(400).send('No image in Request.')
    }

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if(!product) {
        return res.status(500).send('The product cannot be created');
    }

    res.status(200).send(product);
});

// updating a product
router.put('/:id', async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(400).send('Invalid category');
    }
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            },
            { new: true }
        );
        if(!product) {
            return res.status(500).send('The product cannot be updated!')
        }
        res.status(200).send(product);
    } catch (error) {
        res.send({message: error});
    }
});

// deleting a product
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({ success: true, message: 'the product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'product not found!' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, err: err });
    })
});

// getting total number product
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.status(200).send({ productCount: productCount });
});

// getting featured number of product
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count);

    if (!products) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(products);
});

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    try {
        const files =  req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
        if(files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            })
        }
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        );
        if(!product) {
            return res.status(500).send('The product cannot be updated!')
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({message: error});
    }
});

module.exports = router;