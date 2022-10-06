import express from 'express';
import supabase from '../client.js';
var router = express.Router();
let transactionsArray = [];
let pointsToSpend;
let spentPoints;

//post call that manages all the logic
//Unsure why it made me do req.req.body and res.res.json
router.post('/', async (res, req) => {
	transactionsArray = await getTransactionsOrderedByTime();
	pointsToSpend = req.req.body.points;
	spentPoints = await spendPoints(pointsToSpend, transactionsArray);
	res.res.json({
		message: 'success',
		data: spentPoints,
	});
});

//gets transactons ordered by timestamp from db
const getTransactionsOrderedByTime = async () => {
	const transactionsFromDb = await supabase
		.from('transactions')
		.select()
		.order('timestamp', { ascending: true });
	return transactionsFromDb.body;
};

//Function to caluclate balances for each payer after spending points and return it and update payers table
//to refelct that.
const spendPoints = async (pointsToSpend, transactions) => {
	let pointsRemaining = pointsToSpend;
	var payersToUpdate = {};
	let pointsSpent = {};
	let transactionsToDelete = [];
	let transactionToUpdate = [];
	let counter = 0;

	//loops over transactions as long as there are points remaing to be spent and tracks how much each transaction spends
	//and how much each payer will need to be updated with calls helper functions to updatePayers, delete transactions, and
	//update the transaction that has remaining points.
	while (pointsRemaining > 0) {
		let payer = transactions[counter].payer;
		let points = transactions[counter].points;
		if (pointsRemaining > points) {
			pointsRemaining = pointsRemaining - points;
			if (payersToUpdate[payer] === undefined) {
				payersToUpdate[payer] = points;
			} else {
				payersToUpdate[payer] += points;
			}
			if (pointsSpent[payer] === undefined) {
				pointsSpent[payer] = points * -1;
			} else {
				pointsSpent[payer] -= points;
			}
			transactionsToDelete.push(transactions[counter].id);
		} else {
			points = points - pointsRemaining;
			if (payersToUpdate[payer] === undefined) {
				payersToUpdate[payer] = points;
			} else {
				payersToUpdate[payer] += points;
			}
			if (pointsSpent[payer] === undefined) {
				pointsSpent[payer] = pointsRemaining * -1;
			} else {
				pointsSpent[payer] -= pointsRemaining;
			}
			pointsRemaining = 0;
			transactionToUpdate.push(transactions[counter].id);
			transactionToUpdate.push(points - pointsRemaining);
		}
		counter++;
	}
	//convert payersToUpdate object to an array of arrays
	const arrayOfPayersToUpdate = Object.entries(payersToUpdate);
	await updatePayersTable(arrayOfPayersToUpdate);
	await deleteTransactions(transactionsToDelete);
	await updateTransaction(transactionToUpdate);
	return pointsSpent;
};

//helper function to update the payers table with the new points
var updatePayersTable = async payersArray => {
	payersArray.forEach(async payer => {
		let newPoints = await getCurrentPayerValues(payer[0], payer[1]);
		console.log(payer[0], payer[1], newPoints);
		try {
			await supabase
				.from('payers')
				.update({
					payer: payer[0],
					pointsTotal: newPoints,
				})
				.eq('payer', payer[0]);
			console.log('updated payers table sucessfully');
		} catch (error) {
			console.error(error);
		}
	});
};

//helper function to get the new total points after spend
const getCurrentPayerValues = async (payer, points) => {
	//gets current
	try {
		const { data, error } = await supabase
			.from('payers')
			.select('pointsTotal')
			.eq('payer', payer);
		if (error) {
			throw error;
		}
		let dbPoints = data[0].pointsTotal;
		let newPoints = dbPoints - points;
		return newPoints;
	} catch (error) {
		console.error(error);
	}
};

const deleteTransactions = async idArray => {
	idArray.forEach(async id => {
		try {
			const { error } = await supabase
				.from('transactions')
				.delete()
				.eq('id', id);
			if (error) {
				throw error;
			}
			console.log('successfully deleted transaction');
		} catch (error) {
			console.error(error);
		}
	});
};

const updateTransaction = async transaction => {
	try {
		const { error } = await supabase
			.from('transactions')
			.update({
				points: transaction[1],
			})
			.eq('id', transaction[0]);
		if (error) {
			throw error;
		}
	} catch (error) {
		console.error(error);
	}
};
export default router;
