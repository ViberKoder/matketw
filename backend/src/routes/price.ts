import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Get BOOST token price in USD
router.get('/boost', async (req: Request, res: Response) => {
    try {
        // In a real implementation, you would:
        // 1. Query a DEX or price oracle for BOOST/USD
        // 2. Calculate from TON price if needed
        // 3. Cache the price for a short period
        
        // For now, return a fixed price or calculate from TON
        let boostPrice = 0.01; // Default fallback
        
        try {
            const tonPriceResponse = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd',
                { timeout: 5000 }
            );
            const tonPriceUSD = tonPriceResponse.data['the-open-network']?.usd || 2.5;
            // Assume 1 BOOST = 0.01 TON (adjust based on your tokenomics)
            boostPrice = tonPriceUSD * 0.01;
        } catch (error) {
            // Use fallback price
            console.log('Failed to fetch TON price, using fallback');
        }
        
        res.json({
            price: boostPrice,
            currency: 'USD',
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.json({
            price: 0.01, // Default fallback
            currency: 'USD',
            timestamp: Date.now()
        });
    }
});

export { router as priceRouter };
