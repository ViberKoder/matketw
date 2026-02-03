import { Router, Request, Response } from 'express';
import { Database } from '../services/database';

const router = Router();

// Get all active requests
router.get('/', async (req: Request, res: Response) => {
    try {
        const requests = Database.getActiveRequests();
        const price = await getBoostPrice();
        
        const requestsWithPrice = requests.map(req => ({
            ...req,
            priceUSD: req.boostPaid * price
        }));
        
        res.json({ requests: requestsWithPrice });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Get request by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const request = Database.getRequest(id);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        const price = await getBoostPrice();
        
        res.json({
            ...request,
            priceUSD: request.boostPaid * price
        });
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ error: 'Failed to fetch request' });
    }
});

// Create request
router.post('/', async (req: Request, res: Response) => {
    try {
        const { channelId, targetChannel, votesNeeded, deadline, boostAmount, creator } = req.body;
        
        if (!channelId || !targetChannel || !votesNeeded || !deadline || !boostAmount || !creator) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if creator has enough BOOST
        const user = Database.getOrCreateUser(creator);
        if (user.boostBalance < boostAmount) {
            return res.status(400).json({ error: 'Insufficient BOOST balance' });
        }
        
        // Deduct BOOST from creator
        user.boostBalance -= boostAmount;
        Database.saveUser(user);
        
        // Create request
        const request: any = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            channelId,
            targetChannel,
            votesNeeded: parseInt(votesNeeded),
            votesReceived: 0,
            boostPaid: parseInt(boostAmount),
            deadline: parseInt(deadline),
            creator,
            status: 'active',
            createdAt: Math.floor(Date.now() / 1000)
        };
        
        Database.saveRequest(request);
        
        res.json({
            success: true,
            requestId: request.id,
            message: 'Request created successfully'
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

// Vote for channel
router.post('/:id/vote', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, votes } = req.body;
        
        if (!userId || !votes) {
            return res.status(400).json({ error: 'Missing userId or votes' });
        }
        
        const request = Database.getRequest(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        if (request.status !== 'active') {
            return res.status(400).json({ error: 'Request is not active' });
        }
        
        const now = Math.floor(Date.now() / 1000);
        if (request.deadline < now) {
            return res.status(400).json({ error: 'Request deadline has passed' });
        }
        
        const votesNum = parseInt(votes);
        request.votesReceived += votesNum;
        
        if (request.votesReceived >= request.votesNeeded) {
            request.status = 'completed';
        }
        
        Database.saveRequest(request);
        
        // Add vesting for user
        Database.addVesting(userId, id, votesNum, request.deadline);
        
        res.json({
            success: true,
            message: 'Vote recorded',
            request: request
        });
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: 'Failed to record vote' });
    }
});

async function getBoostPrice(): Promise<number> {
    try {
        // In a real implementation, get price from API or calculate
        // For now, return a fixed price
        return 0.01; // $0.01 per BOOST
    } catch (error) {
        return 0.01;
    }
}

export { router as requestsRouter };
