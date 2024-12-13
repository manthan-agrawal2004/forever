import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
    const {search,setSearch,showSearch,setShowSearch}=useContext(ShopContext);
    const [visible,setVisible]=useState(false);
    const location=useLocation();
    useEffect(()=>{
        if(location.pathname.includes('collection')){
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    },[location])

    
  return showSearch && visible?(
    <div className="border-t border-b bg-gray-50 text-center py-5">
      <div className="relative inline-flex items-center justify-between border border-gray-300 px-4 py-2 mx-3 rounded-full w-3/4 sm:w-1/2 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
        {/* Input Field */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="flex-1 outline-none bg-inherit text-sm text-gray-700 placeholder-gray-400"
          placeholder="Search"
        />
        {/* Search Icon */}
        <img
          src={assets.search_icon}
          className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          alt="Search icon"
        />
      </div>
      {/* Close Icon */}
      <img
        onClick={() => setShowSearch(false)}
        className="inline w-4 h-4 mt-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200"
        src={assets.cross_icon}
        alt="Close search"
      />
    </div>
  ):null
}

export default SearchBar
 