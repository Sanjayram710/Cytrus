import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { PriceHistoryService } from '@/services/PriceHistoryService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const history = await PriceHistoryService.getPriceHistory(params.id);
    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 403 });
  }
}
