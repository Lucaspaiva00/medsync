const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

// 🔹 Garante que a pasta 'uploads/' exista
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage }).single("documento");

// CREATE — Upload de documento
async function create(req, res) {
    upload(req, res, async (err) => {
        try {
            if (err) {
                console.error("❌ Erro no multer:", err);
                return res.status(500).json({ error: "Erro no upload do arquivo." });
            }

            const { usuarioId, tipo } = req.body;
            if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });

            const documentoUrl = `/uploads/${req.file.filename}`;

            // Salva o documento
            const documento = await prisma.documento.create({
                data: {
                    usuarioId: Number(usuarioId),
                    tipo,
                    url: documentoUrl,
                    status: "EM_ANALISE",
                },
            });

            // Atualiza o usuário com o link do documento
            await prisma.usuario.update({
                where: { id: Number(usuarioId) },
                data: { documentoUrl },
            });

            console.log("📎 Documento salvo com sucesso:", documento);
            return res.status(201).json({
                message: "Documento enviado com sucesso!",
                documento,
            });
        } catch (error) {
            console.error("🔥 Erro ao criar documento:", error.message);
            return res.status(500).json({ error: "Erro ao criar documento." });
        }
    });
}

// READ — Lista todos ou um documento específico
async function read(req, res) {
    try {
        const { id } = req.params;

        if (id) {
            const doc = await prisma.documento.findUnique({ where: { id: Number(id) } });
            return res.json(doc);
        }

        const docs = await prisma.documento.findMany({
            include: { usuario: { select: { nome: true, tipo: true } } },
        });

        return res.json(docs);
    } catch (error) {
        console.error("🔥 Erro ao buscar documentos:", error.message);
        return res.status(500).json({ error: "Erro ao buscar documentos." });
    }
}

// UPDATE — Aprovar/Reprovar documento
async function update(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const doc = await prisma.documento.update({
            where: { id: Number(id) },
            data: { status },
        });

        return res.json({ message: "Documento atualizado com sucesso.", documento: doc });
    } catch (error) {
        console.error("🔥 Erro ao atualizar documento:", error.message);
        return res.status(500).json({ error: "Erro ao atualizar documento." });
    }
}

// DELETE — Remove documento
async function del(req, res) {
    try {
        const { id } = req.params;
        await prisma.documento.delete({ where: { id: Number(id) } });
        return res.json({ message: "Documento excluído." });
    } catch (error) {
        console.error("🔥 Erro ao excluir documento:", error.message);
        return res.status(500).json({ error: "Erro ao excluir documento." });
    }
}

module.exports = { create, read, update, delete: del };
