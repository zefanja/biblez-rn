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
import {View, Text, DrawerLayoutAndroid, TouchableNativeFeedback} from "react-native";
var { connect } = require('react-redux');
var StyleSheet = require('StyleSheet');
import { Button, Toolbar, Icon } from 'react-native-material-design';
var { switchScene } = require('./../actions/navigation');

import type {Scene} from './..reducers/navigation';

class MainSreen extends React.Component {
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

  openDrawer() {
    this.refs.drawer.openDrawer();
  }

  renderContent() {
    return (
        <Toolbar
          title="Main"
          primary="paperBrown"
          icon = "menu"
          onIconPress = {() => this.openDrawer()}
          actions={[{
              icon: 'book',
              /*onPress: this.increment*/
          }]}
          rightIconStyle={{
              margin: 10
          }}
        />
    );
  }

  render() {
    var navigationView = (
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerHeaderItem}>BibleZ</Text>
        </View>
        <TouchableNativeFeedback>
          <View style={styles.drawerItemContainer}>
            <Icon name="import-contacts" style={styles.drawerIcon}/>
            <Text style={styles.drawerItem}>Main</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.drawerItemContainer}>
            <Icon name="local-library" style={styles.drawerIcon}/>
            <Text style={styles.drawerItem}>Module Manager</Text>
          </View>
        </TouchableNativeFeedback>
        <View style={{borderBottomWidth: 1, borderColor: "#d7ccc8"}}></View>
        <TouchableNativeFeedback>
          <View style={styles.drawerItemContainer}>
            <Icon name="settings" style={styles.drawerIcon}/>
            <Text style={styles.drawerItem}>Settings</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.drawerItemContainer}>
            <Icon name="info" style={styles.drawerIcon}/>
            <Text style={styles.drawerItem}>About</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );

    return (
      <DrawerLayoutAndroid
        ref="drawer"
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>
          {this.renderContent()}
        </View>
      </DrawerLayoutAndroid>
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
  drawer: {
    flex: 1,
    backgroundColor: "#efebe9"
  },
  drawerHeader: {
    backgroundColor: "#795548",
    height: 112
  },
  drawerHeaderItem: {
    margin: 20,
    fontSize: 30,
    color: "#fff",
  },
  drawerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56
  },
  drawerItem: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderColor: "#efebe9",
    fontWeight: "bold"
  },
  drawerIcon: {
    marginLeft: 10,
    color: "#795548"
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

module.exports = connect(select, actions)(MainSreen);
