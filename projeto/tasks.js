const {prisma} = require("./prisma")


const findtasks = async () => {
    const tasks = await prisma.tasks.findMany();
    return tasks
}

const adicionartasks = async (data) => {
    const tasks = await prisma.tasks.create({
        data: {  
            name: data.name,
            description: data.description,
            isDone: data.isDone
        }
    })
    return tasks
}

const atualizarTasks = async (id, data) => {
    const tasks = await prisma.tasks.update({
        data,
        where: { 
            id
        }
      })
      return tasks;
}

const deletarTasks = async (id) => {
    const tasks = await prisma.tasks.delete({
            where: {
                id
            }
        })
    }



module.exports = {
    findtasks,
    adicionartasks,
    atualizarTasks,
    deletarTasks
}