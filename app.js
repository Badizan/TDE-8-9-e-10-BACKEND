const express = require('express');
const { prisma } = require("./projeto/prisma");

const app = express();
const port = 3000;

app.use(express.json())

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
//         "id": 3,
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
app.get('/tasks', async(req, res) => {
    const tasks = await prisma.tasks.findMany({
        where: {
            isDone: req.query.isDone ?  Boolean(req.query.isDone) : undefined 
        }
    })
    res.json(tasks);
});

// Rota para criar uma nova tarefa
app.post('/tasks', async (req, res) => {
    const data = req.body
    const tasks = await prisma.tasks.create({
        data: {
            name: data.name,
            description: data.description,
            isDone: data.isDone
        }
    })
    res.status(201).json(tasks);
});

// Rota para atualizar uma tarefa existente
app.put('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);
    const tasks = await prisma.tasks.update({
    data: {
        name: req.body.name,
        description: req.body.description,
        isDone: req.body.isDone
      },
      where: { 
        id
    }
  })
    res.json(tasks)
});

// Rota para excluir uma tarefa existente
app.delete('/tasks/:id', async(req, res) => {
    const id = parseInt(req.params.id)
    await prisma.tasks.delete({
        where: {
            id
        }
    })
    res.status(204).send()
});

app.listen(port, () => {
    console.log(`App ouvindo na porta http://localhost:${port}`);
    
});
