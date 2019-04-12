import React, {
  Component,
  PropTypes
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import {
  FAB
} from "react-native-paper";

import Camera from 'react-native-camera';
import api from './network';

class CameraScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imgPath: null,
      uploadLoader: false
    };
  }

  /**
   * Capturing Image from Camera shot
   *
   * @memberof CameraScreen
   */
  takePicture() {

    this.camera.capture().then((data) => {
      this.setState({imgPath: data.path});
      
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * uploading image to server
   *
   * @memberof CameraScreen
   */
  storePicture() {  

    if (this.state.imgPath) {
      this.setState({
        uploadLoader: true
      });
    
      // Create the form data object
      var data = new FormData();
      data.append('image', {
        uri: this.state.imgPath,
        name: 'nepkoder.jpg', // image file name
        type: 'image/jpg'
      });

      api.uploadImageToServer(data).then(res => {
        console.log('Reponse From Server: ' +res);
        
        if(!res) {
          console.log('no internet connection.');
        }


        this.setState({
          imgPath: null,
          uploadLoader: false
        });

        // navigate to HomeScreen 
        // this.props.navigation.navigate("Home");
        this.props.navigation.navigate("Home", {
          cameraOK: true,
        });


      });

    }
  }

  render() {

    const { navigate } = this.props.navigation;

    if (this.state.uploadLoader) {
      return ( 
      <View style = {{flex:1, flexDirection:'column', justifyContent: 'center', alignItems:'center' }} >
          <ActivityIndicator size = "large" color = "#0000ff" />
            <Text style={{justifyContent:'center', alignItems:'center', marginTop:20 }}>Image Uploading...</Text>
      </View>
        
      );
    }



    if(this.state.imgPath) {

      return ( 
      <View style = {styles.container} >
          <Image source = {{ uri: this.state.imgPath}} style = {styles.view} />
            <FAB style = {styles.fabOK} large icon = "done" onPress = {this.storePicture.bind(this)} />
            <FAB style = {styles.fabClose} large icon = "close" onPress = {() => this.setState({imgPath: null})} />
      </View>
      
      );

    } else {


      return ( 
        <View style = {styles.container} >
          <Camera ref = {(cam) => {this.camera = cam}}
                  style = {styles.view}
                  captureTarget={Camera.constants.CaptureTarget.disk}
                  aspect = {Camera.constants.Aspect.fill}  >

          <FAB style = {styles.fab} large icon = "camera-alt" onPress = {this.takePicture.bind(this)} />
          </Camera> 
        </View>
      );

      }

  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  view: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  fab: {
      position: 'absolute',
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
  },
  fabOK: {
    position:'absolute',
    justifyContent: 'flex-start',
    bottom: 0,
    marginLeft: 70,
    marginBottom:10,
    backgroundColor: "#0000ff"
  },
  fabClose: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    justifyContent: 'flex-end',
  }

});

export default CameraScreen;