const mongoose = require("mongoose")
const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://satyanarayanadhangeti:krify123@cluster0.rrcrc.mongodb.net/devtinder")
}

// connectDB().then(()=>{
//     console.log('DB connected successfully !!')
// }).catch(err=>{
//     console.log('DB Not connected!!')
// })

module.exports = connectDB;