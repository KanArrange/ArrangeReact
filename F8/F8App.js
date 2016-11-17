
import React,{Component} from 'react';

import {
  View,
  StyleSheet,
  StatusBar,
  AppState
} from 'react-native';

// var AppState = require('AppState');
var LoginScreen = require('./login/LoginScreen');
var PushNotificationsController = require('./PushNotificationsController');
var F8Navigator = require('./F8Navigator');
var CodePush = require('react-native-code-push');
var {
  loadConfig,
  loadMaps,
  loadNotifications,
  loadSessions,
  loadFriendsSchedules,
  loadSurveys,
} = require('./actions');
var {updateInstallation} = require('./actions/installation');
var {connect} = require('react-redux');
var {version} = require('./env');

class F8App extends React.Component{
    componentDidMount(){
      AppState.addEventListener('change',this.handleAppStateChange);
      this.props.dispatch(loadNotifications());
      this.props.dispatch(loadMaps());
      this.props.dispatch(loadConfig());
      this.props.dispatch(loadSessions());
      this.props.dispatch(loadFriendsSchedules());
      this.props.dispatch(loadSurveys());
      updateInstallation({version});
      CodePush.sync({InstallMode:CodePush.InstallMode.ON_NEXT_RESUME});
    }

    componentWillUnmount(){
      appState.removeEventListener('change',this.handleAppStateChange);
    }

    handleAppStateChange(appState){
      if ('active' === appState) {
        this.props.dispatch(loadSessions());
        this.props.dispatch(loadNotifications());
        this.props.dispatch(loadSurveys());
        CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
      }
    }

    render() {
        if (!this.props.isLoggedIn) {
          return <LoginScreen />
        }
        return (
          <View style={styles.container}>
            <StatusBar
              translucent={true}
              backgroundColor="rgba(0, 0, 0, 0.2)"
              barStyle="light-content">
            </StatusBar>
            <F8Navigator/>
            <PushNotificationsController/>
          </View>
        );
    }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
  };
}
module.exports = connect(select)(F8App);
