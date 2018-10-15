import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import CardActions from '@material-ui/core/CardActions';

const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    formControl: {
        display: 'block',
        marginTop: theme.spacing.unit,
    },
    button: {
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit,
    },
    actions : {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    chip: {
        margin: theme.spacing.unit,
    },
});

const filterBio = (bio, jobTitle = '') => {
    return _.isEqual(bio, jobTitle) ? '' : bio;
};

const Profile = ({
    classes,
    theme,
    variant,
    id,
    type,
    slug,
    jobTitle,
    firstName,
    lastName,
    headshot,
    socialLinks,
    bio,
    hideJobTitle
}) => (
    <React.Fragment>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.cover}
                    image={headshot.url}
                    title={headshot.alt}
                />
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {firstName} {lastName}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {!hideJobTitle ? jobTitle : 'Job Title?'}
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                            {filterBio(bio, jobTitle)}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.actions}>
                        {
                            socialLinks.map((social, i) => {
                                return(
                                    <Chip
                                        key={i}
                                        label={social.callToAction}
                                        onClick={() => window.open(social.url, "_blank")}
                                        className={classes.chip}
                                        variant="outlined"
                                    />
                                )
                            })
                        }
                    </CardActions>
                </div>
            </Card>
    </React.Fragment>
);

Profile.defaultProps = {
    variant: 'all',
    type: 'people',
    slug: '',
    jobTitle: 'Former Employee',
    firstName: '',
    lastName: '',
    headshot: {},
    socialLinks: [],
    bio: '',
    hideJobTitle: false,
};

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    hideJobTitle: PropTypes.bool,
    type: PropTypes.string,
    slug: PropTypes.string,
    jobTitle: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    headshot: PropTypes.object,
    socialLinks: PropTypes.array,
    bio: PropTypes.string,
    variant: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(Profile);
