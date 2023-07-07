import React from 'react'
import KhaltiCheckout from 'khalti-checkout-web';
import config from './khaltiConfig';

export default function Khalti() {
    let buttonStyles = {
        backgroundcolor: 'purple',
        cursor: 'pointer',
        color: 'blue',
        font: 'bold'
    }

    // Assuming KhaltiCheckout is a class
    const checkout = new KhaltiCheckout(config);

    return (
        <div>
            <button style={buttonStyles} onClick={() => checkout.show({ amount: 1000 })}> Pay via Khalti</button>
        </div>
    )
}
