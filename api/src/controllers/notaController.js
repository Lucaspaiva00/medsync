// src/controllers/notaController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ===========================================================
   1. Criar Nota
=========================================================== */
exports.create = async (req, res) => {
    try {
        const { usuarioId, titulo, conteudo, pasta, tipo } = req.body;

        if (!usuarioId || !titulo || !conteudo) {
            return res.status(400).json({ error: "Campos obrigatórios ausentes." });
        }

        const novaNota = await prisma.nota.create({
            data: {
                titulo,
                conteudo,
                usuarioId: Number(usuarioId),
                pasta: pasta || "GERAL",
                tipo: tipo || "NORMAL",
            }
        });

        return res.status(201).json(novaNota);
    } catch (error) {
        console.error("Erro ao criar nota:", error);
        return res.status(500).json({ error: "Erro ao criar nota." });
    }
};


/* ===========================================================
   2. Listar todas as notas (Todas as Notas)
=========================================================== */
exports.listAll = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const notas = await prisma.nota.findMany({
            where: { usuarioId: Number(usuarioId) },
            orderBy: { atualizadoEm: "desc" }
        });

        return res.json(notas);
    } catch (error) {
        console.error("Erro ao listar notas:", error);
        return res.status(500).json({ error: "Erro ao listar notas." });
    }
};


/* ===========================================================
   3. Buscar Nota por ID
=========================================================== */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const nota = await prisma.nota.findUnique({
            where: { id: Number(id) }
        });

        if (!nota) return res.status(404).json({ error: "Nota não encontrada." });

        // Atualiza último uso
        await prisma.nota.update({
            where: { id: Number(id) },
            data: { ultimoUsoEm: new Date() }
        });

        return res.json(nota);
    } catch (error) {
        console.error("Erro ao buscar nota:", error);
        return res.status(500).json({ error: "Erro ao buscar nota." });
    }
};


/* ===========================================================
   4. Atualizar Nota
=========================================================== */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, conteudo, pasta } = req.body;

        const notaAtualizada = await prisma.nota.update({
            where: { id: Number(id) },
            data: {
                titulo,
                conteudo,
                pasta
            }
        });

        return res.json(notaAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar nota:", error);
        return res.status(500).json({ error: "Erro ao atualizar nota." });
    }
};


/* ===========================================================
   5. Excluir Nota
=========================================================== */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.nota.delete({
            where: { id: Number(id) }
        });

        return res.json({ message: "Nota excluída com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir nota:", error);
        return res.status(500).json({ error: "Erro ao excluir nota." });
    }
};


/* ===========================================================
   6. Favoritar / Desfavoritar
=========================================================== */
exports.toggleFavorito = async (req, res) => {
    try {
        const { id } = req.params;

        const nota = await prisma.nota.findUnique({ where: { id: Number(id) } });

        if (!nota) return res.status(404).json({ error: "Nota não encontrada." });

        const atualizada = await prisma.nota.update({
            where: { id: Number(id) },
            data: { favorito: !nota.favorito }
        });

        return res.json(atualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao marcar favorito." });
    }
};


/* ===========================================================
   7. Selecionar / Desselecionar
=========================================================== */
exports.toggleSelecionado = async (req, res) => {
    try {
        const { id } = req.params;

        const nota = await prisma.nota.findUnique({ where: { id: Number(id) } });

        if (!nota) return res.status(404).json({ error: "Nota não encontrada." });

        const atualizada = await prisma.nota.update({
            where: { id: Number(id) },
            data: { selecionado: !nota.selecionado }
        });

        return res.json(atualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao selecionar nota." });
    }
};


/* ===========================================================
   8. Buscar Notas Favoritas
=========================================================== */
exports.listFavoritos = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const favoritos = await prisma.nota.findMany({
            where: {
                usuarioId: Number(usuarioId),
                favorito: true
            },
            orderBy: { atualizadoEm: "desc" }
        });

        return res.json(favoritos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar favoritos." });
    }
};


/* ===========================================================
   9. Notas Usadas Recentemente
=========================================================== */
exports.listRecentes = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const recentes = await prisma.nota.findMany({
            where: { usuarioId: Number(usuarioId) },
            orderBy: { ultimoUsoEm: "desc" }
        });

        return res.json(recentes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar recentes." });
    }
};


/* ===========================================================
   10. Buscar por texto
=========================================================== */
exports.search = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { q } = req.query;

        const resultados = await prisma.nota.findMany({
            where: {
                usuarioId: Number(usuarioId),
                OR: [
                    { titulo: { contains: q, mode: "insensitive" } },
                    { conteudo: { contains: q, mode: "insensitive" } }
                ]
            }
        });

        return res.json(resultados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro na busca." });
    }
};
