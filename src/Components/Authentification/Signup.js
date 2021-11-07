import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import { CryptoState } from '../../CryptoContext';
import { auth } from '../../firebase';




const Signup = ({ handleClose }) => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setAlert } = CryptoState();



    const handleSubmit = async () => {

        // Create an alert if passwords dont match
        if (password !== confirmPassword) {
            setAlert({ open: true, message: "Passwords do not match", type: "error" });
            return;
        }

        try {
            // Use firebase to create a new user
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Create a success alert
            setAlert({ open: true, message: `Sign Up Successful. Welcome ${result.user.email}`, type: "success" });
            // Close the modal
            handleClose();
            
        } catch (error) {
            // Create an alert if firebase returns an error
            setAlert({ open: true, message: error.message, type: "error" });
            return;
        }
        
    }



    return (
        <>
            <Box p={3} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Email Input */}
                <TextField 
                    variant="outlined" type="email" label="Enter Email" value={email} fullWidth
                    onChange={e => setEmail(e.target.value)}
                />

                {/* Password Input */}
                <TextField 
                    variant="outlined" type="password" label="Enter Password" value={password} fullWidth
                    onChange={e => setPassword(e.target.value)}
                />

                {/* Confirm Password Input */}
                <TextField 
                    variant="outlined" type="password" label="Confirm Password" value={confirmPassword} fullWidth
                    onChange={e => setConfirmPassword(e.target.value)}
                />

                {/* Signup Button */}
                <Button variant="contained" size="large" style={{ backgroundColor: "EEBC1D" }} onClick={handleSubmit}>
                    Sign Up
                </Button>
            </Box>
        </>
    );
};

export default Signup;
