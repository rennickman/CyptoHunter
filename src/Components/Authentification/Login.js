import React, { useState } from 'react';

import { Box, Button, TextField } from '@material-ui/core';
import { CryptoState } from '../../CryptoContext';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../../firebase';






const Login = ({ handleClose }) => {



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAlert } = CryptoState();




    const handleSubmit = async () => {

        // Create an alert if all fields not completed
        if (!email || !password) {
            setAlert({ open: true, message: "Please fill all the Fields", type: "error" });
            return;
        }

        try {
            // Use firebase to login the user
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Create a success alert
            setAlert({ open: true, message: `Login Successful. Welcome ${result.user.email}`, type: "success" });
            // Close the modal
            handleClose();
            
        } catch (error) {
            // Create an alert if firebase returns an error
            setAlert({ open: true, message: error.message, type: "error" });
            return;
        }
    }


    return (
        <div>
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

                {/* Signup Button */}
                <Button variant="contained" size="large" style={{ backgroundColor: "EEBC1D" }} onClick={handleSubmit}>
                    Sign Up
                </Button>
            </Box>
        </div>
    );
};

export default Login;
