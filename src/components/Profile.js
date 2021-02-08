import React, { Component } from 'react';
import {StyleSheet, Text, View, I18nManager, Image, TouchableOpacity, ScrollView} from 'react-native';
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
    Left,
    Body,
    Right,
    Header,
    Toast
} from 'native-base'


import { LinearGradient } from 'expo';
import {connect} from "react-redux";
import I18n from "ex-react-native-i18n";
import {profile} from "../actions";
import {NavigationEvents} from "react-navigation";
import styles from '../../assets/style'
import Modal from "react-native-modal";
import axios from "axios";
import CONST from "../consts";

class Profile extends Component {


  constructor(props) {
    super(props);

      this.state = {
        avatar : '',
        phone  :'',
        country  :'',
        city  :'',
        name  :'',
        email : '',
        modalEmail : false,
        textErr : '',
        emailUser : '',
        activated : '',
    };
   }


    onFocus(){
      this.componentWillMount()
    }

    async componentWillMount() {
      if(this.props.auth) {
          this.props.profile({  user_id: this.props.auth.data.id ,lang :this.props.lang });

              this.setState({
                  avatar:this.props.user.avatar,
                  phone:this.props.user.phone,
                  city:this.props.user.city,
                  country: this.props.user.country,
                  name: this.props.user.name,
                  email: this.props.user.email,
                  emailUser: this.props.user.email,
                  activated: this.props.user.activated,
              });

      }else{
          this.props.navigation.navigate('login');
          CONST.showToast(I18n.t('dsss'),  "danger")
      }

    }

    modalEmail(){
      this.setState({ modalEmail : true })
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.emailUser.length <= 0 || this.state.emailUser.indexOf("@") === -1 || this.state.emailUser.indexOf(".") === -1){
            isError = true;
            msg = I18n.t('emailNotCorrect');
        }

        if (msg !== ''){
            this.setState({ textErr : msg })
        }

