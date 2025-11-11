const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

// 🔹 Criar usuário (cadastro)
async function create(req, res) {
    try {
        const { nome, email, senha, tipo, telefone, identificacao, instituicao, periodo } = req.body;

        const existe = await prisma.usuario.findUnique({ where: { email } });
        if (existe) return res.status(400).json({ error: "E-mail já cadastrado." });

        const senhaHash = await bcrypt.hash(senha, 10);

        const novo = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                tipo,
                telefone,
                identificacao,
                instituicao,
                periodo,
                status: "PENDENTE",
            },
        });

        return res.status(201).json({ message: "Usuário criado com sucesso!", usuario: novo });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json({ error: "Erro ao criar usuário." });
    }
}

// 🔹 Login
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha)
            return res.status(400).json({ error: "E-mail e senha são obrigatórios." });

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario)
            return res.status(404).json({ error: "Usuário não encontrado." });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida)
            return res.status(401).json({ error: "Senha incorreta." });

        if (usuario.status === "PENDENTE" || usuario.status === "EM_ANALISE")
            return res.status(403).json({ error: "Seu cadastro está em análise." });

        if (usuario.status === "RECUSADO")
            return res.status(403).json({ error: "Seu cadastro foi recusado." });

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET || "medsync_secret",
            { expiresIn: "8h" }
        );

        return res.json({
            message: "Login efetuado com sucesso!",
            token,
            usuario,
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ error: "Erro ao realizar login." });
    }
}

// 🔹 Listar usuários (GET /api/usuarios)
async function read(req, res) {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                telefone: true,
                status: true,
                identificacao: true,
                instituicao: true,
                periodo: true,
                documentoUrl: true,
            },
        });

        return res.json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return res.status(500).json({ error: "Erro ao buscar usuários." });
    }
}

// 🔹 Buscar usuário por ID (aguardando.html)
async function readById(req, res) {
    try {
        const { id } = req.params;

        const usuario = await prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                telefone: true,
                status: true,
                documentoUrl: true,
            },
        });

        if (!usuario)
            return res.status(404).json({ error: "Usuário não encontrado." });

        return res.json(usuario);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return res.status(500).json({ error: "Erro ao buscar usuário." });
    }
}

// 🔹 Atualizar usuário
async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, telefone, senha, status } = req.body;

        const data = { nome, email, telefone };
        if (senha) data.senha = await bcrypt.hash(senha, 10);
        if (status) data.status = status;

        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data,
        });

        return res.json({ message: "Usuário atualizado com sucesso!", usuario });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
}

// 🔹 Excluir usuário
async function del(req, res) {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({ where: { id: Number(id) } });
        return res.json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return res.status(500).json({ error: "Erro ao excluir usuário." });
    }
}

module.exports = { create, login, read, readById, update, delete: del };
