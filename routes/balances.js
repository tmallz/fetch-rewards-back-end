import express from 'express';
import supabase from '../client.js';
var router = express.Router();

//Gets the balances for each payer from the payers table
router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('payers')
			.select('payer, pointsTotal');
		res.json({ message: 'success', data: data });
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
});

export default router;
