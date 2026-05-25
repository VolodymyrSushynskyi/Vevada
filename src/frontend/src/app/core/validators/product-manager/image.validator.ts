export const MAX_FILE_SIZE_MB = 3;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Возвращает строку с ошибкой или null, если всё отлично
export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Недопустимий формат файлу. Використовуйте JPG, PNG або WebP.';
  }

  const fileSizeMb = file.size / (1024 * 1024);
  if (fileSizeMb > MAX_FILE_SIZE_MB) {
    return `Розмір файлу "${file.name}" занадто великий. Максимум ${MAX_FILE_SIZE_MB} МБ.`;
  }

  return null;
}
