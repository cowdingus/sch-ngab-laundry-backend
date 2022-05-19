require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req, res) => {
	res.send("Welcome to NgabLaundry API");
});

app.use('/', require('./routes/entry'));
app.use('/user', require('./routes/user'));
app.use('/member', require('./routes/member'));
app.use('/package', require('./routes/package'));
app.use('/transaction', require('./routes/transaction'));
app.use('/transaction_detail', require('./routes/transactiondetail'));

app.use((err, _req, res, _next) => {
	res.status(500).json({"message": "Internal server error"});
	console.error(err);
});

app.listen(port, () => console.log(`Listening at port ${port}`));

