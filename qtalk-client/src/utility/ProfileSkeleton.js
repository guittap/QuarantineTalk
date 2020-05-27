import React from "react";
import NoImg from "../images/no-img.png";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";

//Icons
// import LocationOn from "@material-ui/icons/LocationOn";
// import LinkIcon from "@material-ui/icons/Link";
// import CalendarToday from "@material-ui/icons/CalendarToday";
import { Paper } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.skeleton,
  ...theme.spread,
  handle: {
    height: 20,
    backgroundColor: "rgb(212121)",
    width: 60,
    margin: "0 auto 7px auto",
  },
  fullLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    marginBottom: 10,
  },

  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "50%",
    marginBottom: 10,
    left: "25%",
    position: "relative",
  },
});

const ProfileSkeleton = (props) => {
  const { classes } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={NoImg} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <div className={classes.handle} />
          <hr />
          <div className={classes.fullLine} />
          <div className={classes.fullLine} />
          <hr />
          {/* <LocationOn color="primary" /> */}
          <div className={classes.halfLine} />
          <hr />
          {/* <LinkIcon color="primary" />  */}
          <div className={classes.halfLine} />
          <hr />
          {/* <CalendarToday color="primary" />  */}
          <div className={classes.halfLine} />
        </div>
      </div>
    </Paper>
  );
};

ProfileSkeleton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileSkeleton);
