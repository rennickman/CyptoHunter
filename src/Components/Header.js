import React from 'react';
import { AppBar, Container, createTheme, makeStyles, MenuItem, Select, Toolbar, Typography, ThemeProvider } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentification/AuthModal';
import UserSidebar from './Authentification/UserSidebar';


const useStyles = makeStyles(() => ({
        title: {
            flex: 1,
            color: "gold",
            fontFamily: "Montserrat",
            fontWeight: "bold",
            cursor: "pointer"
        }
    }))




const Header = () => {


    const classes = useStyles();
    const history = useHistory();
    const { currency, setCurrency, user } = CryptoState();

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: "dark"
        }
    });



    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <AppBar color="transparent" position="static">
                    <Container>
                        <Toolbar>
                            {/* Logo - Links to Homepage */}
                            <Typography onClick={() => history.push("/")} className={classes.title} variant="h6">Crypto Hunter</Typography>

                            {/* Currency Selector */}
                            <Select variant="outlined" style={{ width: 100, height: 40, marginRight: 15 }}
                                value={currency} onChange={e => setCurrency(e.target.value)}
                            >
                                <MenuItem value={"USD"}>USD</MenuItem>
                                <MenuItem value={"INR"}>INR</MenuItem>
                            </Select>

                            {/* Sidebar Link or Login */}
                            {user ? <UserSidebar /> : <AuthModal />}
                        </Toolbar>
                    </Container>
                </AppBar>
            </ThemeProvider>
        </>
    );
};

export default Header;
