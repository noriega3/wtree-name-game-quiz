import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress'
import PropTypes from 'prop-types';

const Progress = ({classes,percent}) => (<LinearProgress classes={classes} color="secondary" variant="determinate" value={percent*100} />);

Progress.defaultProps = {
    classes: {},
    percent: 0
};

Progress.propTypes = {
    classes: PropTypes.object,
    percent: PropTypes.number
};

export default Progress;
