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
var { setPassage } = require('./../actions/main');
var mSwordZ = require('NativeModules').SwordZ;

class PassageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      title: "Choose a book",
      view: "books",
      book: null
    };
  }

  componentDidMount() {
    mSwordZ.SWModule_getBooks("GerNeUe", (books) => {
      console.log("BOOKS", JSON.parse(books));
      this.setState({books: JSON.parse(books)});
    });
  }

  setBook(book, view) {
    //console.log("SETBOOK",book, view);
    this.setState({book: book, view: view, title: book.name});
    this.refs.scrollView.scrollTo({y: 0, animated: false});
  }

  handleBack() {
    this.refs.scrollView.scrollTo({y: 0, animated: false});
    if(this.state.view === "chapters")
      this.setState({view: "books", title: "Choose a book"});
    else
      this.onSceneSelect("main")
  }

  onSceneSelect(scene) {
    this.props.onSceneSelect(scene);
  }

  onPassageSelect(chapter) {
    console.log("chapter", chapter);
    let osis = this.state.book.abbrev + "." + chapter;
    this.props.onPassageSelect(osis);
    this.props.onSceneSelect("main");
  }

  _renderTiles() {
    if(this.state.view === "books") {
      var tiles = this.state.books.map((book, i) => {
        return (
          <TouchableNativeFeedback key={i} onPress={() => this.setBook(book, "chapters")}>
            <View style={styles.tile} key={book.abbrev+"View"}>
              <Text style={styles.tileText} key={book.abbrev}>{book.abbrev.slice(0,4)}</Text>
            </View>
          </TouchableNativeFeedback>
        )
      });
    } else if(this.state.view === "chapters") {
      var tiles = [];
      for (var i=0;i<this.state.book.chapterMax;i++) {
        let c = i+1;
        tiles.push(
          <TouchableNativeFeedback key={i} onPress={() => this.onPassageSelect(c)}>
            <View style={styles.tile} key={i+"View"}>
              <Text style={styles.tileText} key={i+"tile"}>{i+1}</Text>
            </View>
          </TouchableNativeFeedback>
        );
      }
    }



    return(
      <View style={styles.tilesContainer}>
        {tiles}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Toolbar
          title={this.state.title}
          primary="paperBrown"
          icon = "arrow-back"
          onIconPress = {() => this.handleBack()}
        />
        <ScrollView style={styles.scrollView} ref="scrollView">
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
  },
  tilesContainer: {
    margin: 10,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  tile: {
    borderWidth: 1,
    borderColor: "#bcaaa4",
    padding: 5,
    margin: 3,
    backgroundColor: "#efebe9",
    width: 60,
    height: 40
  },
  tileText: {
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1
  }
});

function select(store) {
  return {
    scene: store.navigation.scene
  };
}

function actions(dispatch) {
  return {
    onSceneSelect: (scene) => dispatch(switchScene(scene)),
    onPassageSelect: (passage) => dispatch(setPassage(passage))
  };
}

module.exports = connect(select, actions)(PassageSelector);
