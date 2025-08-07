# CRMS Integration Architecture

## Integration Overview

The CRMS system integrates with several external services to provide comprehensive functionality:

1. **Payment Processing**: Stripe for credit cards, Swiss QR bills for bank transfers
2. **Communication**: Resend for transactional emails
3. **File Storage**: Supabase Storage for photos and documents
4. **Authentication**: Supabase Auth for user management
5. **Monitoring**: Sentry for error tracking and performance

## Stripe Integration

### Payment Processing Setup
```typescript
// lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(
  amount: number,
  contractId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'chf',
    metadata: {
      contract_id: contractId,
      company_id: getCurrentCompanyId(),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function handleWebhook(
  payload: string,
  signature: string
): Promise<void> {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      await markPaymentComplete(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
  }
}
```

### Webhook Handler
```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest } from 'next/server';
import { handleWebhook } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  try {
    await handleWebhook(body, signature);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
```

### Payment Components
```tsx
// components/payments/StripePayment.tsx
'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripePayment({ 
  amount, 
  contractId, 
  onSuccess 
}: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('');
  
  useEffect(() => {
    // Create payment intent
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, contractId }),
    })
    .then(res => res.json())
    .then(data => setClientSecret(data.clientSecret));
  }, [amount, contractId]);
  
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm onSuccess={onSuccess} />
    </Elements>
  );
}
```

## Swiss QR Bill Integration

### QR Bill Generation
```typescript
// lib/qr-bill.ts
import { SwissQRBill } from 'swissqrbill';

export function generateQRBill(payment: Payment): Buffer {
  const data = {
    currency: 'CHF',
    amount: payment.amount,
    reference: generateReference(payment.id),
    creditor: {
      name: company.name,
      address: company.address,
      city: company.city,
      postalCode: company.postal_code,
      country: 'CH',
      account: 'CH93 0076 2011 6238 5295 7',
    },
    debtor: {
      name: `${customer.first_name} ${customer.last_name}`,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postal_code,
      country: 'CH',
    },
  };
  
  return SwissQRBill.PDF(data);
}

function generateReference(paymentId: string): string {
  // Generate ISO 11649 creditor reference
  const base = paymentId.replace(/-/g, '').slice(-20);
  const checksum = calculateChecksum(base);
  return `RF${checksum}${base}`;
}
```

### QR Bill API Endpoint
```typescript
// app/api/payments/[id]/qr-bill/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await getPayment(params.id);
    const qrBillPDF = generateQRBill(payment);
    
    return new Response(qrBillPDF, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="qr-bill-${payment.id}.pdf"`,
      },
    });
  } catch (error) {
    return new Response('QR bill generation failed', { status: 500 });
  }
}
```

## Email Integration (Resend)

### Email Service Setup
```typescript
// lib/email.ts
import { Resend } from 'resend';
import ContractConfirmationEmail from '@/emails/contract-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContractEmail(
  contract: Contract,
  customer: Customer
): Promise<void> {
  await resend.emails.send({
    from: 'CRMS <noreply@crms.ch>',
    to: customer.email,
    subject: `Rental Contract ${contract.contract_number}`,
    react: ContractConfirmationEmail({ contract, customer }),
    attachments: [
      {
        filename: `contract-${contract.contract_number}.pdf`,
        content: await generateContractPDF(contract),
      },
    ],
  });
}

export async function sendPaymentReminder(
  payment: Payment,
  customer: Customer
): Promise<void> {
  await resend.emails.send({
    from: 'CRMS Finance <finance@crms.ch>',
    to: customer.email,
    subject: `Payment Reminder - ${payment.reference_number}`,
    react: PaymentReminderEmail({ payment, customer }),
  });
}
```

### Email Templates
```tsx
// emails/contract-confirmation.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

interface ContractConfirmationEmailProps {
  contract: Contract;
  customer: Customer;
}

