import express, { json } from 'express';
import supabase from '../client.js';
var router = express.Router();
var payer;
var points;

router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('transactions')
			.select()
			.order('timestamp', { ascending: true });
		res.json({ message: 'success', data: data });
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
});

router.post('/', async (req, res) => {
	var errors = [];
	if (!req.body.payer) {
		errors.push('Payer must be included');
	}
	if (!req.body.points) {
		errors.push('Points must be included');
	}
	if (errors.length) {
		res.status(400).json({ error: errors.join(',') });
	}
	payer = req.body.payer;
	points = req.body.points;
	try {
		const { error } = await supabase.from('transactions').insert({
			payer: req.body.payer,
			points: req.body.points,
			timestamp: new Date().toISOString(),
		});
		res.json({
			message: 'success',
		});
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
	const newPointsTotal = await getNewPointsTotal(payer, points);
	await updatePayers(payer, newPointsTotal);
});

const getNewPointsTotal = async (payer, points) => {
	const transactionsPointsInDb = await supabase
		.from('transactions')
		.select('points')
		.eq('payer', payer);
	if (transactionsPointsInDb.body.length === 0) {
		try {
			const { error } = await supabase.from('payers').insert({
				payer: payer,
				pointsTotal: points,
			});
			if (error) {
				throw error;
			}
			console.log('update payer table');
		} catch (error) {
			console.error(error);
		}
		return points;
	}
	const currentPointsArray = transactionsPointsInDb.body;
	let currentPointsTotal = 0;
	currentPointsArray.forEach(pointObject => {
		currentPointsTotal = currentPointsTotal + pointObject.points;
	});
	return currentPointsTotal;
};

const updatePayers = async (payer, pointsTotal) => {
	try {
		const { error } = await supabase
			.from('payers')
			.update({
				payer: payer,
				pointsTotal: pointsTotal,
			})
			.eq('payer', payer);
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
};

export default router;
