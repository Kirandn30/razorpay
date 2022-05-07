const express = require("express")
const Razorpay = require("razorpay")
const shortid = require('shortid');
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")

app.use(cors())

app.use(bodyParser.json())

const razorpay = new Razorpay({
    key_id: 'rzp_test_p7pvWZgPn8elDU',
    key_secret: '1CFqbCDvwUtbu7RNXLqUvm6x',
});

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '1234554321'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 200 })
})


app.post("/razorpay", async (req, res) => {

    const amount = 599
    const currency = "INR"

    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: shortid.generate()
    };

    try {
        const response = await razorpay.orders.create(options)
        console.log(response);
        res.json({
            id: response.id,
            amount: response.amount,
            currency:response.currency
        })
    } catch (error) {
        console.log(error);
    }

})

app.listen(4001, () => {
    console.log("hey im listening on port 4001");

})
