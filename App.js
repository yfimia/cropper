import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, NativeModules, Image, TouchableOpacity, SafeAreaView, ActionSheetIOS } from 'react-native';
import { Row, Col, ActionSheet, Root } from 'native-base'
//import ImageResizer from 'react-native-image-resizer';
var ImageResizer = NativeModules.ImageResizer;
var ImagePicker = NativeModules.ImageCropPicker;

const PHOTO_SIZE_LARGE = 170;
const PHOTO_SIZE_MEDIUM = 100;
const PHOTO_SIZE_SMALL = 70;

type Props = {};
export default class App extends Component<Props> {

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectecPicture: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",

            largeUri: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",
            mediumUri: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",
            smallUri: "https://i.pinimg.com/474x/52/fe/c5/52fec54732ea8fa383f614f447aec4ac--avatar-james-cameron-blue-avatar.jpg",
        }

    }

    optionDispatcherIOS(option) {
        switch (option) {
            case 1:
                this.loadImageFromLibrary()

                break;
            case 2:
                this.takeAPictureFromCamera()
                break;

        }
    }

    optionDispatcherAndroid(option) {
        switch (option) {
            case 1:
                this.takeAPictureFromCamera()
                break;
            case 2:
                this.loadImageFromLibrary()
                break;

        }
    }

    resize(uri, pathLarge, pathMedium, pathSmall) {
        debugger
        console.log("Resizing: ", uri)
         ImageResizer.createResizedImage(uri, PHOTO_SIZE_LARGE, PHOTO_SIZE_LARGE, 'JPEG', 100, 0, pathLarge)
            .then((resp) => {
                console.log("Resized: ", resp)
                this.setState({
                    largeUri: resp.uri,
                });
            })
            .catch(err => {
                console.log(err);
                // return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
            });

        //  ImageResizer.createResizedImage(uri, PHOTO_SIZE_MEDIUM, PHOTO_SIZE_MEDIUM, 'JPEG', 100, 0, pathMedium)
        //     .then(({ uri }) => {
        //         this.setState({
        //             mediumUri: uri,
        //         });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         // return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
        //     });

        //  ImageResizer.createResizedImage(uri, PHOTO_SIZE_SMALL, PHOTO_SIZE_SMALL, 'JPEG', 100, 0, pathSmall)
        //     .then(({ uri }) => {
        //         this.setState({
        //             smallUri: uri,
        //         });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         // return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
        //     });

    }

    loadImage() {

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Take a Photo', 'Choose from Library', 'Cancel'],
                    destructiveButtonIndex: -1,
                    cancelButtonIndex: 0,
                    title: "Choose a Photo"
                },
                (buttonIndex) => this.optionDispatcherIOS(buttonIndex)
            )
        }
        else {
            ActionSheet.show(
                {
                    options: ['Cancel', 'Take a Photo', 'Choose from Library'],
                    destructiveButtonIndex: -1,
                    cancelButtonIndex: 0,
                    title: "Choose a Photo"
                },
                (buttonIndex) => this.optionDispatcherAndroid(buttonIndex),
            );


        }

    }

    loadImageFromLibrary() {
        ImagePicker.openPicker({
            width: 600,
            height: 600,
            //cropping: true
            cropping: true,
            cropperCircleOverlay: true,
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 600,
            compressImageQuality: 1,
            includeExif: false
        }).then(image => {
            console.log(image);
            this.resize(`file://${image.path}`, `${image.path}_large`, `${image.path}_medium`, `${image.path}_small`)
            this.setState({ selectecPicture: `file://${image.path}` })
        });
    }

    takeAPictureFromCamera() {
        ImagePicker.openCamera({
            width: 600,
            height: 600,
            //cropping: true
            cropping: true,
            cropperCircleOverlay: true,
            compressImageMaxWidth: 600,
            compressImageMaxHeight: 600,
            compressImageQuality: 1,
            includeExif: false
        }).then(image => {
            console.log(image);
            this.setState({ selectecPicture: `file://${image.path}` })
        });
    }

    render() {
        return (

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Root>

                        <Row style={styles.imagePickerRow}>
                            <Col style={styles.pickerCol}>
                                <Text style={styles.selectPictureText}>Select Picture</Text>
                                <TouchableOpacity onPress={() => { this.loadImage() }}>
                                    <Image
                                        style={styles.pickerImg}
                                        resizeMode='cover'
                                        source={{ uri: this.state.selectecPicture }}
                                    />
                                </TouchableOpacity>

                            </Col>
                        </Row>

                        <Row style={styles.previewRow}>
                            <Col style={styles.previewLargeCol}>
                                <Image
                                    style={styles.largeAvatarImg}
                                    resizeMode='cover'
                                    source={{ uri: this.state.largeUri }}
                                />
                            </Col>
                            <Col style={styles.previewMediumCol}>
                                <Image
                                    style={styles.mediumAvatarImg}
                                    resizeMode='cover'
                                    source={{ uri: this.state.mediumUri }}
                                />
                            </Col>
                            <Col style={styles.previewSmallCol}>
                                <Image
                                    style={styles.smallAvatarImg}
                                    resizeMode='cover'
                                    source={{ uri: this.state.smallUri }}
                                />
                            </Col>
                        </Row>
                    </Root>
                </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imagePickerRow: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: 380,
    },
    pickerCol: {
        margin: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#FF0000',
    },
    pickerImg: {
        paddingVertical: 0,
        width: 250,
        height: 250,
        borderRadius: 0
    },
    selectPictureText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

    previewRow: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: PHOTO_SIZE_LARGE,
    },

    previewLargeCol: {
        // backgroundColor: '#FF0000',
        width: PHOTO_SIZE_LARGE,
        margin: 3
    },

    previewMediumCol: {
        // backgroundColor: '#00FF00',
        width: PHOTO_SIZE_MEDIUM,
        margin: 3
    },

    previewSmallCol: {
        // backgroundColor: '#0000FF',
        width: PHOTO_SIZE_SMALL,
        margin: 3
    },

    largeAvatarImg: {
        height: PHOTO_SIZE_LARGE,
        width: PHOTO_SIZE_LARGE,
        // borderColor: '#000000',
        // borderWidth: 1,
        borderRadius: PHOTO_SIZE_LARGE / 2
    },
    mediumAvatarImg: {
        height: PHOTO_SIZE_MEDIUM,
        width: PHOTO_SIZE_MEDIUM,
        // borderColor: '#000000',
        // borderWidth: 1,
        borderRadius: PHOTO_SIZE_MEDIUM / 2
    },
    smallAvatarImg: {
        height: PHOTO_SIZE_SMALL,
        width: PHOTO_SIZE_SMALL,
        // borderColor: '#000000',
        // borderWidth: 1,
        borderRadius: PHOTO_SIZE_SMALL / 2
    },







});
