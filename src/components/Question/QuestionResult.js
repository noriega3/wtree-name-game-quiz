import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import CheckBoxIcon from '@material-ui/icons/CheckBoxOutlined'
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined'
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    correct: {
        color: green[800],
    },
    incorrect: {
        color: red[800],
    }
});

const QuestionResult = ({classes, userChoice, userScore}) => {
    const isCorrect = userScore>0;
    const color = isCorrect ? classes.correct : classes.incorrect;

    return (
        <TableRow className={classes.root}>
            <TableCell padding={'none'}>
                {isCorrect ? <CheckBoxIcon className={color}/> : <IndeterminateCheckBoxIcon className={color}/>}
            </TableCell>
            <TableCell>

            </TableCell>
        </TableRow>
    );
};

QuestionResult.defaultProps = {
    userChoice: 'Unanswered',
    userScore: 0
};

QuestionResult.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    userChoice: PropTypes.string,
    userScore: PropTypes.number
};

export default withStyles(styles)(QuestionResult);
