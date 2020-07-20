const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const main = async () => {
    prisma.
        data.degrees.forEach(async (degree) => { await prisma.degree.create({ data: degree }) }
        )
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.disconnect()
    })