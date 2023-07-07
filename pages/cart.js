import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import CartItem from "@/components/CartItem";
import { useSelector } from "react-redux";
import KhaltiCheckout from "khalti-checkout-web";
import axios from "axios";

import { makePaymentRequest } from "@/utils/api";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const Cart = () => {
    const [loading, setLoading] = useState(false);
    const { cartItems } = useSelector((state) => state.cart);

    const subTotal = useMemo(() => {
        return cartItems.reduce((total, val) => total + val.attributes.price, 0);
    }, [cartItems]);

    const handlePayment = async () => {

        try {
            setLoading(true);
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Failed to load Stripe");
            }

            const res = await makePaymentRequest("/api/orders", {
                products: cartItems,
            });

            if (res.error) {
                throw new Error(res.error);
            }

            if (!res.stripeSession || !res.stripeSession.id) {
                throw new Error("Invalid stripeSession data");
            }

            await stripe.redirectToCheckout({
                sessionId: res.stripeSession.id,
            });
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };



    {/* Khalti payment */ }
    // const handlePayment1 = async () => {
    //     try {
    //         setLoading(true);

    //         const res = await makePaymentRequest("/api/orders", {
    //             products: cartItems,
    //         });

    //         if (res.error) {
    //             throw new Error(res.error);
    //         }

    //         if (!res.khaltiConfig) {
    //             throw new Error("Invalid Khalti configuration");
    //         }

    //         const khaltiConfig = res.khaltiConfig;

    //         const handler = new KhaltiCheckout({
    //             ...khaltiConfig,
    //             onSuccess: (payload) => {
    //                 // Handle successful payment
    //                 console.log("Payment successful", payload);
    //                 setLoading(false);
    //             },
    //             onError: (error) => {
    //                 // Handle payment error
    //                 console.error("Payment error", error);
    //                 setLoading(false);
    //             },
    //             onClose: () => {
    //                 // Handle checkout close
    //                 console.log("Checkout closed");
    //                 setLoading(false);
    //             },
    //         });

    //         handler.show({ amount: 1000 }); // Replace 1000 with the actual payment amount

    //     } catch (error) {
    //         setLoading(false);
    //         console.error(error);
    //     }
    // };




    return (
        <div className="w-full md:py-20">
            <Wrapper>
                {cartItems.length > 0 && (
                    <>
                        {/* HEADING AND PARAGRAPH START */}
                        <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
                            <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
                                Shopping Cart
                            </div>
                        </div>
                        {/* HEADING AND PARAGRAPH END */}

                        {/* CART CONTENT START */}
                        <div className="flex flex-col lg:flex-row gap-12 py-10">
                            {/* CART ITEMS START */}
                            <div className="flex-[2]">
                                <div className="text-lg font-bold">
                                    Cart Items
                                </div>
                                {cartItems.map((item) => (
                                    <CartItem key={item.id} data={item} />
                                ))}
                            </div>
                            {/* CART ITEMS END */}

                            {/* SUMMARY START */}
                            <div className="flex-[1]">
                                <div className="text-lg font-bold">Summary</div>

                                <div className="p-5 my-5 bg-black/[0.05] rounded-xl">
                                    <div className="flex justify-between">
                                        <div className="uppercase text-md md:text-lg font-medium text-black">
                                            Subtotal
                                        </div>
                                        <div className="text-md md:text-lg font-medium text-black">
                                            RS {subTotal}
                                        </div>
                                    </div>
                                    <div className="text-sm md:text-md py-5 border-t mt-5">
                                        The subtotal reflects the total price of
                                        your order, including duties and taxes.
                                    </div>
                                </div>

                                {/* BUTTON START */}
                                <div>
                                    <button
                                        className="w-full py-4 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"
                                        onClick={handlePayment}
                                    >
                                        Checkout
                                        {loading && <img src="/spinner.svg" />}
                                    </button>
                                </div>
                                <div>
                                    <button
                                        className="w-full py-4 rounded-full bg-purple-900 text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 flex items-center gap-2 justify-center"

                                        onClick={() =>
                                            window.open("http://khalti.com/login", "_blank")
                                        }
                                    >
                                        Pay via Khalti
                                        {loading}
                                    </button>
                                </div>
                                {/* BUTTON END */}
                            </div>
                            {/* SUMMARY END */}
                        </div>
                        {/* CART CONTENT END */}
                    </>
                )}

                {/* This is empty screen */}
                {cartItems.length < 1 && (
                    <div className="flex-[2] flex flex-col items-center pb-[50px] md:-mt-14">
                        <Image
                            src="/empty-cart.jpg"
                            width={300}
                            height={300}
                            className="w-[300px] md:w-[400px]"
                        />
                        <span className="text-xl font-bold">
                            Your cart is empty
                        </span>
                        <span className="text-center mt-4">
                            Looks like you have not added anything in your cart.
                            <br />
                            Go ahead and explore top categories.
                        </span>
                        <Link
                            href="/"
                            className="py-4 px-8 rounded-full bg-black text-white text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75 mt-8"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </Wrapper>
        </div>
    );
};

export default Cart;