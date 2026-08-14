/**
 * Celebritee.in — Reusable Server-Side n8n WhatsApp Notification Service
 *
 * Securely dispatches lifecycle events and verified payment confirmations to
 * the n8n Cloud webhook for WhatsApp customer notifications.
 *
 * NOTE: This service runs EXCLUSIVELY on the server side.
 * Never import or execute this code on the frontend / browser.
 */

export type N8nEventType =
  | 'PAYMENT_SUCCESS'
  | 'ORDER_CONFIRMED'
  | 'ORDER_PACKED'
  | 'ORDER_SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface N8nCustomerInfo {
  name: string;
  phone: string;
}

export interface N8nOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface N8nOrderEventPayload {
  event: N8nEventType;
  orderId: string;
  eventId: string;
  customer: N8nCustomerInfo;
  items: N8nOrderItem[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
}

export interface N8nDispatchResult {
  success: boolean;
  status: 'sent' | 'skipped' | 'rejected' | 'error' | 'disabled' | string;
  eventId?: string;
  payload?: N8nOrderEventPayload;
  httpStatus?: number;
  data?: any;
  error?: string;
}

export interface N8nDispatchOptions {
  timeoutMs?: number;
  forceDispatch?: boolean;
}

/**
 * Normalizes Indian and international phone numbers into clean digits with country code.
 * Example outputs: "919812345678", "919876543210"
 */
export function normalizeCustomerPhone(phoneInput?: string | null): string {
  if (!phoneInput) return '910000000000';
  const cleanDigits = phoneInput.replace(/\D/g, '');

  if (cleanDigits.length === 10) {
    // 10-digit Indian standard mobile number -> prefix with 91
    return `91${cleanDigits}`;
  } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0')) {
    // 11-digit number with leading 0 (e.g. 09812345678) -> strip 0 and prefix with 91
    return `91${cleanDigits.slice(1)}`;
  } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    // Already 12-digit Indian number with 91
    return cleanDigits;
  }

  // Fallback to cleaned digits
  return cleanDigits || '910000000000';
}

/**
 * Generates a stable, deterministic eventId for duplicate protection in n8n.
 * e.g., "PAYMENT_SUCCESS:LXW-1001" or "PAYMENT_SUCCESS:ORD-1001"
 */
export function generateEventId(event: N8nEventType, orderIdentifier: string): string {
  return `${event}:${orderIdentifier}`;
}

/**
 * Constructs the standardized JSON payload expected by the n8n WhatsApp workflow.
 */
export function buildN8nPayload(order: any, event: N8nEventType = 'PAYMENT_SUCCESS'): N8nOrderEventPayload {
  const orderIdentifier = order.orderNumber || order.id || 'UNKNOWN_ORDER';
  const eventId = generateEventId(event, orderIdentifier);

  // Normalize order items
  let items: N8nOrderItem[] = [];
  if (Array.isArray(order.items) && order.items.length > 0) {
    items = order.items.map((item: any) => ({
      name: item.productName || item.name || item.title || 'Celebritee Garment',
      quantity: Number(item.quantity) || 1,
      price: Math.round(Number(item.price) || 0),
    }));
  } else {
    items = [
      {
        name: 'Celebritee Heavyweight Apparel',
        quantity: 1,
        price: Math.round(Number(order.total) || 0),
      },
    ];
  }

  const customerName = order.customerName || (order.user && order.user.name) || 'Valued Customer';
  const rawPhone = order.customerPhone || (order.user && order.user.phone) || '';
  const customerPhone = normalizeCustomerPhone(rawPhone);

  const totalAmount = Math.round(Number(order.total) || 0);
  const paymentStatus = order.paymentStatus || (event === 'PAYMENT_SUCCESS' ? 'PAID' : 'PENDING');
  const orderStatus = order.orderStatus || 'CONFIRMED';

  return {
    event,
    orderId: orderIdentifier,
    eventId,
    customer: {
      name: customerName,
      phone: customerPhone,
    },
    items,
    totalAmount,
    paymentStatus,
    orderStatus,
  };
}

/**
 * Sends an order event notification to the n8n WhatsApp workflow.
 *
 * Guarantees:
 * 1. Safe execution: will NEVER throw an uncaught exception that interrupts payment/order flows.
 * 2. Strict timeout: uses AbortController with 8-second default timeout.
 * 3. Stable eventId: prevents duplicate WhatsApp notifications.
 * 4. Safe development mode: dispatches only when N8N_ENABLE_NOTIFICATIONS is "true".
 * 5. Webhook security: includes X-Celebritee-Webhook-Secret header if configured.
 */
