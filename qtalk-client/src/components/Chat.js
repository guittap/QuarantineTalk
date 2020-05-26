import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import MyButton from "../utility/MyButton";
import DeleteChat from "./DeleteChat";
import ChatDialog from "./ChatDialog";

//MUI Junk
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Typography } from "@material-ui/core";

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

//Redux
import { connect } from "react-redux";
import { likeChat, unlikeChat } from "../redux/actions/dataActions";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
    position: "relative",
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Chat extends Component {
  likedChat = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.chatId === this.props.chat.chatId
      )
    )
      return true;
    else return false;
  };

  likeChat = () => {
    this.props.likeChat(this.props.chat.chatId);
  };

  unlikeChat = () => {
    this.props.unlikeChat(this.props.chat.chatId);
  };

  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      chat: {
        body,
        createdAt,
        userImage,
        userHandle,
        chatId,
        likeCount,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedChat() ? (
      <MyButton tip="Undo Like" onClick={this.unlikeChat}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeChat}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeleteChat chatId={chatId} />
      ) : null;

    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            image={userImage}
            title="Profile image"
            className={classes.image}
          />
          <CardContent className={classes.content}>
            <Typography
              variant="h5"
              component={Link}
              to={`/users/${userHandle}`}
              color="primary"
            >
              {userHandle}
            </Typography>

            {deleteButton}

            <Typography variant="body2" color="textSecondary">
              {dayjs(createdAt).fromNow()}
            </Typography>
            <Typography variant="body1">{body}</Typography>
            {likeButton}
            <span>{likeCount} Likes</span>
            <MyButton tip="comments">
              <ChatIcon color="primary" />
            </MyButton>
            <span>{commentCount} Comments</span>
            <ChatDialog chatId={chatId} userHandle={userHandle} />
          </CardContent>
        </Card>
      </div>
    );
  }
}

Chat.propTypes = {
  likeChat: PropTypes.func.isRequired,
  unlikeChat: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  chat: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeChat,
  unlikeChat,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Chat));
