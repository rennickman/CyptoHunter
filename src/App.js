import { BrowserRouter, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import './App.css';
import Header from './Components/Header';
import CoinPage from './Pages/CoinPage';
import Homepage from './Pages/Homepage';
import Alert from './Components/Alert';


function App() {

    // Global styles for app
    const useStyles = makeStyles(() => ({
        App: {
            backgroundColor: "#14161a",
            color: "white",
            minHeight: "100vh"
        }
    }))

    const classes = useStyles();


    return (
        <BrowserRouter>
            <div className={classes.App}>
                <Header />
                <Route path="/" component={Homepage} exact/>
                <Route path="/coins/:id" component={CoinPage} />
            </div>
            <Alert />
        </BrowserRouter>
    );
}

export default App;
