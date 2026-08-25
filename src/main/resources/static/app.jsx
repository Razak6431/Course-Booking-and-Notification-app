import { useState } from "react";
import "./App.css";

function App() {
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedCourse, setSelectedCourse] = useState({
    name: "Java Spring Boot",
    price: 499,
  });

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // =========================
  // SELECT COURSE
  // =========================

  const handleCourseSelect = (course) => {
    if (!studentName || !email) {
      alert("Please enter your name and email first.");
      return;
    }

    setSelectedCourse(course);
  };

  // =========================
  // PROCEED TO CHECKOUT
  // =========================

  const proceedToPayment = () => {
    if (!studentName || !email) {
      alert("Please enter your name and email first.");
      return;
    }

    setShowCheckout(true);
  };

  // =========================
  // BACK
  // =========================

  const goBack = () => {
    setShowCheckout(false);
    setPaymentSuccess(false);
  };

  // =========================
  // RAZORPAY PAYMENT
  // =========================

  const completePayment = async () => {
    try {
      console.log("Payment button clicked");

      /*
        Course price is in rupees.

        Example:
        ₹499 × 100 = 49900 paise
      */

      const amount = selectedCourse.price * 100;

      // Create Razorpay order through Spring Boot
      const response = await fetch(
        http://localhost:8080/api/payments/create-order?amount=${amount}&currency=INR,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          order creation failed: ${response.status}
        );
      }

      const order = await response.json();

      console.log("Razorpay order:", order);

      // Check Razorpay script
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout script is not loaded."
        );
      }

      // Razorpay configuration
      const options = {
        key: "rzp_test_TKO6Ctz5vDRU9D",

        amount: order.amount,

        currency: order.currency,

        name: "Course Payment",

        description: selectedCourse.name,

        order_id: order.id,

        prefill: {
          name: studentName,
          email: email,
        },

        handler: function (response) {
          console.log(
            "Payment successful:",
            response
          );

          alert(
            "Payment Successful!\nPayment ID: " +
              response.razorpay_payment_id
          );

          setPaymentSuccess(true);
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay popup closed"
            );
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      // Create Razorpay instance
      const razorpay = new window.Razorpay(
        options
      );

      // Open Razorpay popup
      razorpay.open();

    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        "Payment failed: " +
          error.message
      );
    }
  };

  // =========================
  // CHECKOUT PAGE
  // =========================

  if (showCheckout) {
    return (
      <div className="app">

        <div className="checkout-container">

          {!paymentSuccess ? (
            <>
              <button
                className="back-button"
                onClick={goBack}
              >
                ← Back
              </button>

              <h1>Checkout</h1>

              <div className="checkout-content">

                {/* PAYMENT DETAILS */}

                <div className="payment-section">

                  <h3>
                    PAYMENT DETAILS
                  </h3>

                  <h2>
                    Complete your purchase
                  </h2>

                  <div className="input-group">

                    <label>
                      Student Name
                    </label>

                    <input
                      type="text"
                      value={studentName}
                      readOnly
                    />

                  </div>

                  <div className="input-group">

                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      readOnly
                    />

                  </div>

                  <h3>
                    Payment Method
                  </h3>

                  <div className="payment-method">
                    💳 Card / UPI / Net Banking
                  </div>

                  <button
                    className="pay-button"
                    onClick={completePayment}
                  >
                    Pay ₹{selectedCourse.price}
                  </button>

                </div>

                {/* ORDER SUMMARY */}

                <div className="order-summary">

                  <h3>
                    ORDER SUMMARY
                  </h3>

                  <h2>
                    {selectedCourse.name}
                  </h2>

                  <p>
                    <b>Student:</b>{" "}
                    {studentName}
                  </p>

                  <p>
                    <b>Email:</b>{" "}
                    {email}
                  </p>

                  <hr />

                  <div className="price-row">

                    <span>
                      Course price
                    </span>

                    <span>
                      ₹{selectedCourse.price}
                    </span>

                  </div>

                  <div className="price-row total-row">

                    <b>Total</b>

                    <b>
                      ₹{selectedCourse.price}
                    </b>

                  </div>

                </div>

              </div>
            </>

          ) : (

            // =========================
            // SUCCESS PAGE
            // =========================

            <div className="success-box">

              <div className="success-icon">
                ✓
              </div>

              <h1>
                Payment Successful!
              </h1>

              <p>
                Thank you,{" "}
                <b>{studentName}</b>.
              </p>

              <p>
                You successfully purchased{" "}
                <b>
                  {selectedCourse.name}
                </b>.
              </p>

              <h2>
                ₹{selectedCourse.price}
              </h2>

              <button
                className="success-button"
                onClick={goBack}
              >
                Back to Courses
              </button>

            </div>
          )}

        </div>

      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="app">

      <h1>
        Course Payment
      </h1>

      <div className="container">

        {/* LEFT SECTION */}

        <div className="left-section">

          {/* STEP 1 */}

          <h3>
            STEP 1
          </h3>

          <h1>
            Student details
          </h1>

          <div className="student-details">

            <div>

              <label>
                Student name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) =>
                  setStudentName(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* STEP 2 */}

          <h3>
            STEP 2
          </h3>

          <h1>
            Select course
          </h1>

          <div className="courses">

            {/* JAVA */}

            <div className="course-card">

              <div className="course-image">
                Java
              </div>

              <h2>
                Java Spring Boot
              </h2>

              <p>
                Build production-ready REST
                APIs with Spring Boot
              </p>

              <span>
                Self paced
              </span>

              <span>
                Beginner
              </span>

              <h2>
                ₹499
              </h2>

              <button
                onClick={() =>
                  handleCourseSelect({
                    name:
                      "Java Spring Boot",
                    price: 499,
                  })
                }
              >
                Pay now
              </button>

            </div>

            {/* KAFKA */}

            <div className="course-card">

              <div className="course-image">
                Kafka
              </div>

              <h2>
                Kafka Basics
              </h2>

              <p>
                Learn producer, consumer
                and topics
              </p>

              <span>
                4 weeks
              </span>

              <span>
                Beginner
              </span>

              <h2>
                ₹999
              </h2>

              <button
                onClick={() =>
                  handleCourseSelect({
                    name:
                      "Kafka Basics",
                    price: 999,
                  })
                }
              >
                Pay now
              </button>

            </div>

            {/* FULL STACK */}

            <div className="course-card">

              <div className="course-image">
                Full Stack
              </div>

              <h2>
                Full Stack Web
              </h2>

              <p>
                HTML, CSS, JavaScript,
                APIs and deployment
              </p>

              <span>
                8 weeks
              </span>

              <span>
                Beginner
              </span>

              <h2>
                ₹5,999
              </h2>

              <button
                onClick={() =>
                  handleCourseSelect({
                    name:
                      "Full Stack Web",
                    price: 5999,
                  })
                }
              >
                Pay now
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT SUMMARY */}

        <div className="summary">

          <h3>
            SUMMARY
          </h3>

          <h2>
            {selectedCourse.name}
          </h2>

          <p>
            <b>Student:</b>{" "}
            {studentName ||
              "Your Name"}
          </p>

          <p>
            <b>Email:</b>{" "}
            {email ||
              "your@email.com"}
          </p>

          <hr />

          <h3>
            Total
          </h3>

          <h2>
            ₹{selectedCourse.price}
          </h2>

          <button
            className="payment-button"
            onClick={
              proceedToPayment
            }
          >
            Proceed to Payment
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;