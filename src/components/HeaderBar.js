import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid/Grid';

const HeaderBar = ({title}) => (
    <AppBar position="static">
        <Grid container spacing={0} justify="center">
            <Grid item>
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" align="center">
                        {title}
                    </Typography>
                </Toolbar>
            </Grid>
        </Grid>
    </AppBar>
);

HeaderBar.defaultProps = {
    title: ''
};

HeaderBar.propTypes = {
    title: PropTypes.string,
};

export default HeaderBar;
