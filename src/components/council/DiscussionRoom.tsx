"use client";
import React, { useEffect, useState } from 'react';
import { Bot, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { callProvider, getStoredKey, modelLabel, type ProviderId } from './modelClients';

type Role = 'Strategist' | 'Writer' | 'Quality Control';

interface Message {
  role: Role | 'System';
  model: string;
  text: string;
  timestamp: string;
}

const ROLE_PROVIDER_PREFERENCE: Record<Role, ProviderId[]> = {
  Strategist: ['claude', 'grok', 'gemini', 'chatgpt'],
  Writer: ['gemini', 'chatgpt', 'claude', 'grok'],
  'Quality Control': ['chatgpt', 'grok', 'claude', 'gemini'],
};

const ROLE_SYSTEM_PROMPT: Record<Role, string> = {
  Strategist:
    "You are the Strategist on a small project council. Read the project context and the conversation so far, then give sharp, prioritized, concrete next-step guidance in 2-4 sentences. No fluff.",
  Writer:
    "You are the Writer on a small project council. Build directly on the Strategist's point with concrete content, copy, or implementation detail in 2-4 sentences. No fluff.",
  'Quality Control':
    "You are Quality Control on a small project council. Critically review what's been proposed so far, flag risks or gaps, and give a clear verdict in 2-4 sentences. No fluff.",
};

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function resolveProvider(role: Role): ProviderId | null {
  for (const provider of ROLE_PROVIDER_PREFERENCE[role]) {
    if (getStoredKey(provider)) return provider;
  }
  return null;
}

export default function DiscussionRoom({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [running, setRunning] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    const providers: ProviderId[] = ['claude', 'gemini', 'chatgpt', 'grok'];
    setConnectedCount(providers.filter((p) => getStoredKey(p)).length);
    setMessages([
      {
        role: 'System',
        model: 'Council',
        text: `Council room for "${projectId}" is ready. Say what you want the council to work on.`,
        timestamp: timestamp(),
      },
    ]);
  }, [projectId]);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'Strategist': return 'border-blue-500 text-blue-400 bg-blue-500/5';
      case 'Writer': return 'border-emerald-500 text-emerald-400 bg-emerald-500/5';
      case 'Quality Control': return 'border-red-500 text-red-400 bg-red-500/5';
      default: return 'border-slate-700 text-slate-400 bg-slate-800/20';
    }
  };

  async function runCouncil(userText: string) {
    setRunning(true);
    const history: { role: 'user' | 'assistant'; text: string }[] = [
      { role: 'user', text: `Project: ${projectId}\n\n${userText}` },
    ];

    for (const role of ['Strategist', 'Writer', 'Quality Control'] as Role[]) {
      const provider = resolveProvider(role);
      if (!provider) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'System',
            model: 'Council',
            text: `Skipping ${role} — no connected AI hookup available. Connect one in the Workspace.`,
            timestamp: timestamp(),
          },
        ]);
        continue;
      }

      const apiKey = getStoredKey(provider)!;
      try {
        const reply = await callProvider(provider, apiKey, ROLE_SYSTEM_PROMPT[role], history);
        history.push({ role: 'assistant', text: `${role}: ${reply}` });
        setMessages((prev) => [
          ...prev,
          { role, model: modelLabel(provider), text: reply, timestamp: timestamp() },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'System',
            model: 'Council',
            text: `${role} (${provider}) failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
            timestamp: timestamp(),
          },
        ]);
      }
    }
    setRunning(false);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text || running) return;
    setMessages((prev) => [
      ...prev,
      { role: 'System', model: 'You', text, timestamp: timestamp() },
    ]);
    setDraft('');
    runCouncil(text);
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Council Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400" />
            AI Council Debate
          </h2>
          <p className="text-[10px] text-slate-500 uppercase">
            {connectedCount} of 4 hookups connected
          </p>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'System' ? 'justify-center opacity-60' : ''}`}>
            {msg.role !== 'System' && (
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot size={20} className={msg.role === 'Quality Control' ? 'text-red-400' : 'text-blue-400'} />
              </div>
            )}

            <div className={`max-w-[80%] rounded-2xl p-4 border ${getRoleStyle(msg.role)}`}>
              {msg.role !== 'System' && (
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs uppercase tracking-widest">{msg.role}</span>
                  <span className="text-[10px] font-mono opacity-50">{msg.model} • {msg.timestamp}</span>
                </div>
              )}
              <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {running && (
          <div className="flex justify-center opacity-60">
            <p className="text-xs text-slate-500">Council is deliberating&hellip;</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="relative">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Give the council something to work on..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={running || !draft.trim()}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
          <AlertTriangle size={12} className="text-amber-500" />
          Calls go directly from your browser to each connected provider using the keys saved in Workspace.
        </p>
      </div>
    </div>
  );
}
