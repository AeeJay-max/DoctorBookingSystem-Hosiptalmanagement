import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
    try {
        const dtoken = req.headers.dtoken || req.headers.authorization?.replace('Bearer ', '')
        if (!dtoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
        }

        try {
            const token_decoder = jwt.verify(dtoken, process.env.JWT_DOCTOR_SECRET)
            req.body.docId = token_decoder.id
            next()
        } catch (jwtError) {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Authentication failed' })
    }
}

export default authDoctor