export async function sendN8nOrderNotification(
  order: any,
  event: N8nEventType = 'PAYMENT_SUCCESS',
  options?: N8nDispatchOptions
): Promise<N8nDispatchResult> {
  const timeoutMs = options?.timeoutMs ?? 8000;
  const isEnabled = process.env.N8N_ENABLE_NOTIFICATIONS === 'true' || options?.forceDispatch === true;
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  const payload = buildN8nPayload(order, event);

  // Development safety guard: Skip actual network dispatch unless explicitly enabled
  if (!isEnabled) {
    console.log(
      `[N8N WhatsApp] Notifications disabled (N8N_ENABLE_NOTIFICATIONS=${process.env.N8N_ENABLE_NOTIFICATIONS}). Skipping webhook dispatch for ${payload.orderId} (${payload.eventId}).`
    );
    return {
      success: true,
      status: 'disabled',
      eventId: payload.eventId,
      payload,
    };
  }

  if (!webhookUrl) {
    console.warn('[N8N WhatsApp] N8N_WEBHOOK_URL is not defined in environment variables. Webhook skipped.');
    return {
      success: false,
      status: 'error',
      eventId: payload.eventId,
      payload,
      error: 'N8N_WEBHOOK_URL is not defined',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Celebritee-ECommerce-Server/1.0',
  };

  if (webhookSecret && webhookSecret.trim() !== '') {
    headers['X-Celebritee-Webhook-Secret'] = webhookSecret.trim();
  }

  try {
    console.log(`[N8N WhatsApp] Sending notification: ${payload.event} for Order ${payload.orderId} [${payload.eventId}]`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let responseData: any = {};
    const textData = await response.text();
    try {
      responseData = JSON.parse(textData);
    } catch {
      responseData = { rawResponse: textData };
    }

    // Handle n8n response codes & status contracts
    if (response.ok) {
      if (responseData?.status === 'skipped') {
        console.log(`[N8N WhatsApp] Duplicate notification skipped: ${payload.orderId} [${payload.eventId}]`);
        return {
          success: true,
          status: 'skipped',
          eventId: payload.eventId,
          httpStatus: response.status,
          data: responseData,
          payload,
        };
      }

      console.log(`[N8N WhatsApp] Notification sent: ${payload.orderId} [${payload.eventId}]`);
      return {
        success: true,
        status: responseData?.status || 'sent',
        eventId: payload.eventId,
        httpStatus: response.status,
        data: responseData,
        payload,
      };
    }

    if (response.status === 400) {
      console.warn(`[N8N WhatsApp] Notification rejected (HTTP 400) for Order ${payload.orderId}:`, responseData);
      return {
        success: false,
        status: 'rejected',
        eventId: payload.eventId,
        httpStatus: 400,
        data: responseData,
        payload,
        error: 'n8n rejected payload (HTTP 400)',
      };
    }

    if (response.status === 502) {
      console.error(`[N8N WhatsApp] Notification failed (HTTP 502 WhatsApp Error) for Order ${payload.orderId}:`, responseData);
      return {
        success: false,
        status: 'error',
        eventId: payload.eventId,
        httpStatus: 502,
        data: responseData,
        payload,
        error: 'n8n downstream WhatsApp delivery error (HTTP 502)',
      };
    }

    console.error(`[N8N WhatsApp] Notification failed with HTTP ${response.status} for Order ${payload.orderId}`);
    return {
      success: false,
      status: 'error',
      eventId: payload.eventId,
      httpStatus: response.status,
      data: responseData,
      payload,
      error: `Webhook returned HTTP ${response.status}`,
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      console.error(`[N8N WhatsApp] Notification failed: Request timed out after ${timeoutMs}ms for Order ${payload.orderId}`);
      return {
        success: false,
        status: 'error',
        eventId: payload.eventId,
        payload,
        error: `Webhook request timed out after ${timeoutMs}ms`,
      };
    }

    console.error(`[N8N WhatsApp] Notification failed for Order ${payload.orderId}:`, err?.message || err);
    return {
      success: false,
      status: 'error',
      eventId: payload.eventId,
      payload,
      error: err?.message || 'Network dispatch error',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Convenience drop-in function matching standard signature.
 * Defaults to PAYMENT_SUCCESS event.
 */
export async function sendOrderWhatsAppNotification(
  order: any,
  options?: N8nDispatchOptions
): Promise<N8nDispatchResult> {
  return sendN8nOrderNotification(order, 'PAYMENT_SUCCESS', options);
}
