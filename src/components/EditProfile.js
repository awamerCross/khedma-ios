import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity, ActivityIndicator, Picker
} from 'react-native';
import {
    Container,
    Item,
    Input,
    Icon,
    Title,
    Button,
    Toast, Header, Left, Body, Right, Label, CheckBox, Form,
} from 'native-base'
import  * as Permissions from 'expo-permissions'
import  * as ImagePicker from 'expo-image-picker';
import  {connect} from "react-redux";
import  I18n from "ex-react-native-i18n";
import  axios from "axios";
// import  Spinner from "react-native-loading-spinner-overlay";
// import  {Bubbles} from "react-native-loader";
import  { profile ,updateProfile,logout ,tempAuth} from '../actions'
import  CONST from '../consts';
import  styles from '../../assets/style'
import Modal from "react-native-modal";
class   EditProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password     : '',
            cf_password  : '',
            phone        : '',
            countries    : [],
            codes        : [],
            key          : '',
            city_id      : '',
            cities       : [],
            country_id   : '',
            name         : '',
            spinner      : false,
            text         : '',
            pathname     : '',
            favourites   : [],
            image        : 'https://image.shutterstock.com/image-vector/default-avatar-profile-icon-grey-260nw-1545687068.jpg',
            img          : '',
            lang         : 'ar',
            // email        : '',

            nameCountry: I18n.t('choose_country'),
            modelCountry: false,

            nameCity: I18n.t('choose_city'),
            modelCity: false,

            nameCode: I18n.t('keyCountry'),
            modelCode: false,

            lodData : false

        };

        if(!this.props.user) {
            this.props.navigation.navigate('login');
        }
        this.setState({lang: this.props.lang});
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

        if (type === 'code'){
            this.setState({
                modelCode    : !this.state.modelCode
            });
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
            });

            this.setState({spinner: true});

            axios.post(`${CONST.url}cities`, {
                lang: this.props.lang,
                country_id:  id
            }).then((response) => {
                this.setState({cities: response.data.data});
            }).catch((error) => {
                this.setState({spinner: false});
            }).then(() => {
                this.setState({spinner: false});
            });

        }

        if (type === 'city'){
            this.setState({
                modelCity            : !this.state.modelCity,
                nameCity             : name,
                city_id              : id
            });
        }

        if (type === 'code'){
            this.setState({
                modelCode       : !this.state.modelCode,
                nameCode         : id,
                key             : id
            });
        }

    }

    componentWillReceiveProps(newProps){
            this.setState({
                isLoaded: false,spinner: false, lodData : false
            });
            if(newProps.Updated === 2) {
                if( JSON.stringify(this.props.user) !== JSON.stringify(newProps.user)){
                    if(newProps.result != null) {
                        if(newProps.result.value === '1') {
                            CONST.showToast(newProps.result.msg,  "success")
                            this.props.profile({  user_id: this.props.user.id,lang : this.props.lang  });
                            this.props.navigation.navigate('profile');
                        }else if(newProps.result.value === '2') {
                            CONST.showToast(newProps.result.msg,  "danger")
                            this.props.navigation.navigate('Confirmation_Page',{
                                user_id : this.props.user.id,
                                type : 'phone'
                            });
                        }else{
                            CONST.showToast(newProps.result.msg,  "danger")
                        }
                    }
                }
            }
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.phone.length <= 0 || this.state.phone.length < 9) {
            isError = true;
            msg = I18n.t('phoneValidation');
        }

        else if (this.state.name === '') {
            isError = true;
            msg = I18n.t('nameRequired');
        }
        else if(this.state.password.length > 0) {
            isError = true;
            if(this.state.password.length < 6)
            {   isError = true;
                msg = I18n.t('passwordRequired');

            }else if(this.state.password !== this.state.cf_password)
            {   isError = true;
                msg = I18n.t('cf_passwordRequired');
            }else{
                isError = false;
            }
        }
        if (msg !== ''){
            CONST.showToast(msg,  "danger")

            // Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    sendData() {

        const err = this.validate();

        if (!err && this.props.user){
            this.setState({isLoaded: true,spinner: true, lodData : true});
            const data = {
                lang      : this.props.lang ,
                user_id   : this.props.user.id,
                phone     : this.state.phone ,
                // email     : this.state.email ,
                avatar    : this.state.img,
                codes     : [],
                name      : this.state.name ,
                password  : this.state.password ,
                key       : this.state.key,
                country_id: this.state.country_id ,
                city_id   : this.state.city_id
            };

            this.props.updateProfile(data).then(()=> {
                this.props.navigation.navigate('profile');
                this.setState({isLoaded: false,spinner: false, lodData : false});
            }).catch(()=>{
                CONST.showToast(I18n.t('eerrr'),  "danger");
                this.setState({isLoaded: false,spinner: false, lodData : false});
            });
        }else {
            this.props.navigation.navigate('login');
            CONST.showToast(I18n.t('dsss'),  "danger")
        }

    }

    componentWillMount() {
        console.log('auth', this.props.auth)
        console.log('user', this.props.user)
       if(this.props.lang) { this.setState({lang:    this.props.lang}); }
        if(this.props.auth) {
            if(this.props.user)
            {
                this.setState({
                    image     :this.props.user.avatar,
                    phone     :this.props.user.mobile,
                    city_id   :this.props.user.city_id,
                    key       :this.props.user.key,
                    nameCode  :this.props.user.key,
                    country_id: this.props.user.country_id,
                    name      : this.props.user.name,
                    nameCountry: this.props.user.country,
                    nameCity: this.props.user.city,
                    // email      : this.props.user.email
                });

            }else{

                this.setState({
                    image     :this.props.auth.data.avatar,
                    phone     :this.props.auth.data.mobile,
                    city_id   :this.props.auth.data.city_id,
                    key       :this.props.auth.data.key,
                    nameCode  :this.props.user.key,
                    country_id: this.props.auth.data.country_id,
                    name      : this.props.auth.data.name,
                    nameCountry: this.props.auth.data.country,
                    nameCity: this.props.auth.data.city,
                    // email      : this.props.auth.data.email,
                });
                this.props.profile({ user_id: this.props.auth.data.id  });
            }

        }else{
            this.props.navigation.navigate('login');
        }

        this.setState({spinner: true});
          axios.post(`${CONST.url}countries`, { lang: this.props.lang  })
              .then( (response)=> {
                  this.setState({countries: response.data.data});
                  axios.post(`${CONST.url}cities`, { lang: this.props.lang , country_id: this.state.country_id })
                      .then( (response)=> {
                          this.setState({cities : response.data.data});
                          axios.post(`${CONST.url}codes`, { lang: this.props.lang })
                              .then( (response)=> {
                                  this.setState({codes:response.data.data})
                              }).then(()=>{
                              this.setState({spinner: false});
                          })

                      })
              });

          this.props.profile({  user_id: this.props.auth.data.id  });

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

    _pickImage      = async () => {
      await   Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      let result      = await ImagePicker.launchImageLibraryAsync({
      allowsEditing : true,
      base64        : true,
      aspect        : [4, 3],
    });
      this.setState({img: result.base64});
      if (!result.cancelled) {
          this.setState({ image: result.uri });
      }
  };

    changeFocusName(name)   { this.setState({name}) }

    render() {
    let { image } = this.state;
    return (
      <Container style={{ backgroundColor : '#e5e5e5' }}>

          <Header style={styles.Header_Up}>
              <Body style={[styles.body_header,styles.textHead]}>
                  <Title style={styles.headerTitle}>{I18n.translate('editAcc')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.navigate('profile')} >
                      <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                  </Button>
              </Right>
          </Header>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

              <View style={[ styles.marginVertical_20 ]}>
                  <View style={styles.imagePicker}>
                      <Button onPress={this._pickImage} style={styles.clickOpen}>
                          {this.state.image && <Image source={{ uri: image }} style={styles.imgePrive} />}
                      </Button>
                      <Button onPress={this._pickImage} style={[ styles.flexCenter, styles.width_90, styles.height_90, styles.borderGray, styles.Border, styles.Radius_50, styles.overlay_black, styles.position_A, styles.top_0, styles.right_0 ]}>
                          <Icon style={[ styles.textSize_24, styles.text_White ]} type="Entypo" name='image'/>
                      </Button>
                  </View>

                  <KeyboardAvoidingView behavior="padding" style={{ flex: 1}}>
                      <View style={[ styles.centerColum, styles.Width_80 ]}>
                          <View style={[styles.item, styles.borderRed , {flexDirection : 'row', borderWidth : 1}]} >
                              {/*<Icon style={[styles.icon_input , { top : 17 }]} active type="SimpleLineIcons" name='user' />*/}
                              {/*<Label style={styles.label}>{ I18n.translate('username')}</Label>*/}
                              <Input
                                  style={[styles.input, { paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                  value={ this.state.name}
                                  onChangeText={(name)=> this.changeFocusName(name)}
                                  placeholder={ I18n.translate('email')}
                              />
                          </View>

                          <View style={{flexDirection: 'row', width : '100%'}}>
                              <View style={[ styles.flex_60 ]}>
                                  <View style={[ styles.item, styles.borderRed,{borderWidth : 1} ]} >
                                      {/*<Icon style={styles.icon_input} active type="SimpleLineIcons" name='phone' />*/}
                                      {/*<Label style={styles.label}>{ I18n.translate('enterchoose')}</Label>*/}
                                      <Input
                                          value={ this.state.phone }
                                          placeholder={I18n.translate('enterchoose')}
                                          style={[styles.input, { paddingRight : 10, paddingLeft : 10, color : "#363636" }]}
                                          onChangeText={(phone) => this.setState({phone})}
                                          placeholderColor='#FFF'
                                          keyboardType={'number-pad'}
                                      />
                                  </View>
                              </View>
                              <View style={[ styles.flex_40 ]}>
                                  <TouchableOpacity onPress={() => this.toggleModal('code')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.Border, this.state.key !== null ? styles.borderRed : styles.borderGray, { paddingVertical : 15.5, marginTop : 10 }]}>
                                      <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                          { this.state.nameCode }
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


                          <Button onPress={!this.state.lodData ? () => this.sendData() : null} style={[ styles.bgLiner , { marginTop:  40 } ]}>
                              {
                                  this.state.lodData ?
                                      <ActivityIndicator size="large" color="#ffff" />
                                      :
                                      <Text style={styles.textBtn}>{I18n.translate('save')}</Text>
                              }
                          </Button>


                          <TouchableOpacity style={{marginVertical: 40}} onPress={()=> {this.props.navigation.navigate('chnage_password')}}>
                              <Text style={{fontFamily:'CairoRegular' , color : '#444' , fontSize : 16 , textAlign:'center'}}>{I18n.translate('chnage_password')}</Text>
                          </TouchableOpacity>
                      </View>
                  </KeyboardAvoidingView>

              </View>

        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, lang ,profile }) => {
    return {
         auth       : auth.user,
         lang       : lang.lang,
         user       : profile.user,
         result     : profile.result,
         userId     : profile.user_id,
         Updated     : profile.updated,
    };
};
export default connect(mapStateToProps, {profile,updateProfile,logout,tempAuth})(EditProfile);
