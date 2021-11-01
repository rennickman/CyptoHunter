import { Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';

import { CoinList } from '../Config/Api';
import { CryptoState } from '../CryptoContext';
import { numberWithCommas } from './Banner/Carousel';



const CoinsTable = () => {

    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const { currency, symbol } = CryptoState();
    const history = useHistory();


    // Method for fetching list of coins using axios
    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        setCoins(data);
        setLoading(false);
    }


    // Fetch the list of coins evertime the currency changes
    useEffect(() => {
        fetchCoins();
    }, [currency]);


    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: "dark"
        }
    });


    // Method for handling coin searches - search for a match in name and symbol
    const handleSearch = () => {
        return coins.filter(coin => (
            coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
        ))
    }


    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: "#16171a",
            cursor: "pointer", 
            "&:hover": {
                backgroundColor: "#131111"
            },
            fontFamily: "Montserrat"
        },
        pagination: {
            "& .MuiPaginationItem-root": {
                color: "gold"
            }
        }
    }));

    const classes = useStyles();


    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Container style={{ textAlign: "center" }} >
                    {/* Header */}
                    <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }} >
                        Cryptocurrency Prices by Markey Cap
                    </Typography>

                    {/* Search Input */}
                    <TextField 
                        label="Search For a Crypto Currency.." variant="outlined" style={{ marginBottom: 20, width: "100%"}}
                        onChange={e => setSearch(e.target.value)}
                    />

                    {/* Table Section - show progress bar if loading */}
                    <TableContainer>
                        {loading ? (
                            <LinearProgress style={{ backgroundColor: "gold"} } />
                        ) : (
                            <Table>
                                {/* Header Section */}
                                <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                    <TableRow>
                                        {["Coin", "Price", "24h Change", "Market Cap"].map(head => (
                                            <TableCell 
                                                style={{ color: "black", fontWeight: "700", fontFamily: "Montserrat" }} key={head}
                                                align={head === "Coin" ? "" : "right"}
                                            >
                                                {head}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                {/* Body Section - slice the results from handlesearch to only display 10 per page */}
                                <TableBody>
                                       {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map(row => {
                                           // Check if the coin has a profit
                                           const profit = row.price_change_percentage_24h > 0;

                                           return (
                                               <TableRow
                                                   onClick={() => history.push(`/coins/${row.id}`)}
                                                   className={classes.row}
                                                   key={row.name}
                                                >
                                                    <TableCell component="th" scope="row" style={{ display: "flex", gap: 15 }}>
                                                        {/* Logo */}
                                                        <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />

                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            {/* Symbol */}
                                                            <span style={{ textTransform: "uppercase", fontSize: 22 }}>
                                                                {row.symbol}
                                                            </span>
                                                            {/* Name */}
                                                            <span style={{ color: "darkgrey"}}>{row.name}</span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {/* Price */}
                                                        {symbol}{" "}{numberWithCommas(row.current_price.toFixed(2))}
                                                    </TableCell>

                                                    <TableCell 
                                                        style={{ color: profit > 0 ? "rgb(14, 203, 129" : "red", fontWeight: 500 }}
                                                        align="right"
                                                    >
                                                        {/* Profit */}
                                                        {profit && "+"}{row.price_change_percentage_24h.toFixed(2)}%
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        {/* Market Value */}
                                                        {symbol}{" "}{numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                                                    </TableCell>
                                               </TableRow>
                                           )
                                       })}     
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>

                    {/* Change the Page - Scroll window up whenever page is changed */}
                    <Pagination 
                        count={(handleSearch()?.length / 10).toFixed(0)} classes={{ ul: classes.pagination }}
                        style={{ padding: 20, width: "100%", display: "flex", justifyContent: "center" }}
                        onChange={(_, value) => {
                            setPage(value);
                            window.scroll(0, 450);
                        }}
                    />
                </Container>
            </ThemeProvider>
        </>
    );
};

export default CoinsTable;
