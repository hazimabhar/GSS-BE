const express = require("express");
const userRoutes = require("./routes/userRoutes")
const otpRoutes = require("./routes/otpRoutes")

const app = express()

app.use(express.json())
app.use('/user/api/v1', userRoutes)
app.use('/otp/api/v1', otpRoutes)


module.exports = app 