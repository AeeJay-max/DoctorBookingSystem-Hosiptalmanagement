import jwt from 'jsonwebtoken'
import adminModel from '../models/adminModel.js'

const authAdmin = async (req, res, next) => {
    try {
        const atoken = req.headers.atoken || req.headers.authorization?.replace('Bearer ', '')
        if (!atoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        try {
            const token_decoder = jwt.verify(atoken, process.env.JWT_SECRET)
            const adminId = token_decoder.id
            
            if (!adminId) {
                return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
            }

            const admin = await adminModel.findById(adminId)
            if (!admin) {
                return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
            }

            req.body.adminId = adminId
            req.admin = admin
            next()
        } catch (jwtError) {
            return res.status(401).json({ success: false, message: 'Session expired. Please login again' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Authentication failed' })
    }
}

export default authAdmin