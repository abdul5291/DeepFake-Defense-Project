import JSZip from 'jszip';
import {
  generateManifestJson,
  generateContentScriptJs,
  generatePopupHtml,
  generateBackgroundJs,
} from './extensionGenerator';

export async function generateExtensionZip(): Promise<Blob> {
  const zip = new JSZip();

  zip.file('manifest.json', generateManifestJson());
  zip.file('content_script.js', generateContentScriptJs());
  zip.file('popup.html', generatePopupHtml());
  zip.file('background.js', generateBackgroundJs());

  const imagesFolder = zip.folder('images');
  if (imagesFolder) {
    imagesFolder.file(
      'icon-16.png',
      generatePlaceholderIcon(16),
      { binary: true }
    );
    imagesFolder.file(
      'icon-48.png',
      generatePlaceholderIcon(48),
      { binary: true }
    );
    imagesFolder.file(
      'icon-128.png',
      generatePlaceholderIcon(128),
      { binary: true }
    );
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

function generatePlaceholderIcon(size: number): ArrayBuffer {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new ArrayBuffer(0);
  }

  ctx.fillStyle = '#00ff88';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#001a00';
  ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('D', size / 2, size / 2);

  return canvas.toDataURL().split(',')[1];
}

export function downloadExtension(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'deede-extension.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
