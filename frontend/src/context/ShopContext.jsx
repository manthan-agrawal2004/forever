import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the ShopContext
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const delivery_fee = 10;

    // Add item to cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }
        setCartItems(cartData);
        toast.success("Added to Cart");

        if (token) {
            try {
                await axios.post(
                    `${backendURL}/api/cart/add`,
                    { itemId, size },
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    // Fetch products data
    const getProductsData = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message || "Failed to fetch products.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to fetch products.");
        }
    }, [backendURL]);

    // Fetch user cart data
    const getUserCart = useCallback(
        async (userToken) => {
            try {
                const response = await axios.post(
                    `${backendURL}/api/cart/get`,
                    {},
                    { headers: { token: userToken } }
                );
                if (response.data.success) {
                    setCartItems(response.data.cartData);
                } else {
                    toast.error(response.data.message || "Failed to fetch cart data.");
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message || "Failed to fetch cart data.");
            }
        },
        [backendURL]
    );

    // Update item quantity in cart
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        if (!cartData[itemId]) {
            toast.error("Item not found in the cart.");
            return;
        }

        if (quantity <= 0) {
            delete cartData[itemId][size]; // Remove the size if quantity is zero
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]; // Remove the item if no sizes are left
            }
        } else {
            cartData[itemId][size] = quantity; // Update the quantity for the given size
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(
                    `${backendURL}/api/cart/update`,
                    { itemId, size, quantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }
    };

    // Calculate cart item count
    const getCartCount = () =>
        Object.values(cartItems).reduce(
            (total, sizes) => total + Object.values(sizes).reduce((subtotal, qty) => subtotal + qty, 0),
            0
        );

    // Calculate cart total amount
    const getCartAmount = () =>
        Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const item = products.find((product) => product._id === itemId);
            if (!item) {
                console.warn(`Item with ID ${itemId} not found.`);
                return total;
            }

            const itemSubtotal = Object.entries(sizes).reduce((subtotal, [size, qty]) => {
                if (typeof qty !== "number" || isNaN(qty)) {
                    console.warn(`Invalid quantity for ${itemId}, size ${size}:`, qty);
                    return subtotal;
                }
                return subtotal + item.price * qty;
            }, 0);

            return total + itemSubtotal;
        }, 0);

    // Fetch products and user cart on load
    useEffect(() => {
        getProductsData();
    }, [getProductsData]);

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            const userToken = localStorage.getItem("token");
            setToken(userToken);
            getUserCart(userToken);
        }
    }, [token, getUserCart]);

    // Context value
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        updateQuantity,
        getCartAmount,
        navigate,
        backendURL,
        setToken,
        token,
        setCartItems,
        getCartCount,
    };

    return (
        <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
    );
};

ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ShopContextProvider;