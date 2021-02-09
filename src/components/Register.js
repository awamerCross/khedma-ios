import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    AsyncStorage,
    Alert,
    View,
    Image,
    KeyboardAvoidingView,
    ActivityIndicator, TouchableOpacity, ScrollView
} from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Label,
    Icon,
    Title,
    Button,
    Toast,
    Body,
    Left,
    Right, Header, CheckBox
} from 'native-base'

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from "expo-constants";

import I18n from "ex-react-native-i18n";
import axios from "axios";
// import Spinner from "react-native-loading-spinner-overlay";
// import {Bubbles} from "react-native-loader";
import {connect} from "react-redux";
const  base_url = 'http://plus.4hoste.com/api/';
import CONST from '../consts';
import styles from '../../assets/style'
import * as Animatable from "react-native-animatable";
import Modal from "react-native-modal";

class Register extends Component {

    constructor(props) {
        super(props);

         this.state  = {
            en_message   : 'please complete all required data',
            ar_message   : 'برجآء تأكد من إدخال جميع البيانات',
            key : null,
            cities: [],
             codes: [],
            countries : [],
            is_password: false,
            cf_password:null ,
            is_email: false,
            email :'' ,
            spinner: false,
            phone : '',
            lang : this.props.lang,
            country_id: null,
            password : '',
             ePassword : '',
            city_id : null ,
            name : '' ,
            files : '',
            isLoaded : false,
            text: null,
            selected2   : undefined,
            image  : null,

             userNameStatus: 0,
             phoneStatus: 0,
             emailStatus: 0,
             passwordStatus: 0,
             ePasswordStatus: 0,

             nameCountry: I18n.t('choose_country'),
             modelCountry: false,

             nameCity: I18n.t('myCity'),
             modelCity: false,

         };
     }

    toggleModal (type) {

        if (type === 'country'){
            this.setState({
                modelCountry           : !this.state.modelCountry,
            });
        }

        if (type === 'city'){
            if (this.state.country_id === null){
                CONST.showToast(  I18n.t('encoutry'),   "danger")
            } else {
                this.setState({
                    modelCity               : !this.state.modelCity,
                });
            }
        }

    }

    selectId (type, id, name) {

        if (type === 'country'){
            this.setState({
                modelCountry            : !this.state.modelCountry,
                nameCountry             : name,
                country_id              : id,
                nameCity                : I18n.t('myCity'),
                city_id                 : null,
                cities                  : [],
                codes                   : [],
            });

            this.setState({spinner: true});

            axios.post(`${CONST.url}cities`, {
                lang: this.props.lang ,
                country_id: id
            }).then( (response)=> {
                    this.setState({cities: response.data.data});
                    axios.post(`${CONST.url}choose_codes`, {
                        lang: this.props.lang ,
                        country_id: this.state.country_id
                    }).then( (response)=> {
                            this.setState({key:response.data.data})
                        }).catch( (error)=> {
                            this.setState({spinner: false});
                        }).then(()=>{
                        this.setState({spinner: false});
                    }).then(()=>{
                        this.setState({spinner: false});
                    });

                }).catch( (error)=> {
                this.setState({spinner: false});
            })

        }

        if (type === 'city'){
            this.setState({
                modelCity            : !this.state.modelCity,
                nameCity             : name,
                city_id              : id
            });
        }

    }

    componentWillMount() {

       this.setState({spinner: true});
        axios.post(`${CONST.url}countries`, { lang: this.props.lang  })
          .then( (response)=> {
              this.setState({countries: response.data.data});

              axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
                  .then( (response)=> {

                      this.setState({cities: response.data.data});
                      this.setState({city_id: response.data.data[0].id});


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

                  }).catch( (error)=> {
                      this.setState({spinner: false});
                  }).then(()=>{
                  this.setState({spinner: false});
              });
          }).catch( (error)=> {
              this.setState({spinner: false});
          })

    }

