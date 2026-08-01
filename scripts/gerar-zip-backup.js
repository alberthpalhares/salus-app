import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const SALUS_DIR = 'D:\\10-19 PESSOAL\\13 Saúde\\13.10 Salus';
const OUTPUT_ZIP = path.resolve(process.cwd(), 'salus-backup-pessoal.zip');

function readDirRecursive(dirPath, baseDir, zip) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    // Ignorar pastas como node_modules, .git, bin, etc
    if (item.name === 'node_modules' || item.name === '.git' || item.name === '.agents') {
      continue;
    }

    if (item.isDirectory()) {
      readDirRecursive(fullPath, baseDir, zip);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zip.file(relativePath, fileData);
      console.log(`+ Adicionado: ${relativePath}`);
    }
  }
}

async function gerarZip() {
  console.log(`📦 Lendo diretório legados Salus: ${SALUS_DIR}...`);
  const zip = new JSZip();

  readDirRecursive(SALUS_DIR, SALUS_DIR, zip);

  console.log('⚡ Gerando arquivo ZIP...');
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  fs.writeFileSync(OUTPUT_ZIP, content);
  console.log(`✅ Arquivo de backup gerado com sucesso: ${OUTPUT_ZIP} (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
}

gerarZip().catch(err => {
  console.error('❌ Erro ao gerar ZIP:', err);
});
