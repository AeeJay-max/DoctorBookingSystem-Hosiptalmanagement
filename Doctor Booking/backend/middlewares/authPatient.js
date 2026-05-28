import jwt from 'jsonwebtoken'

const authPatient = async (req, res, next) => {
    try {
        const Ptoken = req.headers.Ptoken || req.headers.authorization?.replace('Bearer ', '')
        if (!Ptoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
        }

        try {
            const token_decoder = jwt.verify(Ptoken, process.env.JWT_Patient_SECRET)
            req.body.patientId = token_decoder.id
            next()
        } catch (jwtError) {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Authentication failed' })
    }
}

export default authPatient