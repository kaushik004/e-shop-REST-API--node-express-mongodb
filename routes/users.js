const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// getting list of users
router.get('/', async (req, res) => {
    const userList = await User.find().select('name email phone');

    if(!userList) {
        return res.status(500).json({ success: false })
    }
    res.status(200).send(userList);
});

// getting a single user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        return res.status(500).json({ message:'User not found!' });
    }

    res.status(200).send(user);
});

// creating a user
router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();

    if(!user) {
        return res.status(400).send('the user cannot be created!');
    }

    res.status(200).send(user);
});

// updating a user
router.put('/:id', async (req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            street: req.body.street,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },
        { new: true }
    )

    if (!user) {
        return res.status(400).send('the user cannot be updated!');
    }

    res.status(200).send(user);
})

// user login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.SECRET;

    if (!user) {
        return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            { expiresIn: '1d' }
        );
        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('Password is wrong!');
    }
});

// user registrstion
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();

    if(!user) {
        return res.status(400).send('the user cannot be created!');
    }

    res.starus(200).send(user);
});

// deleting a user
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({ success: true, message: 'The user is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'user not found!' });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, err: err });
    })
});

// getting total number of users
router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments((count) => count);

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({ userCount: userCount });
});

module.exports = router;