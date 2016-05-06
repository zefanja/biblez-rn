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
var Icon = require('react-native-vector-icons/MaterialIcons');
var { switchScene } = require('./../actions/navigation');
var { setModules, setCurrentModule } = require('./../actions/main');
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
    this.getVerses(true);
  }

  getVerses(loadModules) {
    if (loadModules) {
      mSwordZ.SWMgr_getModInfoList((modules) => {
        //console.log("MODULES: ", modules);
        let tmpModules = JSON.parse(modules);

        if(tmpModules.length === 0) {
          this.onSceneSelect("welcome");
        } else {
          this.onHandleModules(tmpModules);
          let currentModule = this.props.currentModule || tmpModules[0].name
          mSwordZ.SWModule_getStripText(currentModule, this.props.passage, (renderText) => {
            var verses = JSON.parse(renderText);
            console.log(verses);
            this.setState({verses: verses, title: verses[0].verseKey.split(":")[0]});
          });
        }
      })
    } else {
      mSwordZ.SWModule_getStripText(this.props.currentModule, this.props.passage, (renderText) => {
        var verses = JSON.parse(renderText);
        console.log(verses);
        this.setState({verses: verses, title: verses[0].verseKey.split(":")[0]});
      })
    }
  }

  onSceneSelect(scene) {
    this.props.onSceneSelect(scene);
  }

  onHandleModules(modules) {
    this.props.onHandleModules(modules);
  }

  onModuleSelect(module) {
    this.props.onModuleSelect(module.title);
    this.getVerses();
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
    let modulesMenu = this.props.modules.map((mod) => {
      return { title: mod.name, show: 'never' }
    });

    return (
      <View style={styles.container}>
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          navIconName="menu"
          iconColor="white"
          onIconClicked = {() => this.props.openDrawer()}
          actions={modulesMenu}
          onActionSelected={(idx) => {
            this.onModuleSelect(modulesMenu[idx]);
          }}
          overflowIconName="book"
        >
          <View>
            <Text onPress={() => this.onSceneSelect("passage")} style={styles.toolbarTitle}>{this.state.title}</Text>
          </View>
        </Icon.ToolbarAndroid>
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
  toolbar: {
    backgroundColor: "#795548",
    height: 56
  },
  toolbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    height: Dimensions.get("window").height - 112,
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
    scene: store.navigation.scene,
    passage: store.main.passage,
    modules: store.main.modules,
    currentModule: store.main.currentModule
  };
}

function actions(dispatch) {
  return {
    onSceneSelect: (scene) => dispatch(switchScene(scene)),
    onHandleModules: (modules) => dispatch(setModules(modules)),
    onModuleSelect: (module) => dispatch(setCurrentModule(module))
  };
}

module.exports = connect(select, actions)(VerseView);
