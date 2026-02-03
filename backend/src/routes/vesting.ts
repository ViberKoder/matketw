import { Router, Request, Response } from 'express';
import { Database } from '../services/database';

const router = Router();

// Get vesting info for user
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Unlock any tokens that are ready
        Database.unlockVestedTokens(userId);
        
        const user = Database.getOrCreateUser(userId);
        const vesting = user.vesting;
        
        const unlockedBoost = vesting.totalBoost - vesting.lockedBoost;
        const now = Math.floor(Date.now() / 1000);
        const canWithdraw = unlockedBoost > 0;
        
        res.json({
            userId,
            totalBoost: vesting.totalBoost,
            lockedBoost: vesting.lockedBoost,
            unlockedBoost,
            unlockTime: vesting.unlockTime,
            votesGiven: vesting.votesGiven,
            canWithdraw,
            balance: user.boostBalance
        });
    } catch (error) {
        console.error('Error fetching vesting:', error);
        res.status(500).json({ error: 'Failed to fetch vesting info' });
    }
});

// Withdraw tokens
router.post('/:userId/withdraw', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;
        
        // Unlock any tokens that are ready
        Database.unlockVestedTokens(userId);
        
        const user = Database.getOrCreateUser(userId);
        const unlocked = user.vesting.totalBoost - user.vesting.lockedBoost;
        
        const withdrawAmount = amount ? parseInt(amount) : unlocked;
        
        if (withdrawAmount <= 0) {
            return res.status(400).json({ error: 'No tokens available to withdraw' });
        }
        
        if (withdrawAmount > unlocked) {
            return res.status(400).json({ error: 'Insufficient unlocked tokens' });
        }
        
        // Update vesting
        user.vesting.totalBoost -= withdrawAmount;
        user.boostBalance += withdrawAmount;
        
        Database.saveUser(user);
        
        res.json({
            success: true,
            message: 'Tokens withdrawn successfully',
            withdrawn: withdrawAmount,
            newBalance: user.boostBalance
        });
    } catch (error) {
        console.error('Error withdrawing:', error);
        res.status(500).json({ error: 'Failed to withdraw tokens' });
    }
});

export { router as vestingRouter };
