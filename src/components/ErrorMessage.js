import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Screen from './Screen';

const ErrorMessage = ({message, onDismiss, loading}) => {
    return(
        <Screen title={'Error'}>
            <Typography variant="h5" gutterBottom>
                {message}
            </Typography>
            <Button variant={'raised'} color="primary" aria-label="New Game" onClick={onDismiss} disabled={loading}>
                New Game
            </Button>
        </Screen>
    )
};

ErrorMessage.defaultProps = {
    onDismiss: () => {},
    message: 'Unknown Error',
    loading: false,
};

ErrorMessage.propTypes = {
    classes: PropTypes.object,
    message: PropTypes.string,
    onDismiss: PropTypes.func,
    loading: PropTypes.bool
};

export default ErrorMessage;
