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
import {View, Text} from "react-native";
var { connect } = require('react-redux');
var StyleSheet = require('StyleSheet');
import { Button } from 'react-native-material-design';
var { switchScene } = require('./../actions/navigation');

import type {Scene} from './../reducers/navigation';

class WelcomeScreen extends React.Component {
  props: {
    onSceneSelect: (scene: Scene) => void;
    navigator: Navigator;
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  onSceneSelect(scene) {
    this.props.onSceneSelect(scene);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to BibleZ
        </Text>
        <Text style={styles.instructions}>
          You don't have any Bible installed. Please open the Module Manager to install a Bible!
        </Text>
        <Button text="Open Module Manager" raised={true} onPress={this.onSceneSelect.bind(this, 'moduleManager')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

function select(store) {
  return {
    scene: store.navigation.scene
  };
}

function actions(dispatch) {
  return {
    onSceneSelect: (scene) => dispatch(switchScene(scene))
  };
}

module.exports = connect(select, actions)(WelcomeScreen);
