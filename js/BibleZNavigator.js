/**
 *
 * BibleZ is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BibleZ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
 "use strict";

var React = require('React');
var BackAndroid = require('BackAndroid');
var Navigator = require('Navigator');
var StyleSheet = require('StyleSheet');

var WelcomeScreen = require('./welcome/WelcomeScreen');
var ModuleManagerScreen = require('./moduleManager/ModuleManagerScreen');
var { connect } = require('react-redux');
var { switchScene } = require('./actions/navigation');


var BibleZNavigator = React.createClass({
  _handlers: ([]: Array<() => boolean>),

  componentDidMount: function() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  },

  componentWillUnmount: function() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  },

  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  },

  addBackButtonListener: function(listener) {
    this._handlers.push(listener);
  },

  removeBackButtonListener: function(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  },

  handleBackButton: function() {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.scene !== 'welcome') {
      this.props.dispatch(switchScene('welcome'));
      return true;
    }

    return false;
  },

  render: function() {
    return (
      <Navigator
        ref="navigator"
        style={styles.container}
        configureScene={(route) => {
          return Navigator.SceneConfigs.FloatFromBottomAndroid;
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    );
  },

  renderScene: function(route, navigator) {
    if (this.props.scene === "welcome") {
      return (
        <WelcomeScreen
          {...route}
          navigator={navigator}
        />
      );
    }
    if (this.props.scene === "moduleManager" /*route.moduleManager*/) {
      return (
        <ModuleManagerScreen
          {...route}
          navigator={navigator}
        />
      );
    }
    //return <F8TabsView navigator={navigator} />;
    return <WelcomeScreen navigator={navigator} />
  },
});

BibleZNavigator.childContextTypes = {
  addBackButtonListener: React.PropTypes.func,
  removeBackButtonListener: React.PropTypes.func,
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

function select(store) {
  return {
    scene: store.navigation.scene,
  };
}

module.exports = connect(select)(BibleZNavigator);
