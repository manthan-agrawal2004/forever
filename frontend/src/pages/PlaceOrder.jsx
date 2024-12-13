import React, { useContext, useState,useEffect} from 'react'
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Login from './Login';
import { currency } from '../../../admin/src/App';

const PlaceOrder = () => {
  const {navigate,backendURL,token,cartItems,setCartItems,getCartAmount,delivery_fee,products}=useContext(ShopContext);
  const [method,setMethod]=useState('cod');
  const [isRazorpayScriptLoaded, setIsRazorpayScriptLoaded] = useState(false);

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
      } catch (error) {
        console.error("Failed to load Razorpay script");
        toast.error('Failed to load Razorpay script');
      }
    };
    loadScript();
  }, []);
  const [formData,setFormData]=useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  });


  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value

    setFormData(data=>({...data,[name]:value}))
  }

  const initPay=(order)=>{
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount*100,
      currency:order.currency,
      name:'Order Payment',
      description:'Order Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler:async(response)=>{
        console.log(response)
        try{
          const {data}=await axios.post(backendURL+'/api/order/verifyRazorpay',response,{headers:{token}})
          if(data.success){
            navigate('/orders')
            setCartItems({})
          }
        }catch(error){
          console.log(error)
          toast.error(error.message)

        }
      }
    }
    const rzp=new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler=async(event)=>{
    event.preventDefault()
    try {

      let orderItems=[]
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if (cartItems[items][item]>0) {
            const itemInfo=structuredClone(products.find(product=>product._id===items))
            if(itemInfo){
              itemInfo.size=item
              itemInfo.quantity=cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      let orderData={
        address:formData,
        items:orderItems,
        amount:getCartAmount()+delivery_fee
      }
      switch(method){
        //API Calls for COD
        case 'cod':
          const response=await axios.post(backendURL+'/api/order/place',orderData,{headers:{token}})
          if(response.data.success){
            setCartItems({})
            navigate('/orders')
          }
          else{
            toast.error(response.data.message)
          }
        break;
        case 'stripe':
          const responseStripe=await axios.post(backendURL+"/api/order/stripe",orderData,{headers:{token}})
          if(responseStripe.data.success){
            const {session_url}=responseStripe.data;
            window.location.replace(session_url)
          }
          else{
            toast.error(responseStripe.data.message)
          }
          break;
          case 'razorpay':
            const responseRazorPay=await axios.post(backendURL+'/api/order/razorpay',orderData,{headers:{token}})
            if (responseRazorPay.data.success) {
              initPay(responseRazorPay.data.order)
            }
            else{
              console.log("error");
            }
            
          break;
        default:
          break;
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t '>
      {/* ----------Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={"INFORMATION"}/>
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} required  name='firstName' value={formData.firstName} type="text" placeholder='First name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          <input type="text" required onChange={onChangeHandler} name='lastName' value={formData.lastName} placeholder='Last name' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        </div>
        <input type="email" required onChange={onChangeHandler} name='email' value={formData.email} placeholder='Email address' className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        <input type="text" required placeholder='Street' onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        <div className='flex gap-3'>
          <input type="text" required  placeholder='City' onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          <input type="text" required placeholder='State' onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        </div>
        <div className='flex gap-3'>
          <input type="number" required placeholder='Zipcode' onChange={onChangeHandler} name='zipcode' value={formData.zipcode}  className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
          <input type="text" required placeholder='Country' onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
        </div>
        <input type="number" required placeholder='Phone' onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full'/>
      </div>
      {/* ----------------Right Side------------- */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/* ----PAyment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')}  className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${method==='stripe'?'bg-blue-500':''}`}></p>
              <img src={assets.stripe_logo}  className='h-5 mx-4'alt="" />
            </div>
            <div onClick={()=>setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay'?'bg-blue-500':''}`}></p>
              <img src={assets.razorpay_logo}  className='h-5 mx-4'alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?'bg-blue-500':''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>Place Order</button>
          </div>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
