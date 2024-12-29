import { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { navigate, backendURL, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [isRazorpayScriptLoaded, setIsRazorpayScriptLoaded] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const loadRazorpayScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadScript = async () => {
      try {
        const isLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
        setIsRazorpayScriptLoaded(isLoaded);
        console.log("Razorpay script loaded successfully.");
      } catch {
        console.error("Failed to load Razorpay script");
        toast.error('Failed to load Razorpay script');
      }
    };
    loadScript();
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount * 100,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendURL + '/api/order/verifyRazorpay', response, { headers: { token } });
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          }
        } catch (err) {
          console.error(err);
          toast.error(err.message);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    if (!token) {
      toast.error("You are not logged in. Please log in to place an order.");
      navigate("/login");
      return;
    }
  
    if (!Object.keys(cartItems).length) {
      toast.error("Your cart is empty. Please add items before placing an order.");
      return;
    }
  
    try {
      const orderItems = Object.entries(cartItems).flatMap(([productId, sizes]) =>
        Object.entries(sizes)
          .filter(([, quantity]) => quantity > 0)
          .map(([size, quantity]) => {
            const product = products.find((prod) => prod._id === productId);
            return product ? { ...product, size, quantity } : null;
          })
          .filter(Boolean)
      );
  
      const amount = (getCartAmount() || 0) + (delivery_fee || 0);
      const orderData = {
        address: formData,
        items: orderItems,
        amount, // Ensure amount is included
      };
  
      console.log("Order Data:", orderData);
  
      if (method === 'cod') {
        const { data } = await axios.post(backendURL + '/api/order/place', orderData, { headers: { token } });
        if (data.success) {
          setCartItems({});
          navigate('/orders');
        } else {
          toast.error(data.message);
        }
      } else if (method === 'stripe') {
        const { data } = await axios.post(backendURL + "/api/order/stripe", orderData, { headers: { token } });
        if (data.success) {
          window.location.replace(data.session_url);
        } else {
          toast.error(data.message);
        }
      } else if (method === 'razorpay') {
        if (!isRazorpayScriptLoaded) {
          toast.error("Razorpay script not loaded.");
          return;
        }
        const { data } = await axios.post(backendURL + '/api/order/razorpay', orderData, { headers: { token } });
        if (data.success) {
          initPay(data.order);
        } else {
          toast.error("Failed to initialize Razorpay.");
        }
      } else {
        toast.error("Invalid payment method.");
      }
    } catch (err) {
      console.error("Order placement failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={"INFORMATION"} />
        </div>
        <div className='flex gap-3'>
          <input name='firstName' value={formData.firstName} onChange={onChangeHandler} type="text" required placeholder='First name' className='border rounded py-1.5 px-3.5 w-full' />
          <input name='lastName' value={formData.lastName} onChange={onChangeHandler} type="text" required placeholder='Last name' className='border rounded py-1.5 px-3.5 w-full' />
        </div>
        <input name='email' value={formData.email} onChange={onChangeHandler} type="email" required placeholder='Email address' className='border rounded py-1.5 px-3.5 w-full' />
        <input name='street' value={formData.street} onChange={onChangeHandler} type="text" required placeholder='Street' className='border rounded py-1.5 px-3.5 w-full' />
        <div className='flex gap-3'>
          <input name='city' value={formData.city} onChange={onChangeHandler} type="text" required placeholder='City' className='border rounded py-1.5 px-3.5 w-full' />
          <input name='state' value={formData.state} onChange={onChangeHandler} type="text" required placeholder='State' className='border rounded py-1.5 px-3.5 w-full' />
        </div>
        <div className='flex gap-3'>
          <input name='zipcode' value={formData.zipcode} onChange={onChangeHandler} type="number" required placeholder='Zipcode' className='border rounded py-1.5 px-3.5 w-full' />
          <input name='country' value={formData.country} onChange={onChangeHandler} type="text" required placeholder='Country' className='border rounded py-1.5 px-3.5 w-full' />
        </div>
        <input name='phone' value={formData.phone} onChange={onChangeHandler} type="number" required placeholder='Phone' className='border rounded py-1.5 px-3.5 w-full' />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <CartTotal />
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-blue-500' : ''}`}></p>
              <img src={assets.stripe_logo} className='h-5 mx-4' alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-blue-500' : ''}`}></p>
              <img src={assets.razorpay_logo} className='h-5 mx-4' alt="Razorpay" />
            </div>
            <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-blue-500' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>Place Order</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;