const express = require("express")
const app = express()
const {PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()


app.use(express.json())

app.listen(3000,()=>console.log(`Server runnnig on port ${3000}`))


app.get("/", async (req,res)=>{

    const allUsers = await prisma.user.findMany()
    res.json(allUsers)

})

app.post("/", async (req,res)=>{
    const newUser = await prisma.user.create({data: req.body})
    res.json(newUser)
})