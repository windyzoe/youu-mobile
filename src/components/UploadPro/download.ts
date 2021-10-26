export function getDownloadURL(fileId: string | number) {
  return `/api/download?fileId=${fileId}`;
}

export function startDownload(fileId: string | number) {
  window.open(`/api/download?fileId=${fileId}`);
}

export function getUploadUrl() {
  return '/api/upload';
}
