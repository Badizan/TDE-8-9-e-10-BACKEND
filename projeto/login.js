const {prisma} = require("./prisma")


const findUusuarioByEmail = async (email) => {
   return await prisma.users.findFirst({
        where: {
            email: email
        }
    })
}

module.exports = {
    findUusuarioByEmail
}