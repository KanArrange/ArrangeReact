


var F8App = require('F8App');
var FacebookSDK = require('FacebookSDK');
var Parse = require('parse/react-native');
var React = require('React');
var Relay = require('react-relay');
var {Provider} = require('react-redux');
var configureStore = require('./store/configureStore');
var {serverURL} = require('./env');

function setup():ReactClass<{}>{
  console.disableYellowBox = true;
  Parse.initialize('oss-f8-app-2016');
  Parse.serverURL = `${serverURL}/parse`;

  FacebookSDK.init();
  Parse.FacebookUtils.init();
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${serverURL}/graphql`,{
      fetchTimeout:3000,
      retryDelays:[5000,10000],
    })
  );
  class Root extends React.Component{
    state:{
      isLoading:boolean;
      store:any;
    };
    constructor(){
      super();
      this.setState({
        isLoading:true;
        store = configureStore(()=> this.setState({isLoading:false}));
      });
    }
    render{
      if (this.state.isLoading) {
        return null;
      }
      return (
        <Provider store={this.state.store}
          <F8App/>
          />
      );
    }
  }
  return Root;
}
