import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Chat from "../components/Chat";

class home extends Component {
  state = {
    chats: null,
  };
  componentDidMount() {
    axios
      .get("/chats")
      .then((res) => {
        console.log(res.data);
        this.setState({
          chats: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    let recentChatsMarkup = this.state.chats ? (
      this.state.chats.map((chat) => <Chat chat={chat} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {recentChatsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
