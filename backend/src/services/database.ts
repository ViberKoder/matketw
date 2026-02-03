import * as fs from 'fs-extra';
import * as path from 'path';
import { Request, VestingInfo, User } from '../models/types';

const DATA_DIR = process.env.DATA_DIR || './data';
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Initialize files if they don't exist
if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeJsonSync(REQUESTS_FILE, []);
}

if (!fs.existsSync(USERS_FILE)) {
    fs.writeJsonSync(USERS_FILE, {});
}

export class Database {
    // Requests
    static getRequests(): Request[] {
        try {
            return fs.readJsonSync(REQUESTS_FILE);
        } catch (error) {
            return [];
        }
    }

    static getRequest(id: string): Request | null {
        const requests = this.getRequests();
        return requests.find(r => r.id === id) || null;
    }

    static saveRequest(request: Request): void {
        const requests = this.getRequests();
        const index = requests.findIndex(r => r.id === request.id);
        if (index >= 0) {
            requests[index] = request;
        } else {
            requests.push(request);
        }
        fs.writeJsonSync(REQUESTS_FILE, requests, { spaces: 2 });
    }

    static getActiveRequests(): Request[] {
        const requests = this.getRequests();
        const now = Math.floor(Date.now() / 1000);
        return requests.filter(r => 
            r.status === 'active' && 
            r.deadline > now &&
            r.votesReceived < r.votesNeeded
        );
    }

    // Users
    static getUser(userId: string): User | null {
        try {
            const users = fs.readJsonSync(USERS_FILE);
            return users[userId] || null;
        } catch (error) {
            return null;
        }
    }

    static getOrCreateUser(userId: string): User {
        let user = this.getUser(userId);
        if (!user) {
            user = {
                id: userId,
                boostBalance: 0,
                vesting: {
                    userId,
                    totalBoost: 0,
                    lockedBoost: 0,
                    unlockTime: 0,
                    votesGiven: 0,
                    transactions: []
                }
            };
            this.saveUser(user);
        }
        return user;
    }

    static saveUser(user: User): void {
        const users = fs.readJsonSync(USERS_FILE);
        users[user.id] = user;
        fs.writeJsonSync(USERS_FILE, users, { spaces: 2 });
    }

    static updateUserBoost(userId: string, amount: number): void {
        const user = this.getOrCreateUser(userId);
        user.boostBalance += amount;
        this.saveUser(user);
    }

    static addVesting(userId: string, requestId: string, votes: number, unlockTime: number): void {
        const user = this.getOrCreateUser(userId);
        const boostAmount = votes; // 1 vote = 1 BOOST
        
        user.vesting.totalBoost += boostAmount;
        user.vesting.lockedBoost += boostAmount;
        user.vesting.votesGiven += votes;
        user.vesting.transactions.push({
            requestId,
            votes,
            boostAmount,
            unlockTime,
            timestamp: Math.floor(Date.now() / 1000)
        });
        
        this.saveUser(user);
    }

    static unlockVestedTokens(userId: string): number {
        const user = this.getOrCreateUser(userId);
        const now = Math.floor(Date.now() / 1000);
        
        let unlocked = 0;
        user.vesting.transactions = user.vesting.transactions.filter(tx => {
            if (tx.unlockTime <= now && tx.boostAmount > 0) {
                unlocked += tx.boostAmount;
                return false; // Remove unlocked transaction
            }
            return true;
        });
        
        if (unlocked > 0) {
            user.vesting.lockedBoost = Math.max(0, user.vesting.lockedBoost - unlocked);
            user.boostBalance += unlocked;
            this.saveUser(user);
        }
        
        return unlocked;
    }

    static getVestingInfo(userId: string): VestingInfo {
        const user = this.getOrCreateUser(userId);
        // Unlock any tokens that are ready
        this.unlockVestedTokens(userId);
        return user.vesting;
    }
}
