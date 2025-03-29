const testUrl = 'https://speed.cloudflare.com/__down?bytes='; // 1MB file

export async function getDownloadSpeedMbps(): Promise<number> {
  const fileSizeBytes = 1000000;
  const fileUrl = `${testUrl}${fileSizeBytes}`;
  const startTimeMs = performance.now();
  await fetch(fileUrl)
    // Convert response to Blob to ensure the entire file is downloaded and not just headers
    .then(response => response.blob());
  const endTimeMs = performance.now();
  const fileSizeMbit = fileSizeBytes * 8 / 1000000;
  const durationSeconds = (endTimeMs - startTimeMs) / 1000;
  return fileSizeMbit / durationSeconds;
}
