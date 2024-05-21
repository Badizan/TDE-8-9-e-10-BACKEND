const express = require('express');
const { findtasks, adicionartasks, atualizarTasks, deletarTasks } = require('./projeto/tasks');
const { router } = require("./projeto/usuario");
const { auth } = require('./middlewares/auth');

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

// let tasks = [
//     {
//         "id": 1,
//         "name": "Comprar leite",
//         "description": "Ir no mercado da esquina e comprar leite",
//         "isDone": false
//     },
//     {
//         "id": 2,
//         "name": "Estudar para prova de matemática",
//         "description": "Revisar os exercícios do capítulo 5",
//         "isDone": true
//     },
//     {
//     ;    "id": 3,
//         "name": "Fazer exercícios de programação",
//         "description": "Resolver os problemas do URI Online Judge",
//         "isDone": false
//     },
//     {
//         "id": 4,
//         "name": "Ligar para o dentista",
//         "description": "Marcar consulta para a próxima semana",
//         "isDone": false
//     }
// ];


// Rota para exibir a lista de tarefas
app.get('/tasks', auth, async(req, res) => {
    console.log(req.usuario)
    const tasks = await findtasks();
    res.json(tasks);
})

// Rota para criar uma nova tarefa
app.post('/tasks', auth, async (req, res) => {
    const data = req.body
    const tasks = await adicionartasks(data);
    res.status(201).json(tasks);
});

// Rota para atualizar uma tarefa existente
app.put('/tasks/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    const tasks = await atualizarTasks(id, req.body);
    res.json(tasks)
});

// Rota para excluir uma tarefa existente
app.delete('/tasks/:id', auth, async(req, res) => {
    const id = parseInt(req.params.id)
    await deletarTasks(id)
    res.status(204).send()
});

app.listen(port, () => {
    console.log(`App ouvindo na porta http://localhost:${port}`);
});
