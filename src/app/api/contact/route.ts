import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/blob-data';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }

    await addMessage({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    // OPTIONAL email notification — see note in chat (requires RESEND_API_KEY).
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio <onboarding@resend.dev>',
            to: ['moskovicher93@gmail.com'],
            subject: `New message from ${name}`,
            text: `From: ${name} (${email})\n\n${message}`,
          }),
        });
      } catch {
        /* notification is best-effort; the message is already saved */
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
