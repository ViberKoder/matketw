'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import RequestCard from '@/components/RequestCard';
import VestingInfo from '@/components/VestingInfo';
import { getTelegramUserId, readyMiniApp, expandMiniApp } from '@/lib/telegram';

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

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    readyMiniApp();
    expandMiniApp();
    
    const tgUserId = getTelegramUserId();
    setUserId(tgUserId);
    
    fetchRequests();
    fetchPrice();
  }, []);

  const fetchRequests = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/api/requests`);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrice = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/api/price/boost`);
      setPrice(response.data.price);
    } catch (error) {
      console.error('Failed to fetch price:', error);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🚀 Boost Marketplace</h1>
        </div>

        {userId && <VestingInfo userId={userId} />}

        <div className="mb-6">
          <p className="text-sm text-telegram-hint">
            Текущая цена BOOST: <span className="font-semibold">${price.toFixed(4)}</span>
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">Активные заявки</h2>
          {loading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-telegram-hint">
              Нет активных заявок
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  price={price}
                  userId={userId}
                  onVote={fetchRequests}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
