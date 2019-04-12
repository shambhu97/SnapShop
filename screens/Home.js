import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  ToastAndroid,
  Alert,
  NetInfo,
  BackHandler,
  PermissionsAndroid
} from "react-native";
import {
  FAB,
  TouchableRipple
} from "react-native-paper";
import ResponsiveImage from 'react-native-responsive-image'; // you can also use react native Image  
import api from './network';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      GridListItems: null,
      counter: 0,
      noMoreData: false
    };
  }

  componentDidMount() {

    requestCameraPermission();

    async function requestCameraPermission() {
      try {

        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ])

        // 

      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
   * fetching data during app first load 
   * and after successfully upload to server.
   *
   * @memberof HomeScreen
   */
  componentWillMount() {
    this.fetchImageData();

    // this is called only when, after the picture successfully uploaded to server.
    this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {

      let cstatus = this.props.navigation.getParam('cameraOK', false);
      if (cstatus) {
        this.listRef.scrollToOffset({ animated: true, offset: 0 });
        setTimeout(() => {

          api.getUploadedImage().then(res => {
            let itemsList = this.state.GridListItems;
            itemsList.unshift(res[0]);
            this.setState({
              GridListItems: itemsList
            });

            cstatus=false;
          });

        }, 200);
      }
    });

  }


  /**
   * fetch data from 0 to 21 items only during app first load.
   *
   * @memberof HomeScreen
   */
  fetchImageData() {

    // check internet connection status
    NetInfo.isConnected.fetch().done((isConnected) => {

      if (isConnected == true) {

        /* 
          GET request for image data between 0 to 21 items
        */
        api.getImageItems().then(res => {

          console.log('Intial Load: 0-21 '); // 0 to 21

          this.setState({
            isLoading: false,
            counter: 0,
            GridListItems: res,
          });

        });

      } else {

        this.setState({
          isLoading: false,
          GridListItems: null
        })

        // no internet service alert and exit
        Alert.alert('No Internet Connection Available', '', [{
          text: 'OK',
          onPress: () => BackHandler.exitApp()
        }], {
          cancelable: false
        });
      }

    });

  }

  loadMore() {

    // this is only for pagination , change it

    let range = this.state.counter + 21;

    this.setState({
      counter: range
    });

    console.log('loading: ' +range + '-21');

    if (!this.state.noMoreData) {

      ToastAndroid.show('Loading Pictures...', ToastAndroid.SHORT);

      api.fetchMoreImage(range).then(responseJson => {

        if (responseJson.length == 0) {
          this.setState({
            noMoreData: true
          });
          ToastAndroid.show('No More Pictures Available', ToastAndroid.SHORT);
          console.log('No More Available, ie no more fetching data/api');

        } else {
          this.setState({
            noMoreData: false
          });
        }

        let nepkoder = this.state.GridListItems;
        responseJson.forEach(function (item) {
          nepkoder.push(item);
        });

        this.setState({
          isLoading: false,
          GridListItems: nepkoder,
        });

      });

    }

  }


  /**
   *
   * @param {item} contains image data
   * just navigate to another screen to display image !!
   * @memberof HomeScreen
   */
  selectedImage(item) {

    this.props.navigation.navigate('Img', {
      itemId: item.id,
      iPath: item.path,
    });

  }

  //  handleRefresh = ()=> {
  //    this.setState({
  //      refreshing:true,
  //      GridListItems: null,
  //      counter: 0
  //    });
  //   //  this.noMoreData=false;
  //    this.fetch();
  //  }

  render() {
    //  loader during requesting API 
    if (this.state.isLoading) {
      return (
        <View style = {styles.container} >
            <ActivityIndicator size = "large" color = "#0000ff" />
        </View>
      );

    }

    return (
      <View style = {
        styles.container
      } >
      <FlatList
          data = {this.state.GridListItems}
          renderItem = { ({item}) =>
              <View style = {styles.GridViewContainer} >
                <TouchableRipple onPress = { () => this.selectedImage(item)} rippleColor = "rgba(0, 0, 0, .32)" >
                  <ResponsiveImage source = {{ uri: "https://test.snapshop.fi/api/v1" + item.path + "?type=thumbnail"}} initWidth = "138" initHeight = "138" />
                </TouchableRipple>
              </View >
          }
          numColumns = {3}
          onEndReached = {this.loadMore.bind(this)}
          onEndReachedThreshold={0.01}
          ref={(ref) => { this.listRef = ref }}
      />

      <FAB style = {styles.fab} large icon = "camera-alt" onPress = { () => this.props.navigation.navigate("Camera") } />
      
      </View >
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  },
  GridViewContainer: {
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    margin: 1
  },
  GridViewTextLayout: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: '#fff',
    padding: 10,
  },
  GridImage: {
    height: 100,
    width: 150
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
})

export default HomeScreen;