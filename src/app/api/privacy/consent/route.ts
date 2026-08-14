import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, sessionId, consentType, status, noticeVersion = '1.0' } = body;

    if (!consentType || !status) {
      return NextResponse.json({ error: 'consentType and status are required' }, { status: 400 });
    }

    // Anonymize IP address via SHA-256 hash for privacy-safe audit trail
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const log = await prisma.consentLog.create({
      data: {
        userId: userId || null,
        sessionId: sessionId || null,
        consentType,
        status: status.toUpperCase(), // "GRANTED" | "WITHDRAWN"
        noticeVersion,
        ipHash,
        userAgent,
      },
    });

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error: any) {
    console.error('DPDP Consent logging error:', error);
    return NextResponse.json({ error: 'Failed to record consent' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'userId or sessionId required' }, { status: 400 });
    }

    const logs = await prisma.consentLog.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(sessionId ? [{ sessionId }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch consent logs' }, { status: 500 });
  }
}
