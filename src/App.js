import "./App.css";
import axios from "axios";

const src = "https://checkout.razorpay.com/v1/checkout.js";

// loading razorpay script

const loadRazorPay = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Onclick on pay

const razorPayHandler = async (e) => {
  const res = await loadRazorPay(src);
  if (!res) {
    alert("Razorpay failed to load");
    return;
  }

  //Getting prder details from backend

  const { data } = await axios.get("http://localhost:5000/razorpay");
  console.log(data);

  //Payment object
  const options = {
    key: "rzp_test_gy4pYCfsAEgpjH", //input your test razorpay key id
    amount: data.amount,
    currency: data.currency,
    name: "Total Price",
    description: "Test Transaction",
    // image: "https://example.com/your_logo",
    order_id: data.id,
    handler: function (response) {
      //Alert
      alert(response.razorpay_payment_id);
      alert(response.razorpay_order_id);
      alert(response.razorpay_signature);
    },
    prefill: {
      name: "Gaurav Kumar",
      email: "gaurav34@gmail.com",
    },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();

  //if payment fails

  // rzp.on("payment.failed", function (response) {
  //   alert(response.error.code);
  //   alert(response.error.description);
  //   alert(response.error.source);
  //   alert(response.error.step);
  //   alert(response.error.reason);
  //   alert(response.error.metadata.order_id);
  //   alert(response.error.metadata.payment_id);
  // });

  e.preventDefault();
};

function App() {
  return (
    <div className="App">
      <h3>Ready to pay ?</h3>
      <button onClick={razorPayHandler}>Pay Now</button>
    </div>
  );
}

export default App;
