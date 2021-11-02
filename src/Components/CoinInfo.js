import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CircularProgress, createTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

import { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../Config/Api';
import { chartDays } from '../Config/data';
import SelectButton from './SelectButton';


const CoinInfo = ({ coin}) => {


    const [historicalData, setHistoricalData] = useState();
    const [days, setDays] = useState(1);
    const { currency } = CryptoState();


    // Use axios to fetch historical data for a coin - default 12 a year
    const fetchHistoricalDate = async () => {
        const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
        setHistoricalData(data.prices);
    }

    // Fetch the data everytime currency or days are changed
    useEffect(() => {
        fetchHistoricalDate();
    }, [currency, days]);


    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: "dark"
        }
    });

    const useStyles = makeStyles((theme) => ({
        container: {
            width: "75%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 25,
            padding: 40,
            [theme.breakpoints.down("md")]: {
                width: "100%",
                marginTop: 0,
                padding: 20,
                paddingTop: 0
            }
        }
    }));

    const classes = useStyles({});





    return (
        <ThemeProvider theme={darkTheme}>
            <div className={classes.container}>
                {!historicalData ? (
                    <CircularProgress style={{ color: "gold" }} size={250} thickness={1} />
                ) : (
                    <>
                        {/* Historical Price Chart */}
                        <Line
                            data={{ 
                                labels: historicalData.map(coin => {
                                    // Take the date from the coin object and create a date object
                                    let date = new Date(coin[0]);

                                    let time = date.getHours() > 12 ? 
                                        `${date.getHours() - 12}:${date.getMinutes()} PM` : 
                                        `${date.getHours() - 12}:${date.getMinutes()} AM`;

                                    // Return Hours for 24 hr and dates for longer time periods
                                    return days === 1 ? time : date.toLocaleDateString();
                                }),
                                datasets: [{ 
                                    data: historicalData.map(coin => coin[1]),
                                    label: `Price ( Past ${days} Days ) in ${currency}`,
                                    borderColor: "#EEBC1D"
                                }]
                            }}
                            options={{
                                elements: {
                                    point: {
                                        // Get rid of circles on chart
                                        radius: 1
                                    }
                                }
                            }}
                        />

                        {/* Buttons for changing time period */}
                        <div style={{ display: "flex", marginTop: 20, justifyContent: "space-around", width: "100%" }}>
                            {chartDays.map(day => (
                                <SelectButton
                                    key={day.value} onClick={() => setDays(day.value)} selected={day.value === days}
                                >
                                    {day.label}
                                </SelectButton>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </ThemeProvider>
    );
};

export default CoinInfo;
