import express from 'express';
import supabase from '../client.js';
var router = express.Router();

router.post('/', async (res, req) => {
	const { data, error } = await supabase.from('transactions').select;
});

export default router;
