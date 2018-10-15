import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import Question from '../components/Question';
import Loading from '../components/Loading';
import Start from '../components/Start';
import ErrorMessage from '../components/ErrorMessage';
import Results from '../components/Results';
const CancelToken = axios.CancelToken;

const shuffle = (arr) => {
    let temp, pointer = arr.length, current;

    if(pointer)
        while(pointer--){
        current = Math.floor(Math.random() * (pointer+1));
        temp = arr[current];
        arr[current] = arr[pointer];
        arr[pointer] = temp;
    }
    return arr;
};

//TODO: a lot of these api responses, should be cleaned up on the server level to not return values when invalid or return default images.
const isValidHeadshot = ({type, mimeType, id, alt, url}) => {
    return (
        mimeType && (['image/jpeg', 'image/png'].indexOf(mimeType) > -1)
        && url && !_.isEqual(url, '//images.ctfassets.net/3cttzl4i3k1h/5ZUiD3uOByWWuaSQsayAQ6/c630e7f851d5adb1876c118dc4811aed/featured-image-TEST1.png')
        && id && !_.isEqual(id, 'no id configured')
        && alt && !_.isEqual(alt, 'no title configured')
    )
};

//TODO: replace axios with fetch w/ abortcontroller
/**
 * This is the main container for the Trivia Component.
 * @see App
 */
class Trivia extends Component {
    state = {
        status: 'loading',
        message: '',
        loading: true,
        people: [],
        questionNum: 1,
        question: {},
        questionBank: [],
        userScores: [],
        jobTitles: []
    };

    componentDidMount(){
        this.newGame();
    };

    /**
     * Captures errors within the Trivia app
     * @param error
     * @param info
     */
    componentDidCatch(error, info){
        this.setState({status: 'error', loading: false, message: error.toString()})
    };

    /**
     * Calls the api to get questions
     * @param cb
     */
    callApi = (cb) => {

        // cancel previous request
        if (typeof this._req !== typeof undefined) {
            this._req.cancel('Operation canceled due to new ')
        }
        this._req = CancelToken.source();

        this.setState({loading: true}, () => {
            axios.get('https://willowtreeapps.com/api/v1.0/profiles/', {
                cancelToken: this._req.token
                })
                .then(({data, status}) => {
                    _.isEqual(status, 200) && _.isArray(data) ? cb(data) : cb([]);
                })
                .catch((error) => {
                    console.error(error);
                    if (axios.isCancel(error)) {
                        console.log('Request canceled', error);
                    } else {
                        this.setState({
                            loading: false, status: 'error', message: 'There are no people available! Either a problem with the api or your internet connection is freaking out!',
                        });
                    }
                })
        });
    }

    /**
     * Reset the state to view the start screen
     * @param shuffle rearrange questions
     */
    resetGame(shuffle){
        this.setState(({questions}) => {

            let nextState = {
                loading: false,
                questionNum: 1,
                userScores: [],
                userChoices: [],
                status: 'ready'
            };

            if(shuffle) nextState.questions = _.shuffle(questions);

            return nextState
        })
    };

    /**
     * Resets the state for quiz answering
     * @see Start
     * @param forceStart
     */
     newGame = (forceStart) => {
        this.callApi((people) => {
            //Let us filter out non current employees (TODO: this should be on the server level so it does not waste the users' bandwidth)

            const jobTitles = [];
            let questionBank = shuffle(people.reduce((res, person, i) => {
                 //get a job title if any
                if(person.jobTitle){
                    //add to jobTitles array if not exist
                    if(jobTitles.indexOf(person.jobTitle) <= -1) jobTitles.push(person.jobTitle);

                    //filter invalid headshot images
                    if(isValidHeadshot(person.headshot)) res.push(i)
                }
                return res;
            }, []));

            //filter invalid images
            this.setState(() => {
                let status = _.isEmpty(people) ? 'error' : forceStart ? 'active' : 'ready';
                let message = _.isEmpty(people) ? 'No People Received' : '';
                return {
                    status,
                    message,
                    loading: false,
                    people,
                    questionNum: 1,
                    questionBank,
                    userScores: [],
                    userChoices: [],
                    jobTitles
                }
            });
        })
    };

    /**
     * Starts the game, sets question 1
     * @see Question
     */
    startGame = () => {
        this.setState({
            status: 'active',
            questionNum: 1,
            question:  this.prepareQuestionData(1),
            userScores: [],
            userChoices: [],
        });
    };

    /**
     * Handles when a Question is answered through onSubmit
     * @see Question
     * @param correct
     * @param answer  the answer
     */
    handleAnswered = ({correct, answer}) => {
        return this.setState(({questionBank, people, questionNum, userScores, userChoices}) => {
            return ({
                userScores: [...userScores, correct],
                userChoices: [...userChoices, answer]
            })
        })
    };

    nextQuestion = () => {
        return this.setState(({questionBank, people, questionNum, userScores, userChoices}) => {
            let answeredQuestion = userChoices.length === questionNum;
            let nextQuestion = questionNum + 1;
            let isActive = nextQuestion <= questionBank.length;

            let nextState = {
                status: isActive ? 'active': 'finished',
                questionNum: nextQuestion,
                question: isActive ? this.prepareQuestionData(nextQuestion) : {}
            };

            if(!answeredQuestion){
                nextState.userScores = [...userScores, 0];
                nextState.userChoices = [...userChoices, 'SKIP'];
            }

            return nextState;
        })
    };



    prepareQuestionData = (qIndex) => {
        const {questionBank, people} = this.state;
        const pIndex = questionBank[qIndex-1];
        const correct = people[pIndex];
        const {firstName, lastName, id} = correct;

        const incorrect = _.sampleSize(_.without(questionBank, pIndex), 4).map(i => people[i]);
        const variant = _.random(1,0) === 1 ? 'people' : 'images';
        let question;

        switch(variant){
            case 'people':
                question = `Which person matches the photo?`;
                break;
            case 'images':
            default:
                question = `Who is ${firstName} ${lastName}?`;
                break;
        }

        return ({
            variant,
            question,
            correctId: id,
            choices: [correct, ...incorrect]
        })
    };

    //main render function
    render() {
        const {question, questionNum, userScores, status, message, loading} = this.state;

        if(loading) return <Loading />;

        switch(status){
            case 'ready':
                return <Start onStart={this.startGame}/>;
            case 'active':
                return <Question number={questionNum} onSubmit={this.handleAnswered} onNext={this.nextQuestion} {...question} />;
            case 'finished': //TODO: add leaderboard
                return <Results userScores={userScores}/>;
            case 'error':
            default:
                return <ErrorMessage message={message} onDismiss={this.newGame} disabled={loading} />;
        }
    };
}

export default Trivia
