const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE
async function create(req, res) {
    try {
        const { nome, cpf, email, telefone, status } = req.body;

        const pacienteExistente = await prisma.paciente.findUnique({ where: { cpf } });
        if (pacienteExistente)
            return res.status(400).json({ error: "CPF já cadastrado." });

        const novo = await prisma.paciente.create({
            data: { nome, cpf, email, telefone, status },
        });

        return res.status(201).json({ message: "Paciente cadastrado!", paciente: novo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar paciente." });
    }
}

// READ
async function read(req, res) {
    try {
        const { id } = req.params;

        if (id) {
            const paciente = await prisma.paciente.findUnique({
                where: { id: Number(id) },
                include: { relatorios: true, consultas: true },
            });
            return res.json(paciente);
        }

        const pacientes = await prisma.paciente.findMany({
            include: { relatorios: true, consultas: true },
        });

        return res.json(pacientes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar pacientes." });
    }
}

// UPDATE
async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, telefone, status } = req.body;

        const paciente = await prisma.paciente.update({
            where: { id: Number(id) },
            data: { nome, email, telefone, status },
        });

        return res.json({ message: "Paciente atualizado!", paciente });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar paciente." });
    }
}

// DELETE
async function del(req, res) {
    try {
        const { id } = req.params;
        await prisma.paciente.delete({ where: { id: Number(id) } });
        return res.json({ message: "Paciente removido com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao excluir paciente." });
    }
}

module.exports = { create, read, update, delete: del };
