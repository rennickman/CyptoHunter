import { onAuthStateChanged } from '@firebase/auth';
import { doc, onSnapshot } from '@firebase/firestore';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { CoinList } from './Config/Api';
import { auth, db } from './firebase';

const Crypto = createContext();



const CryptoContext = ({ children }) => {

    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹");
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({ open: false, message: "", type: "success" });
    const [watchlist, setWatchlist] = useState([]);


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



    // Grab snapshot of watchlist from database whenever user is changed in state
    useEffect(() => {
        if (user) {

            // The reference to the watchlist document
            const coinRef = doc(db, "watchlist", user.uid); 


            // Add the watchlist if it exists - unsubscribe when component is unmounted
            const unsubscribe = onSnapshot(coinRef, coin => {
                if (coin.exists()) {
                    setWatchlist(coin.data().coins);
                } else {
                    console.log("No items in Watchlist")
                }
            })

            return () => {
                unsubscribe();
            }
        }
    }, [user]);

    

    return (
        <>
            <Crypto.Provider value={{ currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist }}>
               {children}
            </Crypto.Provider>
            
        </>
    );
};

export default CryptoContext;

export const CryptoState = () => {
    return useContext(Crypto);
}