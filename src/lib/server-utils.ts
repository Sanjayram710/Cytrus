import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { normalizeImageUrl } from './utils';

export async function processAndSaveImageUrl(url: string): Promise<string> {
  if (!url) return '';
  const trimmed = url.trim();

  // Safeguard: If input is not a valid URL or path (e.g. description text was pasted into Image URL field)
  if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('data:')
  ) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';
  }

  // If it's already a local upload or non-Google-Drive URL, return as is
  if (
    !trimmed.includes('drive.google.com') &&
    !trimmed.includes('docs.google.com') &&
    !trimmed.includes('googleusercontent.com')
  ) {
    return trimmed;
  }

  const normalized = normalizeImageUrl(trimmed);
  const match =
    normalized.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    normalized.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (match && match[1]) {
    const fileId = match[1];

    // Array of candidate download URLs to attempt
    const downloadEndpoints = [
      `https://lh3.googleusercontent.com/d/${fileId}`,
      `https://drive.google.com/uc?export=download&id=${fileId}`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
    ];

    for (const downloadUrl of downloadEndpoints) {
      try {
        const res = await fetch(downloadUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          // Ensure we actually got an image binary and not an HTML login/preview page
          if (
            contentType.includes('image/') ||
            contentType.includes('application/octet-stream')
          ) {
            const bytes = await res.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Determine file extension
            let ext = '.jpg';
            if (contentType.includes('png')) ext = '.png';
            else if (contentType.includes('webp')) ext = '.webp';
            else if (contentType.includes('gif')) ext = '.gif';
            else if (contentType.includes('svg')) ext = '.svg';

            const fileName = `upload_${Date.now()}_drive_${fileId}${ext}`;
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadsDir, { recursive: true });
            await writeFile(path.join(uploadsDir, fileName), buffer);

            return `/uploads/${fileName}`;
          }
        }
      } catch (e) {
        console.error(`Attempt to download from ${downloadUrl} failed:`, e);
      }
    }
  }

  return normalized;
}
