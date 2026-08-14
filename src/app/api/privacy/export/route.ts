import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to export your personal data.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: true,
          },
        },
        wishlists: {
          include: {
            items: {
              include: {
                product: {
                  select: { name: true, slug: true, price: true },
                },
              },
            },
          },
        },
        reviews: true,
        consentLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build structured, clean DPDP Data Portability Export object
    const exportPackage = {
      exportMetadata: {
        platform: 'CELEBRITEE.in / CYTRUS ATELIER',
        statutoryFramework: 'Digital Personal Data Protection Act, 2023 (DPDP Act)',
        exportTimestamp: new Date().toISOString(),
        dataPrincipalId: user.id,
      },
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone || 'Not Provided',
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
      },
      savedAddresses: user.addresses.map((addr) => ({
        fullName: addr.fullName,
        phone: addr.phone,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      })),
      orderHistory: user.orders.map((ord) => ({
        orderNumber: ord.orderNumber,
        date: ord.createdAt,
        status: ord.orderStatus,
        paymentStatus: ord.paymentStatus,
        totalAmount: ord.total,
        items: ord.items.map((item) => ({
          productName: item.productName,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
      wishlistItems: user.wishlists.flatMap((w) =>
        w.items.map((it) => ({
          product: it.product.name,
          price: it.product.price,
          addedAt: it.createdAt,
        }))
      ),
      reviewsWritten: user.reviews.map((rev) => ({
        rating: rev.rating,
        title: rev.title,
        comment: rev.comment,
        date: rev.createdAt,
      })),
      consentAuditTrail: user.consentLogs.map((log) => ({
        consentType: log.consentType,
        status: log.status,
        noticeVersion: log.noticeVersion,
        timestamp: log.createdAt,
      })),
    };

    // Log the data access request for DPDP auditing
    await prisma.dataPrivacyRequest.create({
      data: {
        userId: user.id,
        customerEmail: user.email,
        customerPhone: user.phone,
        requestType: 'ACCESS_EXPORT',
        status: 'COMPLETED',
        details: 'Self-service automated personal data export generated',
      },
    });

    return new NextResponse(JSON.stringify(exportPackage, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="CELEBRITEE_Personal_Data_${user.id}_${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    console.error('DPDP Data Export Error:', error);
    return NextResponse.json({ error: 'Failed to generate data export package' }, { status: 500 });
  }
}
