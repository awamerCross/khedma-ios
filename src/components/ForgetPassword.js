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
    Picker,
    Header,
    Body,
     Right,
    Toast,Left
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
        };
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
                    <View style={[ styles.flex_75 ]}>
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
                    <View style={[ styles.flex_25 ]}>
                        <View style={[ styles.rowGroup , styles.position_R , { alignItems : 'center', paddingHorizontal : 0, borderWidth : 1, borderColor : this.state.key ? '#FB4516' : '#9E9B98' , borderLeftWidth : 0,top : 10, height : 50}]} regular>
                            <Picker
                                mode               ="dropdown"
                                style              ={{ color: '#9a9a9a',backgroundColor:'transparent' }} iosHeader={I18n.translate('keyCountry')}
                                headerBackButtonText={I18n.translate('goBack')}
                                selectedValue       ={this.state.key}
                                onValueChange      ={this.onValueChange.bind(this)} //ios
                                textStyle          ={{ color: "#363636", paddingLeft  : 5, paddingRight : 5, fontSize : 12, paddingTop : 8}}
                                itemTextStyle      ={{ color: '#363636' }}>
                                {
                                    this.state.codes.map((code, i) => {
                                        return <Picker.Item style={{color: "#363636"}}  key={i} value={code} label={code} />
                                    })
                                }
                            </Picker>
                            <Icon style={[ styles.position_A, {color: "#363636", fontSize:13, right : 5, top: 19} ]} name='down' type="AntDesign"/>
                        </View>
                    </View>
                </View>

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



