const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const {z, ZodError} = require('zod')
const router = express.Router()
const { prisma } = require("./prisma")
const { findUusuarioByEmail } = require("./login")

router.use(express.json())

const usuarioSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "A senha precisa ter 6 caracteres"),
})

router.post("/registro", async (req, res) => {
    try {
        const data = usuarioSchema.parse(req.body)
    const usuariojacadastrado = await findUusuarioByEmail(data.email)
    if (usuariojacadastrado) return res.status(400).json({
        message: "Email já cadastrado"
    })
    const hash = bcrypt.hashSync(data.password, 10)
    const usuario = await prisma.users.create({
        data: {
            email: data.email,
            password: hash
        }
    })
    delete usuario.password
    res.send(usuario)
    } catch (error) {
        if(error instanceof ZodError) {
            res.status(400).json(error.errors.map((err) => err.message))
        }
        res.send(500).send();
    }
})


// esse process.env.SECRET nao vai funcionar pois nao é igual o token shhhhhh
router.post("/login", async (req, res) => {
    try {
        const data = usuarioSchema.parse(req.body)
    const usuario = await findUusuarioByEmail(data.email)
    if(!usuario) return res.status(401).json({message: "credencial invalido"})
    const seAsenhaForAmesma = bcrypt.compareSync(data.password, usuario.password)   
    if(!seAsenhaForAmesma)return res.status(401).json({message: "credencial invalido"})
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.SECRET);  
    res.json({
        success: true,
        token
    })
  } catch (error) {
    if(error instanceof ZodError) {
        res.status(400).json(error.errors.map((err) => err.message))
    }
    res.send(500).send();
   }
})

module.exports = { router }