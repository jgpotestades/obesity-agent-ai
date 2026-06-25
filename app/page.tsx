'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function Home() {
  // Use explicit local state to manage the input so it is never undefined
  const [chatInput, setChatInput] = useState('');

  // @ts-ignore
  const { messages, append, isLoading } = useChat();

  // Handle input text changes safely
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  // Manually append the message to force the endpoint request
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentMessage = chatInput;
    setChatInput(''); // Clear input bar immediately for a smooth UI feel

    // @ts-ignore
    await append({
      role: 'user',
      content: currentMessage,
    });
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-50 p-6">
      <header className="w-full max-w-3xl text-center my-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Agentic AI Obesity Risk Classifier</h1>
        <p className="text-slate-500 mt-2">Powered by Next.js, Vercel AI SDK, and Kaggle Dataset parameters</p>
      </header>

      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[500px]">
        {/* Chat Window */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {(!messages || messages.length === 0) && (
            <p className="text-slate-400 text-center mt-12">
              Tell the agent your age, weight, height, and general dietary habits to begin the assessment.
            </p>
          )}
          {messages && messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                <p className="text-sm font-semibold mb-1">{m.role === 'user' ? 'You' : 'AI Consultant Agent'}</p>
                <p className="whitespace-pre-wrap">{m.text || m.content || ''}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={onFormSubmit} className="p-4 border-t border-slate-200 flex gap-2">
          <input
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            value={chatInput}
            placeholder="e.g., I am a 24-year-old male, 1.70m tall, weighing 81.6kg. I eat high-caloric foods..."
            onChange={handleInputChange}
          />
          <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>
    </main>
  );
}