const {prisma} = require("./prisma")


const findtasks = async (usuarioID) => {
    const tasks = await prisma.tasks.findMany({
        where: {
            usuario: {
                id: usuarioID
            }
        },
        include: {
            usuario: {
                select: {
                    id: true,
                    email: true,
                }
            }
        }
    });

    return tasks
}

const findById = async (id, usuarioID) => {
    const tasks = await prisma.tasks.findFirst({
        where: {
            id,
            usuarioID
        }
    })
    return tasks
}

const adicionartasks = async (data, usuarioID) => {
    const tasks = await prisma.tasks.create({
        data: {  
              ...data,
        usuario: {
            connect: {
                id: usuarioID
            }
        }
    }
})
    return tasks
}

const atualizarTasks = async (id, data, usuarioID) => {
      await prisma.tasks.updateMany({
        data,
        where: { 
            id,
            usuarioID
        }
      })
      return await findById(id, usuarioID);
}

const deletarTasks = async (id, usuarioID) => {
    const tasks = await prisma.tasks.deleteMany({
            where: {
                id,
                usuarioID
            }
        })
    }



module.exports = {
    findtasks,
    adicionartasks,
    atualizarTasks,
    deletarTasks,
    findById
}