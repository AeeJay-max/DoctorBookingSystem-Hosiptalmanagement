import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
        }

        try {
            const token_decoder = jwt.verify(token, process.env.JWT_SECRET)
            req.body.userId = token_decoder.id
            next()
        } catch (jwtError) {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Authentication failed' })
    }
}

export default authUser