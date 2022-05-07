import React from 'react';
import './App.css';

const loadRazorPay = async () => {
  return new Promise(resolve => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function App() {

  const displayRazorPay = async () => {

    try {
      const res = await loadRazorPay()

      if (!res) {
        alert("razorpay SDK failed to load. are you online?")
      }

      const data = await fetch("http://localhost:4001/razorpay", { method: "POST" })
        .then((t) => t.json())

      const options = {
        "key": "rzp_test_p7pvWZgPn8elDU",

        "amount": data.amount.toString(),
        "currency": data.currency,
        "name": "Donation",
        "description": "Test Transaction",
        "image": "https://miurac.com/static/media/miurac.d1d0cf4a.svg",
        "order_id": data.id,
        "handler": function (response: any) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature)
        },
        "prefill": {
          "name": "Kiran",
          "email": "kirandn30@gmail.com"
        },
      };
      const _window = window as any
      const paymentObj = new _window.Razorpay(options);
      paymentObj.open()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <button onClick={displayRazorPay}>Pay 5$</button>
    </div>
  );
}

export default App;
