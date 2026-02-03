export interface Request {
  id: string;
  channelId: string;
  targetChannel: string;
  votesNeeded: number;
  votesReceived: number;
  boostPaid: number;
  deadline: number;
  creator: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface VestingInfo {
  userId: string;
  totalBoost: number;
  lockedBoost: number;
  unlockTime: number;
  votesGiven: number;
  transactions: VestingTransaction[];
}

export interface VestingTransaction {
  requestId: string;
  votes: number;
  boostAmount: number;
  unlockTime: number;
  timestamp: number;
}

export interface User {
  id: string;
  boostBalance: number;
  vesting: VestingInfo;
}
