/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `paciente` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `paciente` table. All the data in the column will be lost.
  - You are about to drop the column `medicoId` on the `paciente` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `medicoId` on the `relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `relatorio` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `crm` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `especialidade` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `especialidadeDesejada` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `estadoAtuacao` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `matricula` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `nascimento` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `periodoFacul` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `senhaHash` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `uploadMatriculaUrl` on the `usuario` table. All the data in the column will be lost.
  - You are about to alter the column `telefone` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to drop the `remedio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `laudo` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Relatorio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `paciente` DROP FOREIGN KEY `Paciente_medicoId_fkey`;

-- DropForeignKey
ALTER TABLE `relatorio` DROP FOREIGN KEY `Relatorio_medicoId_fkey`;

-- DropForeignKey
ALTER TABLE `remedio` DROP FOREIGN KEY `Remedio_medicoId_fkey`;

-- DropForeignKey
ALTER TABLE `remedio` DROP FOREIGN KEY `Remedio_pacienteId_fkey`;

-- DropForeignKey
ALTER TABLE `remedio` DROP FOREIGN KEY `Remedio_relatorioId_fkey`;

-- DropIndex
DROP INDEX `Paciente_medicoId_fkey` ON `paciente`;

-- DropIndex
DROP INDEX `Relatorio_medicoId_fkey` ON `relatorio`;

-- DropIndex
DROP INDEX `Usuario_cpf_key` ON `usuario`;

-- DropIndex
DROP INDEX `Usuario_role_idx` ON `usuario`;

-- AlterTable
ALTER TABLE `paciente` DROP COLUMN `atualizadoEm`,
    DROP COLUMN `endereco`,
    DROP COLUMN `medicoId`,
    MODIFY `cpf` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `relatorio` DROP COLUMN `atualizadoEm`,
    DROP COLUMN `descricao`,
    DROP COLUMN `medicoId`,
    DROP COLUMN `titulo`,
    ADD COLUMN `laudo` TEXT NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `cpf`,
    DROP COLUMN `crm`,
    DROP COLUMN `endereco`,
    DROP COLUMN `especialidade`,
    DROP COLUMN `especialidadeDesejada`,
    DROP COLUMN `estado`,
    DROP COLUMN `estadoAtuacao`,
    DROP COLUMN `matricula`,
    DROP COLUMN `nascimento`,
    DROP COLUMN `periodoFacul`,
    DROP COLUMN `role`,
    DROP COLUMN `senhaHash`,
    DROP COLUMN `uploadMatriculaUrl`,
    ADD COLUMN `documentoUrl` VARCHAR(191) NULL,
    ADD COLUMN `identificacao` VARCHAR(191) NULL,
    ADD COLUMN `periodo` VARCHAR(191) NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PENDENTE', 'VERIFICADO', 'RECUSADO') NOT NULL DEFAULT 'PENDENTE',
    ADD COLUMN `tipo` ENUM('MEDICO', 'ACADEMICO', 'ADMIN') NOT NULL,
    MODIFY `telefone` VARCHAR(20) NULL;

-- DropTable
DROP TABLE `remedio`;

-- CreateTable
CREATE TABLE `Consulta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `observacoes` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pacienteId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `dosePadrao` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicamentoPrescrito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `dose` VARCHAR(191) NOT NULL,
    `horarios` VARCHAR(191) NOT NULL,
    `relatorioId` INTEGER NOT NULL,
    `medicamentoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'EM_ANALISE',
    `enviadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Relatorio` ADD CONSTRAINT `Relatorio_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicamentoPrescrito` ADD CONSTRAINT `MedicamentoPrescrito_relatorioId_fkey` FOREIGN KEY (`relatorioId`) REFERENCES `Relatorio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicamentoPrescrito` ADD CONSTRAINT `MedicamentoPrescrito_medicamentoId_fkey` FOREIGN KEY (`medicamentoId`) REFERENCES `Medicamento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
