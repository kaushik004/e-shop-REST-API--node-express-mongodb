const expressJwt = require('express-jwt');

const authJwt = () => {
    const secret = process.env.SECRET;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // excluding paths which is not required for authentication
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTION']},
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTION']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTION']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

const isRevoked = async (req, payload, done) => {
    // checking if user is admin
    if (!payload.isAdmin) {
        done(null, true)
    }

    done();
}

module.exports = authJwt;