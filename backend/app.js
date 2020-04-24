const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

app.get('/rooms', function (req, res) {
	res.json({
		category: req.query.cat,
		date: req.query.date,
		price: {
			current: Math.floor(Math.random() * 1000),
			recommend: Math.floor(Math.random() * 1000),
		},
	});
});

app.post('/rooms', function (req, res) {
	res.json(req.body.rooms);
});

app.listen(8000, () => console.log('Listening on 8000'));

