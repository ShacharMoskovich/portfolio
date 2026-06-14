'use client';

import { useState, useEffect } from 'react';

interface Labels {
  name: string; email: string; message: string; submit: string;
  sending: string; success: string; error: string;
}

export function ContactForm({ labels }: { labels: Labels }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill the message if arriving from a shop "Inquire" link (?message=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('message');
    if (prefill) setForm((f) => ({ ...f, message: prefill }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || labels.error);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : labels.error);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-display mb-2">✓</p>
        <p className="text-lg">{labels.success}</p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      <div>
        <label className="block text-sm font-medium mb-2">{labels.name}</label>
        <input type="text" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-border rounded px-4 py-3 bg-canvas" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{labels.email}</label>
        <input type="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-border rounded px-4 py-3 bg-canvas" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{labels.message}</label>
        <textarea rows={6} required value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-border rounded px-4 py-3 bg-canvas" />
      </div>
      {status === 'error' && <p className="text-red-600 text-sm">{errorMsg}</p>}
      <button type="submit" disabled={status === 'sending'}
        className="w-full bg-ink text-canvas py-3 rounded font-medium hover:opacity-80 disabled:opacity-50">
        {status === 'sending' ? labels.sending : labels.submit}
      </button>
    </form>
  );
}
