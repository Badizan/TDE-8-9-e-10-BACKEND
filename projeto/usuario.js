const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const router = express.Router()
const { prisma } = require("./prisma")
const { findUusuarioByEmail } = require("./login")

router.use(express.json())

router.post("/registro", async (req, res) => {
    const usuariojacadastrado = await findUusuarioByEmail(req.body.email)
    if (usuariojacadastrado) return res.status(400).json({
        message: "Email já cadastrado"
    })
    const hash = bcrypt.hashSync(req.body.password, 10)
    const usuario = await prisma.users.create({
        data: {
            email: req.body.email,
            password: hash
        }
    })
    delete usuario.password
    res.send(usuario)
})
// esse process.env.SECRET nao vai funcionar pois nao é igual o token shhhhhh
router.post("/login", async (req, res) => {
    const usuario = await findUusuarioByEmail(req.body.email)
    if(!usuario) return res.status(401).json({message: "credencial invalido"})
    const seAsenhaForAmesma = bcrypt.compareSync(req.body.password, usuario.password)   
    if(!seAsenhaForAmesma)return res.status(401).json({message: "credencial invalido"})
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.SECRET);    
    res.json({
        success: true,
        token
    })
})

module.exports = { router }