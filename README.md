# 🩺 MedSync

**MedSync** é uma aplicação web desenvolvida com **Node.js**, **Express** e **Prisma ORM**, voltada para **gestão de pacientes, relatórios médicos e prescrições**.  
O sistema permite que **médicos** e **acadêmicos de medicina** cadastrem seus pacientes, criem **laudos clínicos** e prescrevam **medicações** com controle completo de dosagem e horários.

---

## 🚀 Funcionalidades Principais

- 👨‍⚕️ **Cadastro de usuários (médicos e acadêmicos)** com papéis distintos  
- 🧍‍♂️ **Cadastro de pacientes** vinculados a um médico  
- 🩻 **Criação de relatórios/laudos** associados a pacientes e médicos  
- 💊 **Cadastro de remédios** dentro de cada relatório (nome, dose, descrição e horários)  
- 🗂️ **Histórico completo** de relatórios e prescrições por paciente  
- 🔐 **Autenticação segura** com senha criptografada (bcrypt) e JWT  
- 💻 **Interface minimalista e intuitiva**, com tons neutros e destaque apenas em elementos principais  

---

## 🧠 Estrutura de Relacionamentos

```mermaid
erDiagram
    USUARIO ||--o{ PACIENTE : "possui"
    USUARIO ||--o{ RELATORIO : "cria"
    USUARIO ||--o{ REMEDIO : "prescreve"
    PACIENTE ||--o{ RELATORIO : "possui"
    PACIENTE ||--o{ REMEDIO : "recebe"
    RELATORIO ||--o{ REMEDIO : "contém"
🧩 Tecnologias Utilizadas
Node.js – Ambiente backend

Express.js – Framework para rotas HTTP

Prisma ORM – ORM moderno para o MySQL

MySQL – Banco de dados relacional

bcrypt – Criptografia de senhas

JWT – Autenticação de usuários

HTML / CSS / JavaScript – Interface web simples e leve

Font Awesome – Ícones da interface

Render / Vercel – Deploy opcional para nuvem

🗃️ Estrutura do Banco de Dados (Prisma)
📋 Modelo: Usuario
Campos: nome, cpf, email, telefone, endereço, senhaHash

Campos específicos de médico: especialidade, CRM, estadoAtuacao

Campos específicos de acadêmico: instituição, matrícula, períodoFacul, uploadMatriculaUrl

Relacionamentos:

pacientes — pacientes sob sua responsabilidade

relatorios — relatórios criados pelo médico

remedios — prescrições registradas

📋 Modelo: Paciente
Campos: nome, cpf, email, telefone, endereço, status

Relacionamentos:

medicoId — médico responsável

relatorios — relatórios do paciente

📋 Modelo: Relatorio
Campos: título, descrição, criadoEm, atualizadoEm

Relacionamentos:

pacienteId — paciente atendido

medicoId — médico que realizou o atendimento

remedios — medicamentos prescritos

📋 Modelo: Remedio
Campos: nome, descrição, dose, horários

Relacionamentos:

medicoId — médico que prescreveu

pacienteId — paciente destinatário

relatorioId — relatório em que foi incluído

⚙️ Como Executar o Projeto
1️⃣ Clonar o repositório
bash
Copiar código
git clone https://github.com/seuusuario/medsync.git
cd medsync
2️⃣ Instalar dependências
bash
Copiar código
npm install
3️⃣ Configurar o banco de dados
Crie um arquivo .env na raiz do projeto:

env
Copiar código
DATABASE_URL="mysql://usuario:senha@localhost:3306/medsync"
JWT_SECRET="sua_chave_segura_aqui"
4️⃣ Rodar as migrações do Prisma
bash
Copiar código
npx prisma migrate dev --name init
5️⃣ Iniciar o servidor
bash
Copiar código
npm start
Servidor disponível em:
👉 http://localhost:3000

📁 Estrutura de Pastas (recomendada)
pgsql
Copiar código
📦 medsync
 ┣ 📂 prisma
 ┃ ┗ 📜 schema.prisma
 ┣ 📂 src
 ┃ ┣ 📂 controllers
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 middlewares
 ┃ ┗ 📂 services
 ┣ 📂 public
 ┃ ┣ 📂 css
 ┃ ┣ 📂 js
 ┃ ┗ 📂 html
 ┣ 📜 .env
 ┣ 📜 package.json
 ┣ 📜 README.md
 ┗ 📜 server.js
🧰 Comandos Úteis
Comando	Descrição
npx prisma studio	Abre o painel visual do Prisma
npx prisma generate	Regenera o Prisma Client
npm run dev	Executa o servidor em modo desenvolvimento
npm start	Executa o servidor em modo produção

🌐 Deploy no Render (opcional)
Crie um novo Web Service no Render.com

Configure as variáveis de ambiente:

ini
Copiar código
DATABASE_URL="mysql://usuario:senha@host:3306/medsync"
JWT_SECRET="chave_segura"
Branch: main

Build Command:

nginx
Copiar código
npx prisma generate
Start Command:

sql
Copiar código
npm start
💬 Autor
👨‍💻 Lucas Paiva
Fundador da Paiva Tech
📍 Jaguariúna - SP
📧 paival907@gmail.com
📞 (19) 99689-2382
📸 @paivatech__

🩵 Licença
Este projeto é de uso restrito para fins educacionais e comerciais da Paiva Tech.
© 2025 — Todos os direitos reservados.