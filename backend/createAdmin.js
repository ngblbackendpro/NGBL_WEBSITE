const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Admin = require('./models/Auth')
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)

async function createAdmin(){
    const hashPassword = await bcrypt.hash("admin123456", 10)
    const admin = new Admin({
        username: "admin",
        password: hashPassword
    })

    await admin.save();

    console.log("Admin Created Successfully")
    process.exit();
}

createAdmin();