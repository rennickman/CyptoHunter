import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles, Typography, LinearProgress, Button } from '@material-ui/core';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { doc, setDoc } from '@firebase/firestore';


import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../Config/Api';
import CoinInfo from '../Components/CoinInfo';
import { numberWithCommas } from '../Components/Banner/Carousel';
import { db } from '../firebase';



const CoinPage = () => {


    const { id } = useParams();
    const [coin, setCoin] = useState();
    const { currency, symbol, user, watchlist, setAlert } = CryptoState();


    // Use axios to fetch a single coin and add it to state
    const fetchCoin = async () => {
        const { data } = await axios.get(SingleCoin(id));
        setCoin(data);
    }


    // Fetch a coin when component is loaded
    useEffect(() => {
        fetchCoin();
    }, []);


    const useStyles = makeStyles((theme) => ({
        container: {
            display: "flex",
            [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                alignItems: "center"
            }
        },
        sidebar: {
            width: "30%",
            [theme.breakpoints.down("md")]: {
                width: "100%"
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 25,
            borderRight: "2px solid grey"
        },
        description: {
            width: "100%",
            fontFamily: "Montserrat",
            padding: 25,
            paddingBottom: 15,
            paddingTop: 0,
            textAlign: "justify"
        },
        marketData: {
            alignSelf: "start",
            padding: 25,
            paddingTop: 10,
            width: "100%",
            [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
                alignItems: "center"
            },
            [theme.breakpoints.down("md")]: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            },
            [theme.breakpoints.down("xs")]: {
                alignItems: "start"
            }
        }
    }));

    const classes = useStyles();


    // Variable to check if a coin is already in the watchlist - changes add into remove on button
    const inWatchlist = watchlist.includes(coin?.id);


    // Method for adding a Coin to the database
    const addToWatchList = async () => {
        // The reference to the watchlist document
        const coinRef = doc(db, "watchlist", user.uid);

        try {
            // If watchlist exists add coin - if not set watchlist as coin
            await setDoc(coinRef, {
                coins: watchlist ? [...watchlist, coin?.id] : [coin?.id]
            });

            // Throw success alert
            setAlert({
                open: true,
                message: `${coin.name} Added to the Watchlist!`,
                type: "success"
            })

        } catch (error) {
            // Throw failure alert
            setAlert({
                open: true,
                message: error.message,
                type: "error"
            })
        }
    }


    // Method for removing a coin from the watchlist
    const removeFromWatchlist = async () => {
        // The reference to the watchlist document
        const coinRef = doc(db, "watchlist", user.uid);

        try {
            // Filter out the item from the watchlist
            await setDoc(coinRef, {
                coins: watchlist.filter(item => item !== coin?.id)
            }, { merge: true });

            // Throw success alert
            setAlert({
                open: true,
                message: `${coin.name} Removed from the Watchlist!`,
                type: "success"
            })

        } catch (error) {
            // Throw failure alert
            setAlert({
                open: true,
                message: error.message,
                type: "error"
            })
        }
    }



    // Add Loading bar when waiting for coin data
    if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />





    return (
        <div className={classes.container}>
            <div className={classes.sidebar}>
                {/* Logo */}
                <img src={coin?.image.large} alt={coin?.name} height="200" style={{ marginBottom: 20 }} />

                {/* Name */}
                <Typography variant="h3" className={classes.heading} >
                    {coin?.name}
                </Typography>

                {/* Description */}
                <Typography variant="subtitle1" className={classes.description} >
                    {ReactHtmlParser(coin?.description.en.split(". ")[0])}
                </Typography>

                <div className={classes.marketData}>
                    {/* Rank */}
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Rank:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                            {coin?.market_cap_rank}
                        </Typography>
                    </span>

                    {/* Current Price */}
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Current Price:
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                            {symbol}{" "}{numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
                        </Typography>
                    </span>

                    {/* Market Cap */}
                    <span style={{ display: "flex" }}>
                        <Typography variant="h5" className={classes.heading}>
                            Market Cap: {" "}
                        </Typography>
                        &nbsp; &nbsp;
                        <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
                            {symbol}{" "}{numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))}
                        </Typography>
                    </span>

                    {/* Add to WatchList (Green) / Remove from Watchlist (Red) Button - Only Visible when logged in */}
                    {user && (
                        <Button 
                            variant="outlined" style={{ width: "100%", height: 40, backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D" }} 
                            onClick={inWatchlist ? removeFromWatchlist : addToWatchList}
                        >
                            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                        </Button>
                    )}
                </div>
            </div>



            {/* Chart */}
            <CoinInfo coin={coin} />
        </div>
    );
};


export default CoinPage;
