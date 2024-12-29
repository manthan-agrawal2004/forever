import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const LOGIN = 'Login';
  const SIGNUP = 'Sign Up';

  const [currentState, setCurrentState] = useState(LOGIN);
  const { token, setToken, navigate, backendURL } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Define the endpoint based on current state
      const endpoint =
        currentState === SIGNUP ? '/api/user/register' : '/api/user/login';

      // Prepare the request payload
      const payload =
        currentState === SIGNUP
          ? { name, email, password }
          : { email, password };

      // Make the API request
      const response = await axios.post(`${backendURL}${endpoint}`, payload);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        toast.success(`Successfully ${currentState === LOGIN ? 'logged in' : 'registered'}`);
      } else {
        toast.error(response.data.message || 'Failed to process the request');
      }
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.message || 'Something went wrong. Please try again.';
      console.error('Error:', error);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === SIGNUP && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-not-allowed text-gray-500">Forgot your password?</p>
        {currentState === LOGIN ? (
          <p onClick={() => setCurrentState(SIGNUP)} className="cursor-pointer">
            Create account
          </p>
        ) : (
          <p onClick={() => setCurrentState(LOGIN)} className="cursor-pointer">
            Login here
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState}
      </button>
    </form>
  );
};

export default Login;