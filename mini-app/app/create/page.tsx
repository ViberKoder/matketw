'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { getTelegramUserId, readyMiniApp, expandMiniApp } from '@/lib/telegram';

export default function CreateRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const channelId = searchParams.get('channel') || '';
  
  const [votesNeeded, setVotesNeeded] = useState(100);
  const [deadline, setDeadline] = useState('');
  const [boostAmount, setBoostAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    readyMiniApp();
    expandMiniApp();
    
    const tgUserId = getTelegramUserId();
    setUserId(tgUserId);
    
    // Set default deadline to 7 days from now
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 7);
    setDeadline(defaultDeadline.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Пожалуйста, войдите через Telegram');
      return;
    }

    if (!channelId) {
      alert('Не указан ID канала');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
      
      const response = await axios.post(`${apiUrl}/api/requests`, {
        channelId,
        targetChannel: channelId,
        votesNeeded: parseInt(votesNeeded.toString()),
        deadline: deadlineTimestamp,
        boostAmount: parseInt(boostAmount.toString()),
        creator: userId
      });
      
      alert('Заявка успешно создана!');
      router.push('/');
    } catch (error: any) {
      console.error('Error creating request:', error);
      alert(error.response?.data?.error || 'Ошибка при создании заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📝 Создать заявку на голоса</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Канал ID
            </label>
            <input
              type="text"
              value={channelId}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Количество голосов
            </label>
            <input
              type="number"
              min="1"
              value={votesNeeded}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setVotesNeeded(val);
                setBoostAmount(val); // 1 vote = 1 BOOST
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
              required
            />
            <p className="text-xs text-telegram-hint mt-1">
              Стоимость: {boostAmount} BOOST (1 голос = 1 BOOST)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Дедлайн
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Итого:</strong> {boostAmount} BOOST токенов
            </p>
            <p className="text-xs text-telegram-hint mt-1">
              Токены будут списаны с вашего баланса при создании заявки
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !userId}
            className="w-full px-4 py-2 bg-telegram-button text-telegram-buttonText rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать заявку'}
          </button>
        </form>

        <button
          onClick={() => router.push('/')}
          className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Отмена
        </button>
      </div>
    </main>
  );
}
