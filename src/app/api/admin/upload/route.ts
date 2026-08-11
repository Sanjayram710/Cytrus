import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let originalName = 'image.png';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file found in request' }, { status: 400 });
      }
      originalName = file.name;
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } else {
      const body = await req.json();
      if (!body.base64) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }
      originalName = body.fileName || 'image.png';
      const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Create uploads directory inside public if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique safe filename
    const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `upload_${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error('File upload API error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
