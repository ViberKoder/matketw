'use client';

import { useState } from 'react';
import axios from 'axios';

interface Request {
  id: string;
  channelId: string;
  targetChannel: string;
  votesNeeded: number;
  votesReceived: number;
  boostPaid: number;
  deadline: number;
  creator: string;
  status: string;
  priceUSD: number;
}

interface RequestCardProps {
  request: Request;
  price: number;
  userId: string | null;
  onVote: () => void;
}

export default function RequestCard({ request, price, userId, onVote }: RequestCardProps) {
  const [votes, setVotes] = useState(1);
  const [loading, setLoading] = useState(false);

  const progress = (request.votesReceived / request.votesNeeded) * 100;
  const deadlineDate = new Date(request.deadline * 1000);
  const isExpired = Date.now() > request.deadline * 1000;

  const handleVote = async () => {
    if (!userId) {
      alert('Пожалуйста, войдите через Telegram');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      await axios.post(`${apiUrl}/api/requests/${request.id}/vote`, {
        userId,
        votes
      });
      
      alert(`Успешно проголосовано за ${votes} голосов! Вы получите ${votes} BOOST токенов.`);
      onVote();
    } catch (error: any) {
      console.error('Vote failed:', error);
      alert(error.response?.data?.error || 'Ошибка при голосовании');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">Канал #{request.targetChannel}</h3>
          <p className="text-sm text-telegram-hint">
            Нужно голосов: {request.votesNeeded.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-telegram-link">
            ${(request.boostPaid * price).toFixed(2)}
          </p>
          <p className="text-xs text-telegram-hint">
            {request.boostPaid.toLocaleString()} BOOST
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Прогресс</span>
          <span>
            {request.votesReceived.toLocaleString()} / {request.votesNeeded.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-telegram-button h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-telegram-hint">
          Дедлайн: {deadlineDate.toLocaleDateString('ru-RU')}
        </span>
        <span className={`px-2 py-1 rounded ${
          request.status === 'active' && !isExpired
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isExpired ? 'Истек' : 'Активна'}
        </span>
      </div>

      {!isExpired && request.status === 'active' && userId && (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="1"
            value={votes}
            onChange={(e) => setVotes(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-button"
          />
          <button
            onClick={handleVote}
            disabled={loading}
            className="px-4 py-2 bg-telegram-button text-telegram-buttonText rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : `Проголосовать`}
          </button>
        </div>
      )}

      {!userId && (
        <div className="text-sm text-telegram-hint text-center py-2">
          Войдите через Telegram для голосования
        </div>
      )}

      <div className="mt-2 text-xs text-telegram-hint">
        За {votes} голосов вы получите {votes} BOOST токенов
        {price > 0 && ` ($${(votes * price).toFixed(4)})`}
      </div>
    </div>
  );
}
