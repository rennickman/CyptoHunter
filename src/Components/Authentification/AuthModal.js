import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

import Login from './Login';
import Signup from './Signup';
import { auth } from '../../firebase';
import { CryptoState } from '../../CryptoContext';






const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        color: "white",
        borderRadius: 10
    },
    google: {
        padding: 24,
        paddingTop: 0,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 20,
        fontSize: 20
    }
}));




// Base code taken from material ui
export default function AuthModal() {


    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const { setAlert } = CryptoState();



    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };



    // Firebase google sign in functionality
    const googleProvider = new GoogleAuthProvider()

    const signInWithGoogle = () => {
        // Use firebase to sign in user using google account
        signInWithPopup(auth, googleProvider).then(res => {
            // Throw a success alert if result is returned
            setAlert({
                open: true,
                message: `Sign Up Successful. Welcome ${res.user.email}`,
                type: "success"
            });
            // Close the modal
            handleClose();

        }).catch(err => {
            // Throw an error alert if error is returned
            setAlert({
                open: true,
                message: err.message,
                type: "error"
            });
            return;
        });
    }



    return (
        <div>
            {/* Log In Button - Opens Modal */}
            <Button variant="contained" style={{ width: 85, height: 40, backgroundColor: "EEBC1D" }} onClick={handleOpen}>
                Login
            </Button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>

                        <AppBar position="static" style={{ backgroundColor: "transparent", color: "white" }}>
                            <Tabs value={value} onChange={handleChange} variant="fullWidth" style={{ borderRadius: 10 }}>
                                {/* Option Tab */}
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>
                        </AppBar>

                        {/* Depending on option selected display the Login or Sign up component */}
                        {value===0 && <Login handleClose={handleClose} />}
                        {value===1 && <Signup handleClose={handleClose} />}

                        {/* Google Sign In */}
                        <Box className={classes.google} >
                            <span>OR</span>
                            <GoogleButton onClick={signInWithGoogle} style={{ width: "100%", outline: "none" }} />
                        </Box>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}