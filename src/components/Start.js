import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import Screen from './Screen'

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        textAlign: 'center'
    },
    button: {
        [theme.breakpoints.down('sm')]: {
            position: 'fixed',
            bottom: theme.spacing.unit * 2,
            right: theme.spacing.unit * 3
        },
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

const Start = ({classes, onStart}) => {

    const handleStart = (ev) =>{
        ev.preventDefault();
        onStart();
    };

    return(
        <Screen title={'Welcome to the Employee Namegame Quiz!'} className={classes.root}>
            <Typography variant="h6" color="textSecondary" paragraph>
                In an effort to help learn the names of our current employees, we have crafted this handy tool to help remember people you may encounter at WillowTree.
            </Typography>
            <Button variant={'extendedFab'} color="primary" aria-label="Play" className={classes.button} onClick={handleStart}>
                <PlayArrowIcon className={classes.extendedIcon} />
                Begin
            </Button>
        </Screen>
    );
};
Start.defaultProps = {
    classes: {},
    onStart: () => {}
};

Start.propTypes = {
  classes: PropTypes.object,
  onStart: PropTypes.func.isRequired
};

export default withStyles(styles)(Start);
