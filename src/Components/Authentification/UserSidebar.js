import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import { Avatar } from '@material-ui/core';
import { signOut } from '@firebase/auth';

import { auth } from '../../firebase';
import { CryptoState } from '../../CryptoContext';



const useStyles = makeStyles({
    container: {
        width: 350,
        padding: 25,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace"
    },
    profile: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        height: "92%"
    },
    picture: {
        width: 200,
        height: 200,
        cursor: "pointer",
        backgroundColor: "#EEBC1D",
        objectFit: "contain"
    },
    logout: {
        height: "8%",
        width: "100%",
        backgroundColor:"#EEBC1D",
        marginTop: 20
    },
    watchlist: {
        flex: 1,
        width: "100%",
        backgroundColor: "grey",
        borderRadius: 10,
        padding: 15,
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        overflowY: "scroll"
    }
});





// Base code taken from material ui
export default function UserSidebar() {


    const classes = useStyles();
    const [state, setState] = React.useState({
        right: false,
    });


    const { user, setAlert } = CryptoState();


    // Method for opening Sidebar
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };


    const logOut = () => {
        // Use firebase functionality to log user out
        signOut(auth);
        // Throw a success alert
        setAlert({ open: true, type: "success", message: "Logout Successful!"});
        // close the Sidebar
        toggleDrawer();
    }
    



    return (
        <div>
            
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>

                    {/* Avatar */}
                    <Avatar 
                        onClick={toggleDrawer(anchor, true)} src={user.photoURL} alt={user.displayName || user.email}
                        style={{ height: 38, width: 38, cursor: "pointer", backgroundColor: "#EEBC1D" }}
                    />

                    {/* Sidebar */}
                    <SwipeableDrawer 
                        anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} onOpen={toggleDrawer(anchor, true)}
                    >
                        <div className={classes.container}>

                            <div className={classes.profile}>
                                {/* Sidebar Avatar */}
                                <Avatar classname={classes.picture} src={user.photoURL} alt={user.displayName || user.email} />

                                {/* Username - Display email if name not set */}
                                <span 
                                    style={{ width:"100%", fontSize: 25, textAlign: "center", fontWeight: "bolder", wordWrap: "break-word" }}
                                >
                                    {user.displayName || user.email}
                                </span>

                                {/* Watch List */}
                                <div className={classes.watchlist}>
                                    <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>

                                    </span>
                                </div>
                            </div>

                            {/* Log Out Button */}
                            <Button variant="contained" className={classes.logout} onClick={logOut}>
                                Log Out
                            </Button>
                        </div>
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}