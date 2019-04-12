import React from "react";
import {
    View
} from "react-native";
import Home from "./screens/Home";
// import DashboardTabRoutes from "./screens/Dashboard/Routes";
import {
    createStackNavigator
} from "react-navigation";
import CustomHeader from "./components/CustomHeader";
import HeaderStyles from "./headerStyles";
import Camera from "./screens/Camera"
import ImageView from "./screens/ImageView";

const Routes = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerTitle: "SnapShop",
            headerTitleStyle: {
                textAlign: "center",
                flex: 1
            },
            header: props => < CustomHeader {
                ...props
            }
            />
        }
    },
    Camera: {
        screen: Camera,
        navigationOptions: {
            header: null
        }
    },
    Img: {
        screen: ImageView,
        navigationOptions: {
            header: null
        }
    }
}, {
    initialRouteName: "Home",
    navigationOptions: {
        ...HeaderStyles,
        animationEnabled: true
    }
});

export default Routes;