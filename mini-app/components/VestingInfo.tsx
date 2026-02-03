'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface VestingData {
  userId: string;
  totalBoost: number;
  lockedBoost: number;
  unlockedBoost: number;
  unlockTime: number;
  votesGiven: number;
  canWithdraw: boolean;
  balance: number;
}

interface VestingInfoProps {
  userId: string;
}

export default function VestingInfo({ userId }: VestingInfoProps) {
  const [vesting, setVesting] = useState<VestingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchVesting();
    }
  }, [userId]);

  const fetchVesting = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/api/vesting/${userId}`);
      setVesting(response.data);
    } catch (error) {
      console.error('Failed to fetch vesting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userId || !vesting) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      await axios.post(`${apiUrl}/api/vesting/${userId}/withdraw`);
      
      alert('Токены успешно выведены!');
      fetchVesting();
    } catch (error: any) {
      console.error('Withdraw failed:', error);
      alert(error.response?.data?.error || 'Ошибка при выводе токенов');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !vesting) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="text-center">Загрузка информации о вестинге...</div>
      </div>
    );
  }

  if (!vesting || vesting.totalBoost === 0) {
    return null;
  }

  const unlockDate = vesting.unlockTime > 0 ? new Date(vesting.unlockTime * 1000) : null;
  const isUnlocked = vesting.unlockedBoost > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">💰 Мои токены BOOST</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-telegram-hint">Баланс:</span>
          <span className="font-semibold">{vesting.balance.toLocaleString()} BOOST</span>
        </div>
        <div className="flex justify-between">
          <span className="text-telegram-hint">Всего токенов:</span>
          <span className="font-semibold">{vesting.totalBoost.toLocaleString()} BOOST</span>
        </div>
        <div className="flex justify-between">
          <span className="text-telegram-hint">Заблокировано:</span>
          <span className="font-semibold text-orange-600">
            {vesting.lockedBoost.toLocaleString()} BOOST
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-telegram-hint">Доступно:</span>
          <span className="font-semibold text-green-600">
            {vesting.unlockedBoost.toLocaleString()} BOOST
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-telegram-hint">Голосов отдано:</span>
          <span>{vesting.votesGiven.toLocaleString()}</span>
        </div>
        {unlockDate && (
          <div className="flex justify-between text-sm">
            <span className="text-telegram-hint">Разблокировка:</span>
            <span>{unlockDate.toLocaleDateString('ru-RU')}</span>
          </div>
        )}
      </div>

      {isUnlocked && vesting.unlockedBoost > 0 && (
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full px-4 py-2 bg-telegram-button text-telegram-buttonText rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Обработка...' : `Вывести ${vesting.unlockedBoost.toLocaleString()} BOOST`}
        </button>
      )}

      {!isUnlocked && unlockDate && (
        <div className="text-sm text-telegram-hint text-center">
          Токены будут разблокированы {unlockDate.toLocaleDateString('ru-RU')}
        </div>
      )}
    </div>
  );
}
