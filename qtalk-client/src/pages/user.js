import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";
import Chat from "../components/chat/Chat";
import StaticProfile from "../components/profile/StaticProfile";

class user extends Component {
  state = {
    profile: null,
    chatIdParam: null,
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const chatId = this.props.match.params.chatId;

    if (chatId) this.setState({ chatIdParam: chatId });

    this.props.getUserData(handle);
    axios
      .get(`/user/${handle}`)
      .then((res) => {
        this.setState({
          profile: res.data.user,
        });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { chats, loading } = this.props.data;
    const { chatIdParam } = this.state;

    const chatsMarkup = loading ? (
      <p>Loading data...</p>
    ) : chats === null ? (
      <p>No screams from this user</p>
    ) : !chatIdParam ? (
      chats.map((chat) => <Chat key={chat.chatId} chat={chat} />)
    ) : (
      chats.map((chat) => {
        if (chat.chatId !== chatIdParam)
          return <Chat key={chat.chatId} chat={chat} />;
        else return <Chat key={chat.chatId} chat={chat} openDialog />;
      })
    );

    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {chatsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p>Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserData })(user);
