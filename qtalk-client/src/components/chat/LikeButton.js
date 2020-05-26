import React, { Component } from "react";
import MyButton from "../../utility/MyButton";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Redux
import { connect } from "react-redux";
import { likeChat, unlikeChat } from "../../redux/actions/dataActions";

class LikeButton extends Component {
  likedChat = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find((like) => like.chatId === this.props.chatId)
    )
      return true;
    else return false;
  };

  likeChat = () => {
    this.props.likeChat(this.props.chatId);
  };

  unlikeChat = () => {
    this.props.unlikeChat(this.props.chatId);
  };

  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedChat() ? (
      <MyButton tip="Undo Like" onClick={this.unlikeChat}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeChat}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  chatId: PropTypes.string.isRequired,
  likeChat: PropTypes.func.isRequired,
  unlikeChat: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeChat,
  unlikeChat,
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
