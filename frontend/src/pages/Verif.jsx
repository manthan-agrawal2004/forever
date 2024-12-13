import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verif = () => {
    const { navigate, token, setCartItems, backendURL } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        try {
            const response = await axios.post(`${backendURL}/api/order/verifyStripe`,{ success, orderId },{ headers: { token } });
            if (response.data.success) {
                setCartItems({});
                navigate('/orders');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred while verifying the payment");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);   

    return (
        <div>
            <h2>Verifying Payment...</h2>
        </div>
    );
};

export default Verif;