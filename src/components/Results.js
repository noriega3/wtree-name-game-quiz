import React from 'react';
import PropTypes from 'prop-types';

//TODO: calculate sum
const Results = props => (
    <div>
        Total Score:
        <div>todo: remove skips, add 1s together {props.userScores}</div>
    </div>

);

Results.defaultProps = {
    classes: {},
};

Results.propTypes = {
    classes: PropTypes.object,
    usersScores: PropTypes.object
};

export default Results;
