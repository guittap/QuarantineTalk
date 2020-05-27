import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

import Chat from "../components/chat/Chat";
import Profile from "../components/profile/Profile";
import ChatSkeleton from "../utility/ChatSkeleton";

import { connect } from "react-redux";
import { getChats } from "../redux/actions/dataActions";

class home extends Component {
  componentDidMount() {
    this.props.getChats();
  }

  render() {
    const { chats, loading } = this.props.data;
    let recentChatsMarkup = !loading ? (
      chats.map((chat) => <Chat key={chat.chatId} chat={chat} />)
    ) : (
      <ChatSkeleton />
    );
    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {recentChatsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getChats: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getChats })(home);
