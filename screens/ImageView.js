import React from "react";
import {
  View,
} from "react-native";

import ResponsiveImage from 'react-native-responsive-image'; // you can also use default react native Image  

class ImageView extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', null); //
        const imagepath = navigation.getParam('iPath', null); // get image path from previous routing
        itemId == null ? this.props.navigation.navigate("Home") : '';

        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
                <ResponsiveImage source = {{uri: "https://test.snapshop.fi/api/v1"+imagepath + "?type=thumbnail"}} initWidth = "300" initHeight = "300" / >
            </View>
        );
    }


}

export default ImageView;