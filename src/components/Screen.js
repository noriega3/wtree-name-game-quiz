import React from 'react'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid'
import HeaderBar from './HeaderBar';
import Progress from './Progress'

const Screen = ({className, title, barTitle, children, progress}) => {
    //change title of page
    document.title = title;

    //render the children wrapped into a new grid row
    const renderRows = React.Children.map(children, child => (<Grid item xs={12}>{child}</Grid>));

    return (
        <React.Fragment>
            <HeaderBar title={barTitle || title} />
            <Grid container
                className={className}
                spacing={0}
                direction="column"
                justify="center"
                wrap="nowrap"
                alignItems="center">
                {renderRows}
            </Grid>
        </React.Fragment>
    );
};

Screen.defaultProps = {
    className: 'defaultScreen',
    title: '',
    barTitle: '',
    progress: 0
};

Screen.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    barTitle: PropTypes.string,
    children: PropTypes.node.isRequired,
    progress: PropTypes.number
};

export default Screen