    activeInput(type) {

        if (type === 'username' || this.state.name !== '') {
            this.setState({userNameStatus: 1})
        }

        if (type === 'phone' || this.state.phone !== '') {
            this.setState({phoneStatus: 1})
        }

        if (type === 'email' || this.state.email !== '') {
            this.setState({emailStatus: 1})
        }

        if (type === 'password' || this.state.password !== '') {
            this.setState({passwordStatus: 1})
        }

        if (type === 'ePassword' || this.state.ePassword !== '') {
            this.setState({ePasswordStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'username' && this.state.name === '') {
            this.setState({userNameStatus: 0})
        }

        if (type === 'phone' && this.state.phone === '') {
            this.setState({phoneStatus: 0})
        }

        if (type === 'email' && this.state.email === '') {
            this.setState({emailStatus: 0})
        }

        if (type === 'password' && this.state.password === '') {
            this.setState({passwordStatus: 0})
        }

        if (type === 'ePassword' && this.state.ePassword === '') {
            this.setState({ePasswordStatus: 0})
        }

    }

    componentDidMount() {
    this.getPermissionAsync();
  }

    getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

    _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64:      true,
      aspect: [4, 3],
    });

    this.setState({files: result.base64});

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

    validate = () => {
        let isError = false;
        let msg = '';

        if(this.state.name.length <= 0) {
            isError = true;
            msg = I18n.t('nameValidation');
        }else if (this.state.phone.length <= 0) {
            isError = true;
            msg = I18n.t('phoneRequired');
        }else if (this.state.phone.length < 9) {
            isError = true;
            msg = I18n.t('phoneValid');
        }else if (this.state.country_id == null) {
            isError = true;
            msg = I18n.t('encountry');
        }else if (this.state.city_id == null) {
            isError = true;
            msg = I18n.t('chooCity');
        } else if (this.state.password.length <= 0) {
            isError = true;
            msg = I18n.t('passwordRequired');
        } else if (this.state.ePassword.length <= 0) {
            isError = true;
            msg = I18n.t('verifyNewPass');
        } else if (this.state.password != this.state.ePassword) {
            isError = true;
            msg = I18n.t('cf_passwordRequired');
        }
        if (msg != ''){
            CONST.showToast(  msg,   "danger")

            // Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    sendData() {

            console.log('key --------', this.state.key);
            console.log('country_id ---------', this.state.country_id);
            console.log('city_id ---------', this.state.city_id);

        const err = this.validate();
        if (!err)
        {
            this.setState({isLoaded: true,spinner: true});
            axios.post(`${CONST.url}signUp`, {
                lang: this.props.lang ,
                phone : this.state.phone ,
                files :  this.state.files,
                name : this.state.name ,
                password : this.state.password ,
                key : this.state.key,
                country_id: this.state.country_id ,
                city_id : this.state.city_id
            })
                .then( (response)=> {
                    this.setAsyncStorage(response);
                }).catch( (error)=> {
                    this.setState({spinner: false,isLoaded: false});
                }).then(()=>{
                this.setState({spinner: false,isLoaded: false});

            }).then(()=>{
                this.setState({spinner: false, isLoaded: false});
            });
        }
    }

    renderLoader(){
        if (this.state.spinner){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color="#444" />
                </View>
            );
        }
    }

    async setAsyncStorage(response) {

        if(response.data.value === '1')
      {
          CONST.showToast(  response.data.msg,   "success")

           this.props.navigation.navigate('Confirmation',
                 {
                     phone: this.state.phone,
                     key : this.state.key,
                     password: this.state.password,
                     user_id :response.data.user_id,
                     code    : response.data.code
              });


      }else if(response.data.value === '2')
       {
           Alert.alert(
               `${I18n.currentLocale() === 'en' ? 'Sign In' : 'سجل دخول'}`,
               `${I18n.currentLocale() === 'en' ? 'User exists , Login Now ?' : 'هذا الحساب مسجل بالفعل ، تسجيل دخول ؟'}`,
               [
                   {
                       text: `${I18n.currentLocale() === 'en' ? 'Sign In' : 'سجل دخول'}`,
                       onPress: () => this.props.navigation.navigate('login')
                   },
                   {
                       text: `${I18n.currentLocale() === 'en' ? 'Cancel' : 'إلغاء'}`,
                       onPress: () => console.log('Cancel Pressed'),
                       style: 'cancel',
                   }
               ],
               {cancelable: false},
           );
       }else{
            CONST.showToast(  response.data.msg,   "danger")

            // Toast.show({ text: response.data.msg, duration : 2000  ,textStyle: { color: "yellow",fontFamily            : 'CairoRegular' ,textAlign:'center' } });
        }
    }

