import { makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

import { TrendingCoins } from '../../Config/Api';
import { CryptoState } from '../../CryptoContext';





const useStyles = makeStyles(theme => ({
    carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center"
    },
    carouselItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white"
    }
}));



// Helper function to display currencies with commas
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



const Carousel = () => {

    const classes = useStyles();

    const [trending, setTrending] = useState([]);
    const { currency, symbol } = CryptoState();

    // Use axios to get trending coins - using currency in api call
    const fetchTrendingCoins = async () => {
        const { data } = await axios.get(TrendingCoins(currency));
        // Add data to state
        setTrending(data);
    }


    // Fetch the Trending Coins whenever the currency is changed
    useEffect(() => {
        fetchTrendingCoins();
    }, [currency])

    

    // Map the items out of the trending coins array - Link to each coins homepage
    const items = trending.map(coin => {

        // Check if coin is in profit or not
        let profit = coin.price_change_percentage_24h >= 0;

        return (
            <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
                {/* Logo */}
                <img src={coin?.image} alt={coin.name} height="80" style={{ marginBottom: 10 }} />

                {/* Coin Name and Price Change */}
                <span>{coin?.symbol}
                    &nbsp;
                    <span style={{ color: profit > 0 ? "rgb(14, 203, 129" : "red", fontWeight: 500 }}>
                        {profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                </span>

                {/* Current Price */}
                <span style={{ fontSize: 22, fontWeight:500 }}>
                    {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
                </span>
            </Link>
        )
    })


    // Responsive styling for carousel
    const responsive = {
        0 : {
            items: 2,
        },
        512: {
            items: 4
        }
    };






    return (
        <div className={classes.carousel}>
            <AliceCarousel 
                mouseTracking infinite autoPlayInterval={1000} animationDuration={1500} disableDotsControls 
                responsive={responsive} autoPlay items={items} disableButtonsControls 
            />
        </div>
    );
};



export default Carousel;
