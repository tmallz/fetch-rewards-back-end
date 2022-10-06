import express from 'express';
import supabase from '../client.js';
var router = express.Router();
var payer;
var points;

//gets all transactions from the transactions table and returns them ordered by timstamp
router.get('/', async (req, res) => {
	//call to supabase DB to get all transactions
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

//Inserts a new transactoin into the transactions table
router.post('/', async (req, res) => {
	//initialize errors array and check if the post body is properly fulled out
	payer = req.body.payer;
	points = req.body.points;
	const newPointsTotal = await getNewPointsTotal(payer, points);
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
	//insert transaction into transactions table
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
	await updatePayers(payer, newPointsTotal);
});

//Function that takes in the posted payer and points and returns the total points associated with
//that payer
const getNewPointsTotal = async (payer, points) => {
	//gets all transactions points for specified payert
	const transactionsPointsInDb = await supabase
		.from('transactions')
		.select('points')
		.eq('payer', payer);
	//If the response length is 0 adds new payer and points to the payer table and returns points
	console.log(transactionsPointsInDb.body.length);
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
	//else loops over transactions points and sums them up and returns total
	const currentPointsArray = transactionsPointsInDb.body;
	let currentPointsTotal = 0;
	currentPointsArray.forEach(pointObject => {
		currentPointsTotal = currentPointsTotal + pointObject.points;
	});
	return currentPointsTotal;
};

//Function that takes in a payer and the total points associated with that payer and
//updates the totalPoints of that payer in the DB
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
