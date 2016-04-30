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

class VerseView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verses: [],
      title: "Main"
    };
  }

  componentDidMount() {
    mSwordZ.SWMgr_reInit();
    /*mSwordZ.SWModule_getKeyChildren("GerNeUe", (keyChildren) => {
      console.log(keyChildren);
    });*/
    mSwordZ.SWModule_getRenderText("GerNeUe", "John 3", (renderText) => {
      var verses = JSON.parse(renderText);
      console.log(verses);
      this.setState({verses: verses, title: verses[0].verseKey.split(":")[0]});
    })
  }

  onSceneSelect(scene) {
    this.props.onSceneSelect(scene);
  }

  _renderVerses() {
    var versesView = this.state.verses.map((verse) => {
      return (
        <Text key={verse.verseKey}>
          <Text key={verse.verseKey+"a"} style={styles.verseNumber}>{verse.verseKey.split(":")[1]} </Text>
          <Text key={verse.verseKey+"b"}>{verse.text} </Text>
        </Text>
      )
    });

    return(
      <Text style={styles.verseViewContainer}>
        {versesView}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar
          title={this.state.title}
          onTitlePress={() => this.onSceneSelect("passage")}
          primary="paperBrown"
          icon = "menu"
          onIconPress = {() => this.props.openDrawer()}
          actions={[{
              icon: 'book'
          }]}
          rightIconStyle={{
              margin: 10
          }}
        />
        <ScrollView style={styles.scrollView}>
          {this._renderVerses()}
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
  },
  verseViewContainer: {
    margin: 10,
    lineHeight: 25,
    fontSize: 18,
    fontFamily: "serif"
  },
  verseNumber: {
    fontWeight: "bold"
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

module.exports = connect(select, actions)(VerseView);
