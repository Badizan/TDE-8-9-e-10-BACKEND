const express = require('express');
const { findtasks, adicionartasks, atualizarTasks, deletarTasks, findById } = require('./projeto/tasks');
const { router } = require("./projeto/usuario");
const { auth } = require('./middlewares/auth');
const {z, ZodError} = require('zod')
const app = express();
const port = 3000;
app.use("/api", router)
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.url)
    console.log(req.method)
    console.log(req.body)
    next()
})

app.get('/tasks/:id', auth, async(req, res) => {
    const  id  = Number(req.params.id);
    const task = await findById(id, req.usuario)
    if (!task) return res.status(404).json({ message: `tasks com o id ${id} não encontrado` })
    res.json(task)
})

// Rota para exibir a lista de tarefas
app.get('/tasks', auth, async(req, res) => {
    const tasks = await findtasks(req.usuario);
    res.json(tasks);
})

const tasksSchema = z.object({
    name: z.string({
      message: "name is required",
    }).min(3),
    description: z.string({
        message: "description is required",
      }).max(255).optional(),
    isDone: z.boolean()
})

// Rota para criar uma nova tarefa
app.post('/tasks', auth, async (req, res) => {
    try {
           const data = tasksSchema.parse(req.body);
    const tasks = await adicionartasks(data, req.usuario);
    res.status(201).json(tasks);
    } catch (error) {
        if(error instanceof ZodError) {
            res.status(400).json(error.errors.map((err) => err.message))
        }
        res.send(500).send();
    }
});

// Rota para atualizar uma tarefa existente
app.put('/tasks/:id', auth, async (req, res) => {
    try {
    const id = Number(req.params.id);
    const data = tasksSchema.parse(req.body);
    const tasks = await atualizarTasks(id, data, req.usuario);
    res.json(tasks)
    } catch (error) {
        if(error instanceof ZodError) {
        res.status(400).json(error.errors.map((err) => err.message))
    }
    res.send(500).send();
   }
});

// Rota para excluir uma tarefa existente
app.delete('/tasks/:id', auth, async(req, res) => {
    const id = parseInt(req.params.id)
    await deletarTasks(id, req.usuario)
    res.status(204).send()
});

app.listen(port, () => {
    console.log(`App ouvindo na porta http://localhost:${port}`);
});
