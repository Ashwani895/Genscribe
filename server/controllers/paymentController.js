import { razorpay } from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { amount = 100 } = req.body; // default ₹100 pack

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};