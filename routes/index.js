import express from 'express';
var router = express.Router();

import payer from './payer.js';
import transactions from './transactions.js';
import balances from './balances.js';
import spend from './spend.js';

router.use('/transactions', transactions);
router.use('/payer', payer);
router.use('/balances', balances);
router.use('/spend', spend);

export default router;
