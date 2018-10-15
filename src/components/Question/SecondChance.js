import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Profile from '../Profile';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography'
import _ from 'lodash';
import Button from '@material-ui/core/Button/Button';
import classNames from 'classnames';

//TODO: get choices via context api from Trivia towards this component
const jobTitles = ["Senior Software Engineer", "Principal Software Engineer", "Software Engineer", "Chief Talent Officer", "Senior Technical Recruiter", "Principal Software Engineer", "CEO", "Principal Product Strategist", "Chief Technology Officer", "Chief Product Officer", "Director of Product Strategy", "Senior VP of Engineering", "Chief Commercial Officer", "VP of Product Design", "Director of Market Research", "VP of Security", "Senior Product Designer", "Director of Account Services", "Senior UX Researcher", "Senior Analytics Architect", "Platform Software Engineer", "Software Testing Analyst", "Director of Product Design", "Senior Software Testing Analyst", "Project Manager", "Product Designer", "Principal Product Designer", "Solutions Architect", "VP of Operations - Durham", "VP of Business Development", "Campus Recruiter", "Senior Software Test Analyst", "Controller", "Product Researcher", "Senior Content Strategist", "Product Strategist", "Software Test Engineer", "Senior Product Researcher", "Director of Business Development", "Analytics Architect", "Senior Project Manager", "VP and General Counsel", "Senior Product Strategist", "Product Design Intern", "Recruiting Intern", "VP of Project Management", "Senior Software Test Engineer", "Senior Product Researcher in User Experience", "Creative Content Specialist", "VP of Quality Assurance", "Software Engineer Intern", "Software Test Engineer Intern", "Senior Data Scientist", "VP Strategic Alliances"];

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    selected: {
        fontWeight: 900
    },
    correct: {
        background: 'rgba(0, 255, 0, 0.26)'
    },
    incorrect: {
        background: 'rgba(255, 0, 0, 0.26)'
    },
    button: {
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit,
    },
});
class SecondChance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: _.shuffle([props.answer.jobTitle, _.sample(_.without(jobTitles, props.answer.jobTitle))]),
            answered: false,
            selected: ''
        }
    }

    handleClick = (ev) => {
        ev.preventDefault();
        const {choices} = this.state;
        const {answer: {id, jobTitle}} = this.props;
        const isCorrect = _.isEqual(choices[ev.currentTarget.value].jobTitle, jobTitle);
        this.setState({answered: true, isCorrect: isCorrect, selected: ev.currentTarget.value})
        this.props.onComplete(isCorrect, id)
    };


    render(){
        const { answered, choices, selected} = this.state;
        const {classes, answer} = this.props;

        const renderChoices = () => {
            const classResult = (isRight) => answered ? isRight ? classes.correct : classes.incorrect : '';
            const classSelected = (index) => selected === `${index}` ? classes.selected: '';
            return (choices.map((choice,i) => {
                const isRight = choice === answer.jobTitle;
                return (
                    <Grid item key={i}>
                        <Button
                            fullWidth
                            className={classNames(classes.button, classResult(isRight), classSelected(i))}
                            value={i}
                            variant="outlined"
                            color="primary"
                            size="large"
                            disabled = {answered}
                            onClick={this.handleClick}>
                            {choice}
                        </Button>
                    </Grid>
                )
            }));
        };

        return (
            <React.Fragment>
                <Grid item xs={12}>
                    <Typography variant="h6" color="inherit" align="center">
                        You are granted a second chance!
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Profile {...answer} hideJobTitle={true} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" color="inherit" align="center">
                        Can you guess {answer.firstName} {answer.lastName}'s job title?
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {renderChoices()}
                </Grid>
            </React.Fragment>
        );
    };

}

SecondChance.defaultProps = {
    onComplete: () => {}
};

SecondChance.propTypes = {
    classes: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
};

export default withStyles(styles)(SecondChance);
