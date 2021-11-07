import { onAuthStateChanged } from '@firebase/auth';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { CoinList } from './Config/Api';
import { auth } from './firebase';

const Crypto = createContext();



const CryptoContext = ({ children }) => {

    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹");
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", type: "success" });



    // Check for auth state changes and store the user in state
    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        })
    }, []);



    // Method for fetching list of coins using axios
    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        setCoins(data);
        setLoading(false);
    }



    // Change value of symbol whenever currency is changed
    useEffect(() => {
        if (currency === "INR") {
            setSymbol("₹");
        } else if (currency === "USD") {
            setSymbol("$");
        }
    }, [currency]);

    

    return (
        <>
            <Crypto.Provider value={{ currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user }}>
               {children}
            </Crypto.Provider>
            
        </>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
}