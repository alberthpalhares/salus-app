/**
 * Formatadores puros de texto e valores
 */

export function formatarEspecie(especie: string): string {
  if (!especie) return 'Membro';
  switch (especie.toLowerCase()) {
    case 'cão':
    case 'cao':
    case 'dog':
      return 'Cão 🐶';
    case 'gato':
    case 'cat':
      return 'Gato 🐱';
    case 'humano':
    case 'pesssoal':
      return 'Humano 👤';
    default:
      return especie;
  }
}

export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