export default function ContractConfirmationEmail({
  contract,
  customer,
}: ContractConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Contract Confirmation</Text>
          <Text style={paragraph}>
            Dear {customer.first_name} {customer.last_name},
          </Text>
          <Text style={paragraph}>
            Your rental contract {contract.contract_number} has been confirmed.
          </Text>
          <Button
            pX={20}
            pY={12}
            style={btn}
            href={`https://crms.ch/contracts/${contract.id}`}
          >
            View Contract
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

## File Storage Integration

### Supabase Storage Setup
```typescript
// lib/storage.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function uploadPhoto(
  file: File,
  contractId: string,
  photoType: 'pickup' | 'return' | 'damage'
): Promise<string> {
  const fileName = `${contractId}/${photoType}/${Date.now()}-${file.name}`;
  
  // Compress image before upload
  const compressedFile = await compressImage(file);
  
  const { data, error } = await supabase.storage
    .from('contract-photos')
    .upload(fileName, compressedFile, {
      contentType: file.type,
      upsert: false,
    });
    
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('contract-photos')
    .getPublicUrl(data.path);
    
  return publicUrl;
}

export async function generateThumbnail(imagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('contract-photos')
    .createSignedUrl(imagePath, 3600, {
      transform: {
        width: 300,
        height: 200,
        resize: 'contain',
      },
    });
    
  if (error) throw error;
  return data.signedUrl;
}
```

### Photo Upload Component
```tsx
// components/photos/PhotoUploader.tsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadPhoto } from '@/lib/storage';

export function PhotoUploader({ 
  contractId, 
  photoType, 
  onUpload 
}: PhotoUploaderProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const url = await uploadPhoto(file, contractId, photoType);
        onUpload(url);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  }, [contractId, photoType, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-6">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the photos here...</p>
      ) : (
        <p>Drag photos here, or click to select</p>
      )}
    </div>
  );
}
```

## Error Monitoring Integration

### Sentry Configuration
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/.*\.crms\.ch/,
        /^https:\/\/.*\.supabase\.co/,
      ],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    
    if (event.contexts?.response?.data) {
      delete event.contexts.response.data;
    }
    
    return event;
  },
});
```

### Error Boundary
```tsx
// components/ErrorBoundary.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">
            We've been notified about this error and will fix it soon.
          </p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      )}
      beforeCapture={(scope) => {
        scope.setTag('section', 'ui');
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
}
```

## Real-time Integration

### Supabase Realtime
```typescript
// lib/realtime.ts
import { createClient } from '@/lib/supabase/client';

export function subscribeToVehicleStatus(
  companyId: string,
  callback: (payload: any) => void
) {
  const supabase = createClient();
  
  return supabase
    .channel('vehicle-status')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'vehicles',
        filter: `company_id=eq.${companyId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToContractUpdates(
  companyId: string,
  callback: (payload: any) => void
) {
  const supabase = createClient();
  
  return supabase
    .channel('contract-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contracts',
        filter: `company_id=eq.${companyId}`,
      },
      callback
    )
    .subscribe();
}
```

### Real-time Hooks
```tsx
// hooks/useRealtime.ts
'use client';

import { useEffect, useState } from 'react';
import { subscribeToVehicleStatus } from '@/lib/realtime';

export function useVehicleStatus(companyId: string) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  useEffect(() => {
    const subscription = subscribeToVehicleStatus(companyId, (payload) => {
      const { eventType, new: newData, old: oldData } = payload;
      
      setVehicles((current) => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newData];
          case 'UPDATE':
            return current.map((v) => 
              v.id === newData.id ? newData : v
            );
          case 'DELETE':
            return current.filter((v) => v.id !== oldData.id);
          default:
            return current;
        }
      });
    });
    
    return () => subscription.unsubscribe();
  }, [companyId]);
  
  return vehicles;
}
```

---

**Document Version:** 3.0 - Integration Architecture
**Last Updated:** 2025-08-06
**Status:** Ready for Implementation