import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Trivia from './containers/Trivia';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
});

const App = () => (
    <div className="root">
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <Trivia />
        </MuiThemeProvider>
    </div>
);
export default App