    renderSubmit() {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (

            <TouchableOpacity  onPress={() => this.sendData()} style={[ styles.flexCenter, styles.bg_blue2, styles.width_150, styles.height_50, styles.marginVertical_10 ]}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </TouchableOpacity>

        );
    }

  render() {
    let { image } = this.state;
    return (
      <Container style={{ backgroundColor : '#e5e5e5' }}>
          {this.renderLoader()}
          <Header style={[styles.Header_Up]}>
              <Body style={[styles.body_header,styles.textHead]}>
                  <Title style={styles.headerTitle}>{I18n.translate('signUP')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                  </Button>
              </Right>
          </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }}>

            <View style={[styles.overHidden,{width : '100%'}]}>
                <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                    <Image style={[styles.logo]} source={require('../../assets/logo.png')}/>
                </Animatable.View>
            </View>

            <TouchableOpacity onPress={this._pickImage} style={[ styles.width_100, styles.height_100, styles.Border, styles.borderGray, styles.flexCenter, styles.marginVertical_25, styles.position_R ]}>
              <View style={[ styles.width_100, styles.height_100, styles.flexCenter ]}>
                    <Icon style={[ styles.textSize_16, styles.marginVertical_5, styles.text_red ]} active type="AntDesign" name='pluscircleo' />
                    <Text style={[ styles.textSize_11, styles.text_light_gray, styles.textRegular ]}>{I18n.translate('pohot')}</Text>
                    <Text style={[ styles.textSize_9, styles.text_light_gray, styles.textRegular ]}>( {I18n.translate('choice')} )</Text>
              </View>
              {image && <Image source={{ uri: image }} style={[ styles.width_100, styles.height_100, styles.position_A, styles.top_0, styles.flexCenter ]} />}
            </TouchableOpacity>

            <View style={styles.bgDiv}>
                <KeyboardAvoidingView behavior="padding" style={{  flex: 1, width :'100%'}} >
                    <View style={{width :'100%'}}>
                        <View style={[ styles.marginVertical_10 ]}>
                            {/*<Icon style={styles.icon_input} active type="SimpleLineIcons" name='user' />*/}
                            {/*<Label style={styles.label}>{ I18n.translate('username')}</Label>*/}
                            <Input
                                placeholder={ I18n.translate('username')}
                                style={[styles.input, (this.state.userNameStatus === 1 ? styles.borderRed : styles.borderGray),{ paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                value={ this.state.name}
                                onChangeText={(name) => this.setState({name})}
                                onBlur={() => this.unActiveInput('username')}
                                onFocus={() => this.activeInput('username')}
                            />
                        </View>
                        <View style={[ styles.marginVertical_10 ]}>
                            {/*<Icon style={styles.icon_input} active type="SimpleLineIcons" name='phone' />*/}
                            {/*<Label style={styles.label}>{ I18n.translate('phone')}</Label>*/}
                            <Input
                                placeholder={ I18n.translate('phone')}
                                style={[styles.input, (this.state.phoneStatus === 1 ? styles.borderRed : styles.borderGray),{ paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                keyboardType={'number-pad'}
                                onChangeText={(phone) => this.setState({phone})}
                                value={ this.state.mobile }
                                onBlur={() => this.unActiveInput('phone')}
                                onFocus={() => this.activeInput('phone')}
                            />
                        </View>

                        <TouchableOpacity onPress={() => this.toggleModal('country')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.Border, this.state.country_id !== null ? styles.borderRed : styles.borderGray, { paddingVertical : 14.5, marginVertical : 10 }]}>
                            <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                { this.state.nameCountry }
                            </Text>
                            <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                        </TouchableOpacity>

                        <Modal isVisible={this.state.modelCountry} onBackdropPress={() => this.toggleModal('country')} style={[styles.bottomCenter, styles.Width_100]}>
                            <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}>

                                <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                                    <ScrollView style={{ height: 300, width: '100%' }}>
                                        <View>
                                            {
                                                this.state.countries.map((country, index) => {
                                                        return (
                                                            <TouchableOpacity
                                                                key={index.toString()}
                                                                style={[styles.rowGroup, styles.marginVertical_10]}
                                                                onPress={() => this.selectId('country', country.id, country.name)}
                                                            >
                                                                <View style={[styles.overHidden, styles.rowRight]}>
                                                                    <CheckBox
                                                                        style={[styles.checkBox, styles.bg_black, styles.borderBlack]}
                                                                        color={styles.text_White}
                                                                        selectedColor={styles.text_White}
                                                                        checked={this.state.country_id === country.id}
                                                                    />
                                                                    <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                        {country.name}
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

                        <TouchableOpacity onPress={() => this.toggleModal('city')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.Border, this.state.city_id !== null ? styles.borderRed : styles.borderGray, { paddingVertical : 14.5, marginVertical : 10 }]}>
                            <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                { this.state.nameCity }
                            </Text>
                            <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                        </TouchableOpacity>

                        <Modal isVisible={this.state.modelCity} onBackdropPress={() => this.toggleModal('city')} style={[styles.bottomCenter, styles.Width_100]}>
                            <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}>

                                <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                    {
                                        this.state.cities.length != 0 ?
                                            <ScrollView style={{ height: 300, width: '100%' }}>
                                                <View>
                                                    {
                                                        this.state.cities.map((city, index) => {
                                                                return (
                                                                    <TouchableOpacity
                                                                        key={index.toString()}
                                                                        style={[styles.rowGroup, styles.marginVertical_10]}
                                                                        onPress={() => this.selectId('city', city.id, city.name)}
                                                                    >
                                                                        <View style={[styles.overHidden, styles.rowRight]}>
                                                                            <CheckBox
                                                                                style={[styles.checkBox, styles.bg_black, styles.borderBlack]}
                                                                                color={styles.text_White}
                                                                                selectedColor={styles.text_White}
                                                                                checked={this.state.country_id === city.id}
                                                                            />
                                                                            <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                                {city.name}
                                                                            </Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </View>
                                            </ScrollView>
                                            :
                                            <View style={[ {height: 300}, styles.flexCenter]}>
                                                <Text style={[styles.textRegular, styles.textSize_18, styles.text_red]}>
                                                    { I18n.t('ff') }
                                                </Text>
                                            </View>
                                    }

                                </View>

                            </View>
                        </Modal>

                        <View style={[ styles.marginVertical_10 ]}>
                            {/*<Icon style={styles.icon_input} active type="Entypo" name='mail' />*/}
                            {/*<Label style={styles.label}>{ I18n.translate('email')}</Label>*/}
                            <Input
                                placeholder={ I18n.translate('password')}
                                secureTextEntry
                                style={[styles.input, (this.state.passwordStatus === 1 ? styles.borderRed : styles.borderGray),{ paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                onChangeText={(password) => this.setState({password})}
                                value={ this.state.password }
                                onBlur={() => this.unActiveInput('password')}
                                onFocus={() => this.activeInput('password')}
                            />
                        </View>

                        <View style={[ styles.marginVertical_10 ]}>
                            {/*<Icon style={styles.icon_input} active type="Entypo" name='mail' />*/}
                            {/*<Label style={styles.label}>{ I18n.translate('email')}</Label>*/}
                            <Input
                                placeholder={ I18n.translate('enPasss')}
                                secureTextEntry
                                style={[styles.input, (this.state.ePasswordStatus === 1 ? styles.borderRed : styles.borderGray),{ paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                onChangeText={(ePassword) => this.setState({ePassword})}
                                value={ this.state.ePassword }
                                onBlur={() => this.unActiveInput('ePassword')}
                                onFocus={() => this.activeInput('ePassword')}
                            />
                        </View>


                        { this.renderSubmit() }

                        <Text onPress={() => this.props.navigation.navigate('login')} style={[ styles.flexCenter, styles.text_red, styles.textRegular, styles.textSize_14, styles.marginVertical_10 ]}>{I18n.translate('have_account')}</Text>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Content>
      </Container>
    );
  }
}


const mapStateToProps = ({ lang}) => {

    return {

        lang   : lang.lang,

    };
};
export default connect(mapStateToProps,{})(Register);




