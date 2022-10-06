const sequelize = require('../config/connection');
const { Transactions } = require('../models');
const transactionData = require('./transactionsData.json');

const seedDatabase = async () => {
	await sequelize.sync({ force: true });

	const transaction = await Transactions.bulkCreate(transactionData, {
		individualHooks: true,
		returning: true,
	});

	for (const transaction of transactionData) {
		await Transactions.create({
			...transaction,
			user_id: user[Math.floor(Math.random() * user.length)].id,
		});
	}

	process.exit(0);
};

seedDatabase();
