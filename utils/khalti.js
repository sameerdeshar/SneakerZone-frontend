import axios from "axios";

// Replace the placeholders with your actual Khalti API keys
const KHALTI_PUBLIC_KEY = process.env.KHALTI_PUBLIC_KEY;
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

export const initiatePayment = async (amount, productId) => {
    try {
        // Step 1: Generate a unique transaction ID
        const transactionId = Math.random().toString(36).substring(7);

        // Step 2: Prepare the payload
        const payload = {
            public_key: process.env.KHALTI_PUBLIC_KEY,
            amount,
            token: transactionId,
            product_id: productId,
        };

        // Step 3: Send the payment initiation request to Khalti API
        const response = await axios.post(
            "https://khalti.com/api/v2/payment/initiate/",
            payload,
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        // Step 4: Process the response from Khalti API
        const { token } = response.data;

        // Return the payment token
        return token;
    } catch (error) {
        // Handle any errors that occur during the payment initiation
        throw new Error("Payment initiation failed");
    }
};

export const verifyPayment = async (token) => {
    try {
        // Step 5: Verify the payment using the payment token
        const response = await axios.post(
            "https://khalti.com/api/v2/payment/verify/",
            { token },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        // Step 6: Process the response from Khalti API
        const { idx } = response.data;

        // Return the transaction ID
        return idx;
    } catch (error) {
        // Handle any errors that occur during the payment verification
        throw new Error("Payment verification failed");
    }
};
