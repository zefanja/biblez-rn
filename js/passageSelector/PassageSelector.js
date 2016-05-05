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
import {View, Text, TouchableNativeFeedback, ScrollView, ListView} from "react-native";
var { connect } = require('react-redux');
var StyleSheet = require('StyleSheet');
var Dimensions = require('Dimensions');
import { Button, Toolbar, Icon } from 'react-native-material-design';
var { switchScene } = require('./../actions/navigation');
import type {Scene} from './../reducers/navigation';
var mSwordZ = require('NativeModules').SwordZ;

class PassageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      title: "Choose a book",
    };
  }

  componentDidMount() {
    // mSwordZ.SWModule_getBooks("GerNeUe", (books) => {
    //   console.log("BOOKS", JSON.parse(books));
    // });
    // mSwordZ.SWModule_getKeyChildren("GerNeUe", "Mat", (books) => {
    //   console.log("KEY CHILDREN", books);
    // });
  }

  onSceneSelect(scene) {
    this.props.onSceneSelect(scene);
  }

  _renderTiles() {
    return (
      <Text>Hallo</Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar
          title={this.state.title}
          primary="paperBrown"
          icon = "menu"
          onIconPress = {() => this.props.openDrawer()}
        />
        <ScrollView style={styles.scrollView}>
          {this._renderTiles()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  scrollView: {
    height: Dimensions.get("window").height - 112,
    marginTop: 56
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

module.exports = connect(select, actions)(PassageSelector);
