import express from 'express';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import supabase from './client.js';

const app = express();
var PORT = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
	res.json({ message: 'Ok' });
});

app.use(routes);

app.use(function (req, res) {
	res.status(404);
});

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
