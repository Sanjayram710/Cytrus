import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession, clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to submit an erasure request.' }, { status: 401 });
    }

    const { confirmationText, reason } = await req.json();

    if (confirmationText !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Please confirm by typing "DELETE MY ACCOUNT" exactly.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { orders: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const anonymizedIdentifier = `ANONYMIZED_USER_${user.id.substring(0, 8).toUpperCase()}`;

    // 1. Anonymize Orders to preserve statutory accounting & tax records (GST/IT Act 7-year mandate)
    // while wiping personal identifiable information
    await prisma.order.updateMany({
      where: { userId: user.id },
      data: {
        customerName: '[DELETED_USER]',
        customerEmail: `deleted_${user.id.substring(0, 8)}@privacy.anonymized`,
        customerPhone: 'XXXXXXXXXX',
        shippingAddressJson: JSON.stringify({ note: 'Anonymized pursuant to DPDP Act 2023 Section 12' }),
      },
    });

    // 2. Log final Erasure Request for regulatory compliance
    await prisma.dataPrivacyRequest.create({
      data: {
        userId: user.id,
        customerEmail: user.email,
        customerPhone: user.phone,
        requestType: 'ERASURE_DELETE',
        status: 'COMPLETED',
        details: `Reason: ${reason || 'User self-service deletion'}. Anonymized reference: ${anonymizedIdentifier}`,
        resolvedAt: new Date(),
      },
    });

    // 3. Delete user account and associated personal cascading records (addresses, carts, wishlists, reviews)
    await prisma.user.delete({
      where: { id: user.id },
    });

    await clearAuthCookie();

    return NextResponse.json({
      success: true,
      message: 'Your personal data and account have been permanently erased from CELEBRITEE servers pursuant to the DPDP Act 2023.',
    });
  } catch (error: any) {
    console.error('DPDP Erasure Request Error:', error);
    return NextResponse.json({ error: 'Failed to process data erasure request' }, { status: 500 });
  }
}
