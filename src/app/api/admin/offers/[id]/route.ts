import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { OfferService } from '@/services/OfferService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: { id: true, name: true, price: true, sku: true },
        },
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { action, notes, overrideReason } = body;
    const adminName = session.name || session.email || 'Admin';

    if (action === 'APPROVE') {
      const updated = await OfferService.approveOffer(params.id, adminName, notes);
      return NextResponse.json({ success: true, offer: updated });
    }

    if (action === 'REJECT') {
      const updated = await OfferService.rejectOffer(params.id, adminName, notes);
      return NextResponse.json({ success: true, offer: updated });
    }

    if (action === 'OVERRIDE') {
      const updated = await OfferService.overrideOffer(params.id, adminName, overrideReason);
      return NextResponse.json({ success: true, offer: updated });
    }

    if (action === 'SUSPEND') {
      const updated = await OfferService.suspendOffer(params.id, adminName, notes);
      return NextResponse.json({ success: true, offer: updated });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating offer' }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    const offer = await prisma.offer.findUnique({ where: { id: params.id } });
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    await prisma.offer.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        user: session.name || session.email || 'Admin',
        action: 'OFFER_DELETED',
        entity: 'OFFER',
        entityId: params.id,
        oldValue: JSON.stringify(offer),
        notes: `Offer "${offer.offerName}" deleted by admin.`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting offer' }, { status: 400 });
  }
}
