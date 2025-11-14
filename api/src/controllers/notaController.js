// src/controllers/notaController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* Criar Nota */
exports.create = async (req, res) => {
    try {
        const { usuarioId, titulo, conteudo, pasta, tipo } = req.body;

        if (!usuarioId || !titulo) {
            return res.status(400).json({ error: "Preencha título e usuário." });
        }

        const nova = await prisma.nota.create({
            data: {
                usuarioId: Number(usuarioId),
                titulo,
                conteudo: conteudo || "",
                pasta: pasta || "GERAL",
                favorito: false,
                selecionado: false,
                tipo: tipo || "NORMAL",
            },
        });

        return res.status(201).json(nova);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao criar nota." });
    }
};

/* LISTAR — Geral */
exports.listAll = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const notas = await prisma.nota.findMany({
            where: { usuarioId: Number(usuarioId) },
            orderBy: { atualizadoEm: "desc" }
        });

        return res.json(notas);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar notas." });
    }
};

/* LISTAR FAVORITOS */
exports.favoritos = async (req, res) => {
    const { usuarioId } = req.params;
    const notas = await prisma.nota.findMany({
        where: { usuarioId: Number(usuarioId), favorito: true },
        orderBy: { atualizadoEm: "desc" }
    });
    res.json(notas);
};

/* LISTAR RECENTES */
exports.recentes = async (req, res) => {
    const { usuarioId } = req.params;
    const notas = await prisma.nota.findMany({
        where: { usuarioId: Number(usuarioId) },
        orderBy: { ultimoUsoEm: "desc" }
    });
    res.json(notas);
};

/* LISTAR SELECIONADOS */
exports.selecionadoList = async (req, res) => {
    const { usuarioId } = req.params;
    const notas = await prisma.nota.findMany({
        where: { usuarioId: Number(usuarioId), selecionado: true },
        orderBy: { atualizadoEm: "desc" }
    });
    res.json(notas);
};

/* LISTAR TEMPLATES */
exports.templates = async (req, res) => {
    const { usuarioId } = req.params;
    const notas = await prisma.nota.findMany({
        where: { usuarioId: Number(usuarioId), tipo: "TEMPLATE" },
        orderBy: { atualizadoEm: "desc" }
    });
    res.json(notas);
};

/* BUSCAR */
exports.search = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { q } = req.query;

        const notas = await prisma.nota.findMany({
            where: {
                usuarioId: Number(usuarioId),
                OR: [
                    { titulo: { contains: q, mode: "insensitive" } },
                    { conteudo: { contains: q, mode: "insensitive" } }
                ]
            }
        });

        res.json(notas);
    } catch (e) {
        res.status(500).json({ error: "Erro ao buscar." });
    }
};

/* Buscar por ID */
exports.getById = async (req, res) => {
    const { id } = req.params;
    const nota = await prisma.nota.findUnique({ where: { id: Number(id) } });

    if (!nota) return res.status(404).json({ error: "Nota não encontrada." });

    await prisma.nota.update({
        where: { id: Number(id) },
        data: { ultimoUsoEm: new Date() }
    });

    res.json(nota);
};

/* Atualizar */
exports.update = async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo, pasta } = req.body;

    const nota = await prisma.nota.update({
        where: { id: Number(id) },
        data: { titulo, conteudo, pasta, atualizadoEm: new Date() }
    });

    res.json(nota);
};

/* Excluir */
exports.delete = async (req, res) => {
    const { id } = req.params;
    await prisma.nota.delete({ where: { id: Number(id) } });
    res.json({ msg: "Excluído!" });
};

/* FAVORITO */
exports.toggleFavorito = async (req, res) => {
    const { id } = req.params;
    const nota = await prisma.nota.findUnique({ where: { id: Number(id) } });

    const atualizada = await prisma.nota.update({
        where: { id: Number(id) },
        data: { favorito: !nota.favorito }
    });

    res.json(atualizada);
};

/* SELECIONAR */
exports.toggleSelecionado = async (req, res) => {
    const { id } = req.params;
    const nota = await prisma.nota.findUnique({ where: { id: Number(id) } });

    const atualizada = await prisma.nota.update({
        where: { id: Number(id) },
        data: { selecionado: !nota.selecionado }
    });

    res.json(atualizada);
};

