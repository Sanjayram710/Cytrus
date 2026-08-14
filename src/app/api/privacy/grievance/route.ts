import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { name, email, phone, grievanceType, description } = body;

    if (!email || !description) {
      return NextResponse.json({ error: 'Email and description are required.' }, { status: 400 });
    }

    const ticketId = `DPDP-GRV-${Math.floor(100000 + Math.random() * 900000)}`;

    const record = await prisma.dataPrivacyRequest.create({
      data: {
        userId: session?.id || null,
        customerEmail: email,
        customerPhone: phone || null,
        requestType: 'GRIEVANCE',
        status: 'PENDING',
        details: `Ticket: ${ticketId} | Name: ${name || 'N/A'} | Type: ${grievanceType || 'GENERAL'} | Query: ${description}`,
      },
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Your privacy grievance has been registered with the Data Protection Officer. We will respond within the statutory timeframe (under 30 days) as mandated by the DPDP Act 2023.',
      requestId: record.id,
    });
  } catch (error: any) {
    console.error('DPDP Grievance Submission Error:', error);
    return NextResponse.json({ error: 'Failed to record grievance' }, { status: 500 });
  }
}
