const Admin = require('../models/Auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.loginAdmin = async (req, res) => {
    try{
        const { username, password } = req.body;
        const admin = await Admin.findOne({username});
        if(!admin){
            return res.status(401).json({message: 'Invalid credential'})
        }
        
        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) {
            return res.status(401).json({message: "Invalid Password"})
        }

        const token = jwt.sign({
            id: admin._id,
            username: admin.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

        res.json({success:true, token})
    } catch (err) {
        res.status(500).json({message: "server error"})
    }
}
