import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography/Typography';
import classNames from 'classnames';

const styles = theme => ({
    formControl: {
        display: 'block',
        marginTop: theme.spacing.unit,
    },
    personVariant: {

    },
    button: {
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit,
    },
    correct: {
        background: 'rgba(0, 255, 0, 0.26)'
    },
    incorrect: {
        background: 'rgba(255, 0, 0, 0.26)'
    },
    gridImage:{
        width: 175,
        height: 175,
        margin: 10,
    }
});
class QuestionChoice extends Component {
    constructor(props){
        super(props);
        this.state = {
            disabled: props.disabled || false,
            result: ''
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.questionNum !== this.props.questionNum){
            this.setState({
                disabled: this.props.disabled,
                result: ''
            });
        }
    }

    answerCallback = (isCorrect) => {
        this.setState({result: isCorrect ? 'correct' : 'incorrect'})
    };

    handleClick = event => {
        this.props.onClick(event.currentTarget.value, this.answerCallback);
        this.setState({disabled: true})
    };

    renderVariant = () => {
        const {classes, variant, imageUrl, name, id} = this.props;
        switch(variant){
            case 'people':
                return <Typography className={classes.personVariant} variant={'caption'} gutterBottom>{name}</Typography>;
            case 'jobTitles':
                return <div>test</div>
            case 'images':
                return <Avatar alt={id} src={imageUrl} className={classes.gridImage} />;
            default:
                return <div className={'invalid-choice-variant'}>{id}</div>
        }
    };

    render(){
        const {disabled, result} = this.state;
        const {classes, id, readOnly, forceResult} = this.props;
        const classResult = forceResult ? classes[forceResult] : !_.isEmpty(result) ? classes[result] : '';

        return (
            <React.Fragment>
                <Button
                    fullWidth
                    className={classNames(classes.button, classResult)}
                    value={id}
                    variant="outlined"
                    color="primary"
                    size="large"
                    disabled={disabled || readOnly}
                    disableRipple={true}
                    disableFocusRipple={true}
                    onClick={this.handleClick}>
                    {this.renderVariant()}
                </Button>
            </React.Fragment>
        );
    }
}

QuestionChoice.defaultProps = {
    classes: {},
    choices: [],
    onSubmit: () => {},
    disabled: false,
    readOnly: false
};

QuestionChoice.propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    choices: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool
};

export default withStyles(styles)(QuestionChoice);
