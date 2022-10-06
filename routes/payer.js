import express from 'express';
import supabase from '../client.js';
var router = express.Router();

//Gets all payers from the payers table
router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase.from('payers').select('*');
		res.json({ message: 'success', data: data });
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
});

//posts a new payer to the payer table
router.post('/', async (req, res) => {
	var errors = [];
	if (!req.body.payer) {
		errors.push('Payer must be included');
	}
	if (!req.body.pointsTotal) {
		errors.push('Points must be included');
	}
	try {
		const { error } = await supabase.from('payers').insert({
			payer: req.body.payer,
			pointsTotal: 0,
		});
		res.json({
			message: 'success',
		});
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
		res.status(400).json({ error: errors.join(',') });
	}
});

export default router;
