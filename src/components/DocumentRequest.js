import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity, ActivityIndicator
} from 'react-native';
import {
    Container,
    Item,
    Input,
    Icon,
    Title,
    Button, Header, Body, Right,Content
} from 'native-base'
import  * as Permissions from 'expo-permissions'
import  * as ImagePicker from 'expo-image-picker';
import  {connect} from "react-redux";
import  I18n from "ex-react-native-i18n";
import  axios from "axios";
import  CONST from '../consts';
import  styles from '../../assets/style'


class DocumentRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lang                    : this.props.lang,
            done                    : false,
            imageID                 : '',
            personalImage           : '',
            recordImage             : '',
            imageID64               : '',
            personalImage64         : '',
            recordImage64           : '',
        };
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.imageID64 === '') {
            isError = true;
            msg = I18n.translate('enimaID');
        }else if (this.state.personalImage64 === '') {
            isError = true;
            msg = I18n.translate('enimaPR');
        }

        if (msg !== ''){
            CONST.showToast(msg,"danger")
        }
        return isError;
    };


    sendData() {

        const err = this.validate();

        if (!err){

            this.setState({
                done : true
            });

            axios.post(`${CONST.url}documentationRequest`, {
                lang                    : this.state.lang,
                user_id                 : this.props.auth.data.id,
                id_image                : this.state.imageID64,
                personal_image          : this.state.personalImage64,
                record_image            : this.state.recordImage64,
            }).then( (response)=> {
                this.setState({
                    done : false
                });
                CONST.showToast(I18n.translate('donnne'),  "success");
                this.props.navigation.navigate('profile');
            }).catch( (error)=> {
                this.setState({
                    done : false
                });
                CONST.showToast(I18n.translate('eerrr'),  "danger");
            });
        }

    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            await   Permissions.askAsync(Permissions.CAMERA);
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async (type) => {

        await   Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result      = await ImagePicker.launchImageLibraryAsync({
            allowsEditing : true,
            base64        : true,
            aspect        : [4, 3],
        });

        if (type === 'imageID'){
            this.setState({
                imageID64               : result.base64,
            });
        }else if (type === 'personalImage'){
            this.setState({
                personalImage64         : result.base64,
            });
        }else if (type === 'recordImage'){
            this.setState({
                recordImage64           : result.base64,
            });
        }
        if (!result.cancelled) {

            if (type === 'imageID'){
                this.setState({
                    imageID               : result.uri,
                });
            }else if (type === 'personalImage'){
                this.setState({
                    personalImage         : result.uri,
                });
            }else if (type === 'recordImage'){
                this.setState({
                    recordImage           : result.uri,
                });
            }
        }
    };


    render() {
        return (
            <Container style={{ backgroundColor : '#e5e5e5' }}>

                <Header style={styles.Header_Up}>
                    <Body style={[styles.body_header,styles.textHead]}>
                        <Title style={styles.headerTitle}>
                            {I18n.translate('updon')}
                        </Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.navigate('profile')} >
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                </Header>

                <Content>

                    <View style={[ styles.Width_100 ]}>
                        <View style={[ styles.flexCenter, styles.Width_100, styles.paddingHorizontal_10 ]}>
                            <TouchableOpacity
                                onPress={() => this._pickImage('imageID')}
                                style={[ styles.Width_100, styles.height_150, styles.Border, styles.borderOpcityGray, styles.flexCenter, styles.marginVertical_10, styles.position_R ]}
                            >
                                <View style={[ styles.Width_100, styles.height_150, styles.flexCenter ]}>
                                    <Icon
                                        style={[ styles.textSize_24, styles.marginVertical_5, styles.text_red ]}
                                        active
                                        type="AntDesign"
                                        name='pluscircleo'
                                    />
                                    <Text style={[ styles.textSize_14, styles.text_light_gray, styles.textRegular ]}>
                                        {I18n.translate('imaID')}
                                    </Text>
                                </View>
                                <Image
                                    source={{ uri: this.state.imageID }}
                                    style={[ styles.Width_100, styles.height_150, styles.position_A, styles.top_0, styles.flexCenter, styles.Border, styles.borderOpcityGray ]}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[ styles.flexCenter, styles.Width_100, styles.paddingHorizontal_10 ]}>
                            <TouchableOpacity
                                onPress={() => this._pickImage('personalImage')}
                                style={[ styles.Width_100, styles.height_150, styles.Border, styles.borderOpcityGray, styles.flexCenter, styles.marginVertical_10, styles.position_R ]}
                            >
                                <View style={[ styles.Width_100, styles.height_150, styles.flexCenter ]}>
                                    <Icon
                                        style={[ styles.textSize_24, styles.marginVertical_5, styles.text_red ]}
                                        active
                                        type="AntDesign"
                                        name='pluscircleo'
                                    />
                                    <Text style={[ styles.textSize_14, styles.text_light_gray, styles.textRegular ]}>
                                        {I18n.translate('imaPR')}
                                    </Text>
                                </View>
                                <Image
                                    source={{ uri: this.state.personalImage }}
                                    style={[ styles.Width_100, styles.height_150, styles.position_A, styles.top_0, styles.flexCenter, styles.Border, styles.borderOpcityGray ]}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={[ styles.flexCenter, styles.Width_100, styles.paddingHorizontal_10 ]}>
                            <TouchableOpacity
                                onPress={() => this._pickImage('recordImage')}
                                style={[ styles.Width_100, styles.height_150, styles.Border, styles.borderOpcityGray, styles.flexCenter, styles.marginVertical_10, styles.position_R ]}
                            >
                                <View style={[ styles.Width_100, styles.height_150, styles.flexCenter ]}>
                                    <Icon
                                        style={[ styles.textSize_24, styles.marginVertical_5, styles.text_red ]}
                                        active
                                        type="AntDesign"
                                        name='pluscircleo'
                                    />
                                    <Text style={[ styles.textSize_14, styles.text_light_gray, styles.textRegular ]}>
                                        {I18n.translate('imag')}
                                    </Text>
                                </View>
                                <Image
                                    source={{ uri: this.state.recordImage }}
                                    style={[ styles.Width_100, styles.height_150, styles.position_A, styles.top_0, styles.flexCenter, styles.Border, styles.borderOpcityGray ]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                        <View style={[ styles.marginVertical_20 ]}>
                            {
                                this.state.done ?
                                    <ActivityIndicator size="large" color="#2171bc" />
                                    :
                                    <Button onPress={() => this.sendData()} style={styles.bgLiner}>

                                        <Text style={styles.textBtn}>
                                            {I18n.translate('sendButton')}
                                        </Text>

                                    </Button>
                            }
                        </View>


                </Content>

            </Container>
        );
    }
}

const mapStateToProps = ({ auth, lang ,profile }) => {
    return {
        auth       : auth.user,
        lang       : lang.lang,
        user       : profile.user,
    };
};
export default connect(mapStateToProps, {})(DocumentRequest);