        return isError;
    };

    sendData() {

        const err = this.validate();
        if (!err){

            this.setState({isLoaded: true,spinner: true});

            axios.post(`${CONST.url}updateEmail`, {
                email      :  this.state.emailUser,
                user_id    : this.props.user.id,
            }).then( (response)=> {

                if(response.data.value === '2' )
                {
                    CONST.showToast( response.data.msg,   (response.data.value === '1' || response.data.value === '2') ? "success" : "danger")

                    // Toast.show({
                    //     text: response.data.msg,
                    //     duration : 2000,
                    //     type : (response.data.value === '1' || response.data.value === '2') ? "success" : "danger",
                    //     textStyle: {
                    //         color: "white",
                    //         fontFamily : 'CairoRegular' ,
                    //         textAlign:'center'
                    //     }
                    // });

                    this.props.navigation.navigate('Confirmation_Page',{
                        user_id : this.props.user.id,
                        type : 'email'
                    });
                }

                this.setState({ modalEmail : false })

            }).catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=> {
                this.setState({spinner: false});
            });
        }

    }

    componentWillReceiveProps(newProps) {
        if( JSON.stringify(this.props.user) !== JSON.stringify(newProps.user))      {
            if(this.props.user !== null && this.props.user !== undefined)
            {
                if(newProps.user !== null && newProps.user !== undefined && newProps.user !== this.props.user)
                {
                    this.setState({
                        avatar:newProps.user.avatar,
                        phone:newProps.user.phone,
                        city:newProps.user.city,
                        country: newProps.user.country,
                        name: newProps.user.name,
                        email: newProps.user.email
                    });
                }
            }
      }
    }

  render() {
    return (
      <Container style={{ backgroundColor : '#e5e5e5' }}>

          <Header style={styles.Header_Up}>
              <Body style={[styles.body_header,styles.textHead]}>
                  <Title style={styles.headerTitle}>{I18n.translate('profile')}</Title>
              </Body>
              <Right style={[ styles.RightDir ]}>
                  <Button transparent onPress={()=> this.props.navigation.navigate('mune')} >
                      <Icon style={styles.icons} type="Ionicons" name='ios-arrow-back' />
                  </Button>
              </Right>
          </Header>

        <Content>
            <NavigationEvents onWillFocus={() => this.onFocus()} />
            <View style={styles.imagePicker}>
                <Image style={styles.imgePrive} source={{uri:this.state.avatar}}/>
            </View>

            <View style={[ styles.rowCenter ]}>
                {

                    this.state.activated == 1 ?
                        <Image style={{ width : 23, height: 23, marginHorizontal : 5 }} resizemode={'contain'} source={require('../../assets/medal.png')}/>
                        :
                        <View/>
                }
                <Title style={styles.textUser}>{this.state.name }</Title>
            </View>

            {

                this.state.activated == 0 ?
                    <TouchableOpacity onPress={() =>this.props.navigation.navigate('DocumentRequest')} style={[ styles.flexCenter ]}>
                        <Text style={[ styles.textCenter, styles.text_red, styles.textSize_14, styles.textDecoration, styles.marginVertical_10, styles.textRegular ]}>
                            {I18n.translate('updon')}
                        </Text>
                    </TouchableOpacity>
                    :
                    <View/>
            }

            <View style={styles.bgDiv}>
                  <View style={styles.item_pro}>
                    <Icon style={[ styles.position_A, styles.left_10, styles.textSize_14, styles.text_gray, styles.top_15 ]} active type="SimpleLineIcons" name='phone' />
                    <Text style={[ styles.textRegular , styles.textSize_14 , styles.text_black, ]}>{ this.state.phone }</Text>
                  </View>
                    {/*<View style={styles.item_pro}>*/}
                    {/*    <Icon style={[ styles.position_A, styles.left_10, styles.textSize_14, styles.text_gray, styles.top_15 ]} active type="Entypo" name='mail' />*/}
                    {/*    <Text style={[ styles.textRegular , styles.textSize_14 , styles.text_black, ]}>{ this.state.email }</Text>*/}
                    {/*</View>*/}
                  <View style={styles.item_pro}>
                    <Icon style={[ styles.position_A, styles.left_10, styles.textSize_14, styles.text_gray, styles.top_15 ]} active type="Feather" name='map-pin' />
                    <Text style={[ styles.textRegular , styles.textSize_14 , styles.text_black, ]}>{this.state.country }</Text>
                  </View>
                  <View style={styles.item_pro}>
                    <Icon style={[ styles.position_A, styles.left_10, styles.textSize_14, styles.text_gray, styles.top_15 ]} active type="Feather" name='map-pin' />
                    <Text style={[ styles.textRegular , styles.textSize_14 , styles.text_black, ]}>{ this.state.city }</Text>
                  </View>
                <Button  onPress={() =>this.props.navigation.navigate('editprofile')} style={styles.bgLiner}>
                    <Text style={styles.textBtn}>{I18n.translate('editAcc')}</Text>
                </Button>
                {/*<Button onPress={() => this.modalEmail()} style={styles.bgLiner}>*/}
                {/*    <Text style={styles.textBtn}>{I18n.translate('editemail')}</Text>*/}
                {/*</Button>*/}
            </View>


            <Modal avoidKeyboard={true} onBackdropPress={() => this.setState({ modalEmail: false })} isVisible={this.state.modalEmail}>
                <View style={styles.model}>
                    <View style={[styles.commenter , styles.Width_100]}>

                        <Text style={[styles.TiTle, { textAlign: 'center', alignSelf : 'center', marginTop : 20 }]}>{I18n.translate('editemail')}</Text>

                        <View style={[styles.marginHorizontal_10,styles.height_50, styles.Border, styles.borderGray, styles.marginVertical_25]}>
                            {/*<Icon style={[styles.icon_input , { top : 17 }]} active type="Entypo" name='mail' />*/}
                            <Input
                                style={[styles.input, { paddingRight : 10, paddingLeft : 10 } ]}
                                onChangeText={(emailUser) => this.setState({emailUser})}
                                value={ this.state.emailUser }
                                placeholder={ I18n.translate('email')}
                            />
                        </View>


                        <Text style={[ styles.textSize_14, styles.textRegular, styles.textCenter, styles.text_red ]}>
                            {this.state.textErr}
                        </Text>

                        <Button onPress={() => this.sendData()} style={styles.bgLiner}>
                            <Text style={styles.textBtn}>
                                {I18n.translate('edit')}
                            </Text>
                        </Button>
                    </View>
                </View>
            </Modal>

        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, lang ,profile }) => {

    return {
        auth      : auth.user,
        lang      : lang.lang,
        user      : profile.user,
        Updated   : profile.updated,
    };
};
export default connect(mapStateToProps, {profile})(Profile);



