export async function iniciarBackup() {
  console.log("Backup iniciado");
}

export async function performBackup() {
  console.log("performBackup ejecutado");
  return new Date().toISOString();
}

export async function limpiarBackupsAntiguos() {
  console.log("limpiarBackupsAntiguos ejecutado");
} 