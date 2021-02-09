import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import {
    Container,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Title,
    Button,
    Header,
    Body,
    Right,
    Toast, Left, CheckBox
} from 'native-base'

import I18n from "ex-react-native-i18n";
// import {Bubbles} from "react-native-loader";
import axios from "axios";
// import Spinner from "react-native-loading-spinner-overlay";
import {connect} from "react-redux";
import {profile} from "../actions";
// const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import * as Animatable from "react-native-animatable";
import styles from '../../assets/style'
import Modal from "react-native-modal";

class ForgetPassword extends Component {


    constructor(props) {
        super(props);
        this.state = {
            lang       : 'ar',
            key       : '',
            phone     : '',
            isLoaded  : false,
            codes     : [],
            phoneStatus: 0,
            namCode: I18n.t('keyCountry'),
            modelCode: false,
        };
    }

    toggleModal (type) {

        if (type === 'code'){
            this.setState({
                modelCode    : !this.state.modelCode
            });
        }

    }

    selectId (type, id) {

        if (type === 'code'){
            this.setState({
                modelCode       : !this.state.modelCode,
                namCode        : id,
                key             : id
            });
        }

    }


    activeInput(type) {

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

    }

    componentWillMount() {

        this.setState({spinner: true});
        this.setState({lang: this.props.lang});
        axios.post(`${CONST.url}codes`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({codes: response.data.data});
                this.setState({key: response.data.data[0]});
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });


    }

    onValueChange(value) {
        this.setState({key : value});
    }

    onLoginPressed() {
        const err = this.validate();
        if (!err){
            this.setState({spinner: true,isLoaded: true});
            axios.post(`${CONST.url}forgetPassword`, { lang: this.props.lang , phone : this.state.phone, key : this.state.key })
                .then( (response)=> {
                    this.setAsyncStorage(response);
                }).catch( (error)=> {
                    this.setState({spinner: false,isLoaded: false});

            }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            });
            }
    }

    async setAsyncStorage(response){
        if(response.data.value === '1')
        {
            // Toast.show({ text: response.data.msg, duration : 2000 , type :"success",textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });

            CONST.showToast(response.data.msg,  "success")

            this.props.navigation.navigate('newpassword',{
                user_id  : response.data.user_id,
                key      : response.data.key,
                mobile   : response.data.mobile,
            });

        }else{
            CONST.showToast(response.data.msg,  "danger")

            // Toast.show({ text: response.data.msg, duration : 2000 , type :"danger",textStyle: { color: "white",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
        }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0) {
            isError = true;
            msg = I18n.t('phoneValidation');
        }
        if (msg != ''){
            CONST.showToast(msg,  "danger")

            // Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    renderSubmit() {

        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center', marginTop:70}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }


        return (

            <TouchableOpacity  onPress={() => this.onLoginPressed()} style={[ styles.flexCenter, styles.bg_blue2, styles.width_150, styles.height_50, styles.marginVertical_10 ]}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </TouchableOpacity>

        );
    }

  render() {
    return (
      <Container style={{ backgroundColor : '#e5e5e5' }}>

          <Header style={styles.Header_Up}>
              <Body style={[styles.body_header,styles.textHead]}>
                  <Title style={styles.headerTitle}>{I18n.translate('forgetPass')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                  </Button>
              </Right>
          </Header>

        {/*<Spinner visible={this.state.spinner}/>*/}
        <ScrollView contentContainerStyle={{ flexGrow: 1 , width : '100%'}}>

            <Form style={{marginHorizontal: 30  ,marginTop:  60}}>
                <View style={[styles.overHidden,{width : '100%'}]}>
                    <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                        <Image style={[styles.logo]} source={require('../../assets/lang.png')}/>
                    </Animatable.View>
                </View>
                <View style={{flexDirection: 'row', width : '100%'}}>
                    <View style={[ styles.flex_60 ]}>
                        <View style={[ styles.marginVertical_10 ]} >
                            {/*<Icon style={styles.icon_input} active type="SimpleLineIcons" name='phone' />*/}
                            {/*<Label style={styles.label}>{ I18n.translate('enterchoose')}</Label>*/}
                            <Input
                                placeholder={I18n.translate('phone')}
                                style={[styles.input, (this.state.phoneStatus === 1 ? styles.borderRed : styles.borderGray),{ paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                onChangeText={(phone) => this.setState({phone})}  value={ this.state.mobile }
                                placeholderColor='#FFF'
                                keyboardType={'number-pad'}
                                onBlur={() => this.unActiveInput('phone')}
                                onFocus={() => this.activeInput('phone')}
                            />
                        </View>
                    </View>
                    <View style={[ styles.flex_40 ]}>
                        <TouchableOpacity onPress={() => this.toggleModal('code')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.Border, this.state.key !== null ? styles.borderRed : styles.borderGray, { paddingVertical : 14.5, marginTop : 10 }]}>
                            <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                { this.state.namCode }
                            </Text>
                            <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                        </TouchableOpacity>
                    </View>
                </View>


                <Modal isVisible={this.state.modelCode} onBackdropPress={() => this.toggleModal('code')} style={[styles.bottomCenter, styles.Width_100]}>
                    <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}>

                        <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                            <ScrollView style={{ height: 300, width: '100%' }}>
                                <View>
                                    {
                                        this.state.codes.map((key, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={index.toString()}
                                                        style={[styles.rowGroup, styles.marginVertical_10]}
                                                        onPress={() => this.selectId('code', key)}
                                                    >
                                                        <View style={[styles.overHidden, styles.rowRight]}>
                                                            <CheckBox
                                                                style={[styles.checkBox, styles.bg_black, styles.borderBlack]}
                                                                color={styles.text_White}
                                                                selectedColor={styles.text_White}
                                                                checked={this.state.key === key}
                                                            />
                                                            <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                {key}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        )
                                    }
                                </View>
                            </ScrollView>
                        </View>

                    </View>
                </Modal>

                { this.renderSubmit() }
            </Form>


        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user
    };
};
export default connect(mapStateToProps, {profile})(ForgetPassword);



