import express from "express";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from "fs";
import yaml from "js-yaml";

async function main() {
    const app = express();
    app.use(express.json());

    try {
        const yamlPath = getPath();
        const swaggerFile = fs.readFileSync(yamlPath, 'utf8');
        const swaggerDocument = yaml.load(swaggerFile);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument as object));
        app.listen(3000, () => {
            console.info("Documentação disponível em http://localhost:3000/api-docs");
        });
    } catch (error) {
        console.error("Erro ao inicializar o servidor:", error);
        process.exit(1);
    }
};

function getPath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const yamlInSrc = path.join(__dirname, 'hackaton-swagger.yaml');
    const yamlFromDist = path.join(__dirname, '../src/hackaton-swagger.yaml');
    if (fs.existsSync(yamlInSrc)) {
        return yamlInSrc;
    } else if (fs.existsSync(yamlFromDist))
        return yamlFromDist;
    else
        throw new Error('Arquivo hackaton-swagger.yaml não encontrado');

}

main();