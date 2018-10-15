import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Screen from '../Screen'
import QuestionChoice from './QuestionChoice';
import _ from 'lodash';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Button from '@material-ui/core/Button/Button';
import SecondChance from './SecondChance';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ForwardIcon from '@material-ui/icons/Forward';

const styles = theme => ({
    root: {
        flexGrow: 1,
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
    question: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        overflowWrap: 'break-word'
    },
    headerRight:{
        textAlign: 'right'
    },
    gridImage:{
        width: 175,
        height: 175,
        margin: 10,
    }
});

class Question extends Component {
    constructor(props){
        super(props);
        this.state = {
            choices: _.shuffle(props.choices),
            incorrect: 0,
            didAnswer: false,
            showSecondChance: false,
            isFinalAnswer: false,
            finalScore: 0
        };
        this.handleOnAnswer = this.handleOnAnswer.bind(this)
    }

    componentDidUpdate(prevProps, prevState){
        const {number, choices} = this.props;
        if(prevProps.number !== number){
            this.setState({
                choices: _.shuffle(choices),
                incorrect: 0,
                didAnswer: false,
                isFinalAnswer: false,
                showSecondChance: false
            })
        }
    }

    getNewChoices = (userChoice, sliceIndex = this.state.choices.length - this.state.incorrect) => {
        const {choices} = this.state;
        if(userChoice){
            return choices.filter(e => e !== userChoice)
        } else {
            return [...choices].slice(0, sliceIndex);
        }
    };

    handleOnAnswer(answer, cb =()=>{}){
        const {correctId, onSubmit} = this.props;
        const isCorrect = _.isEqual(correctId, answer);

        if(isCorrect) {
            cb(true);
            onSubmit({ correct: 1, answer });
            return this.setState({isFinalAnswer: true, showSecondChance: false, finalScore: 1})
        }

        this.setState(({choices:currChoices, incorrect:currIncorrect}) => {
            let nextIncorrect = currIncorrect+1;
            let showSecondChance = nextIncorrect >= 4;
            let nextChoices = this.getNewChoices(answer)

            return {
                didAnswer: true,
                incorrect: nextIncorrect,
                choices: nextChoices,
                showSecondChance
            }
        }, () => {
            cb(false)
        })
    };

    secondChanceCompleted = (isCorrect, answer) => {
        const {onSubmit} = this.props;
        if(isCorrect){
            onSubmit({ correct: 0.5, answer, type: 'second-chance'});
        }
        this.setState({isFinalAnswer: true})
    };

    handleOnNext = () => {
        this.props.onNext(this.state.didAnswer);
    };

    renderVariantHeader = () => {
        const {showSecondChance} = this.state;
        const {classes, variant, choices:nonSortedChoices} = this.props;
        let {headshot: {url}} = _.head(nonSortedChoices);

        if(showSecondChance) return null;

        switch(variant){
            case 'people':
                return (
                    <Grid item xs={12}>
                        <Avatar alt={'question image'} src={url} className={classes.gridImage} />
                    </Grid>
                );
            default:
                return null;
        }
    };

    renderChoices = () => {
        const {choices, isFinalAnswer, showSecondChance} = this.state;
        const { number, correctId, variant} = this.props;

        return (choices.map((choice,i) => {
            const {id, firstName, lastName, headshot: {url:hUrl}} = choice;
            return (
                <Grid item key={`${i}-${id}`}>
                    <QuestionChoice
                        questionNum={number}
                        variant={variant}
                        id={id}
                        imageUrl={hUrl}
                        name={`${firstName} ${lastName}`}
                        readOnly={isFinalAnswer || showSecondChance}
                        forceResult={(isFinalAnswer || showSecondChance) ? (id === correctId ? 'correct' : 'incorrect') : ''}
                        onClick={this.handleOnAnswer}
                    />
                </Grid>
            )
        }));
    };


    render() {
        const {number, isFinalAnswer, showSecondChance} = this.state;
        const {classes, question, choices:nonSortedChoices} = this.props;

        return (
            <Screen className={classes.root} title={question} >
                {this.renderVariantHeader()}
                <FormControl className={classes.formControl}>
                    <Grid container spacing={16} justify="center">
                        {showSecondChance ? <SecondChance number={number} answer={nonSortedChoices[0]} onComplete={this.secondChanceCompleted}/> : this.renderChoices()}
                    </Grid>

                    <Button
                        variant={'extendedFab'}
                        color="primary"
                        aria-label="Skip/Next Question"
                        className={classes.button}
                        disabled={!isFinalAnswer && showSecondChance}
                        onClick={this.handleOnNext}>
                        {isFinalAnswer || showSecondChance ? <ForwardIcon className={classes.extendedIcon} /> : <SkipNextIcon className={classes.extendedIcon} /> }
                        {isFinalAnswer || showSecondChance ? 'Next' : 'Skip'} Question
                    </Button>
                </FormControl>
            </Screen>
        )
    }
}

Question.defaultProps = {
    onSubmit: () => {},
    onNext: () => {},
};

Question.propTypes = {
    variant: PropTypes.string,
    classes: PropTypes.object.isRequired,
    number: PropTypes.number.isRequired,
    question: PropTypes.string.isRequired,
    correctId: PropTypes.string.isRequired,
    choices: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    onNext: PropTypes.func
};

export default withStyles(styles)(Question);
