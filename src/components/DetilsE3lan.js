import React, { Component } from 'react';
import {
    Platform,
    Text,
    Image,
    View,
    Dimensions,
    Linking,
    ScrollView,
    Share,
    TouchableOpacity, Animated, I18nManager, ActivityIndicator
} from 'react-native';
import {
    Container,
    Content,
    Button,
    Icon,
    Title,
    Header,
    Left,
    Body,
    Right,
    Input,
    Item,
    Toast,
    CheckBox, Textarea
} from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av'
 import Modal from "react-native-modal";
import axios from "axios";
import {NavigationEvents} from "react-navigation";
import I18n from "ex-react-native-i18n";
import CONST from '../consts';
import StarRating from 'react-native-star-rating';
const width = Dimensions.get('window').width;
import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
import HTML from "react-native-render-html";
import styles from '../../assets/style'
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

class DetilsE3lan extends Component {

    constructor(props) {
    super(props);
    this.state = {
        blog         : '',
        comment      : '',
        lang         : this.props.lang,
        is_favourite : 0,
        images       : [],
        spinner      :  false,
        comments     : [],
        all_comments : [],
        results      : [],
        arrReport      : [],
        user_id      : null,
        isImageViewVisible: false,
        is_video     : false,
        user_provider  : '',
        rate:0.0,
        name:'',
        currency:'',
        avatar:'',
        id:'',
        region: {
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            latitude: null,
            longitude: null
        },
        selected2: undefined,
        showSwiper    : true,
        isModalVisible    : false,
        commentModal      : false,
        addComment        : false,
        type : null,
        model_car : '',
        show_model : null,
        reportModal  : false,
        reportId          : null,
        repBlogId          : null,
        blogId          : null,
        nameReason          : '',
        loadItem          : false,
        infoReason          : '',
    };

  }

    onShare = async () => {
        try {
            const result = await Share.share({
                title: this.state.blog.title,
                message: this.state.blog.url,
                // url: this.state.blog.url,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {

        }
    };

    favourite() {

        if(this.props.auth){
            this.setState({spinner: true});
            axios.post(`${CONST.url}favouriteBlog`, {
                lang      : this.props.lang ,
                id        : this.props.navigation.state.params.blog_id ,
                user_id   : this.state.user_id
            })
                .then( (response)=> {
                    // Toast.show({
                    //     text          : response.data.msg,
                    //     // duration      : 2000,
                    //     position:'top',
                    //     type          : "success",
                    //     textStyle     : {
                    //         color         : "white",
                    //         fontFamily    : 'CairoRegular' ,
                    //         textAlign     : 'center'
                    //     }
                    // });
                     CONST.showToast( response.data.msg ,'success')
                    this.setState({
                        is_favourite: response.data.fav,
                        spinner: false
                    });

                })
                .catch( (error)=> {
                     this.setState({spinner: false});
                })
        }else{
            this.props.navigation.navigate('login');
        }

    }

    componentWillMount() {

        this.runPlaceHolder();

        if(this.props.auth !== null) {
            this.setState({user_id  : this.props.auth.data.id})
        }

        this.setState({spinner: true});
        axios.post(`${CONST.url}BlogDetails`, {
            lang        : this.props.lang ,
            id          : this.props.navigation.state.params.blog_id  ,
            user_id     : this.state.user_id
        })
            .then( (response)=> {
                if(response.data.value === '0')
                {
                     this.props.navigation.navigate('home')
                }else{

                    this.setState({
                        blog                : response.data.data,
                        rate                : response.data.data.user.rate,
                        name                : response.data.data.user.name,
                        currency            : response.data.data.currency,
                        avatar              : response.data.data.user.avatar,
                        id                  : response.data.data.user.id,
                        user_provider       : response.data.data.user,
                        images              : response.data.data.images,
                        is_location         : response.data.data.is_location,
                        model_car           : response.data.data.model,
                        show_model          : response.data.data.show_model,
                        results             : response.data.data.results,
                        is_favourite        : response.data.data.is_fav,
                        comments            : response.data.data.comments.slice(Math.max(response.data.data.comments.length - 2 )),
                        all_comments        : response.data.data.comments,
                        region              : {
                            latitude        : response.data.data.latitude,
                            longitude       : response.data.data.longitude,
                            latitudeDelta   : 0.0922,
                            longitudeDelta  : 0.0421,
                        }
                    });
                }

            })
            .catch( (error)=> {
                console.warn(error);
                this.setState({spinner: false});
            }) .then( ()=> {
            this.setState({spinner: false});
        })
    }

    onFocus(){
        this.componentWillMount()
    }

    CommentBlog() {
        if(this.state.comment === '') {
            // Toast.show({
            //     text            : (this.props.lang === 'en') ? 'Leave suitable comment' : 'اترك تعليق مناسب',
            //     duration        : 2000  ,
            //     type            : "danger",
            //     textStyle           : {
            //         color               : "white",
            //         fontFamily          : 'CairoRegular' ,
            //         textAlign           : 'center'
            //     }
            // });
            CONST.showToast((this.props.lang === 'en') ? 'Leave suitable comment' : 'اترك تعليق مناسب','danger')

        }else{

            this.setState({spinner: true});
            axios.post(`${CONST.url}CommentBlog`, {
                lang: this.props.lang ,
                comment: this.state.comment,
                blog_id : this.props.navigation.state.params.blog_id ,
                user_id : this.state.user_id
            })
            .then( (response)=> {
                this.setState({comment: '', spinner: false});
                this.state.comments.push(response.data.data);
                this.state.all_comments.push(response.data.data);
                setTimeout(() => {this.setState({commentModal: false})}, 1000)
                // Toast.show({
                //     text            : (this.props.lang === 'en') ? 'Commented successfully' : 'تم التعليق بنجاح',
                //     duration        : 2000  ,
                //     type            : "success",
                //     textStyle           : {
                //         color               : "white",
                //         fontFamily          : 'CairoRegular' ,
                //         textAlign           : 'center'
                //     }
                // });
                CONST.showToast((this.props.lang === 'en') ? 'Commented successfully' : 'تم التعليق بنجاح','success')


            })
            .catch( (error)=> {
                this.setState({spinner: false});
            })

        }

    }

    commentModal(type){

        if (type === 1){
            this.setState({ commentModal: true })
        }else if(type === 2){
            this.setState({ commentModal: true, addComment: false  });
        }else{
            this.setState({ commentModal: false, addComment: true  })
        }

    }

    delete(id , i) {
        this.setState({spinner: true});
        axios.post(`${CONST.url}delete_comment`, { lang: this.props.lang ,id: id })
            .then( (response)=> {

                if(response.data.value === '1') {
                    this.state.all_comments.splice(i,1);
                    this.state.comments.splice(i,1);
                    // Toast.show({ text: response.data.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                    CONST.showToast(response.data.msg,'danger')
                }else{
                    CONST.showToast(response.data.msg,'success')
                    // Toast.show({ text: response.data.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                }

                this.setState({spinner: false});
            })

    }

    _renderRows(loadingAnimated, numberRow, uniqueKey) {
        let shimmerRows = [];
        for (let index = 0; index < numberRow; index++) {
            shimmerRows.push(
                <ShimmerPlaceHolder
                    key={`loading-${index}-${uniqueKey}`}
                    ref={(ref) => loadingAnimated.push(ref)}
                    style={{marginVertical: 7, alignSelf: 'center'}}
                    width={width - 20}
                    height={100}
                    colorShimmer={['#ffffff75', '#f2f0ff', '#ffffff75']}
                />
            )
        }
        return (
            <View>
                {shimmerRows}
            </View>
        )
    }

    runPlaceHolder() {
        if (Array.isArray(this.loadingAnimated) && this.loadingAnimated.length > 0) {
            Animated.parallel(
                this.loadingAnimated.map(animate => {
                    if (animate&&animate.getAnimated) {
                        return animate.getAnimated();
                    }
                    return null;
                }),
                {
                    stopTogether: false,
                }
            ).start(() => {
                this.runPlaceHolder();
            })
        }
    }

    openMap(lat,lng){
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios   : `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    reportModalFun(id, name) {

        if (this.state.commentModal){
            this.setState({
                commentModal : false
            })
        }
        setTimeout( () => {
            this.setState({ reportModal: !this.state.reportModal});
        }, 1000);
        if (name === 'reportComment'){
            this.setState({
                arrReport       : [
                    {
                        id : 1,
                        reason : 'تعليق غير لائق'
                    },
                    {
                        id : 2,
                        reason : 'بخس السلعة'
                    },
                    {
                        id : 3,
                        reason : 'يحتوي علي الفاظ خارجة'
                    },
                    {
                        id : 4,
                        reason : 'إستهزاء'
                    },
                    {
                        id : 5,
                        reason : 'تعليق لا علاقة له بالإعلان'
                    },
                ],
                commentId       : id,
                nameReason      : name
            });
        } else if (name === 'reportAdv') {
            this.setState({
                arrReport       : [
                    {
                        id : 1,
                        reason : 'سلعة مزيفة'
                    },
                    {
                        id : 2,
                        reason : 'المعلن غير جاد'
                    },
                    {
                        id : 3,
                        reason : 'غير حقيقي'
                    },
                    {
                        id : 4,
                        reason : 'بخس السلعة'
                    },
                    {
                        id : 5,
                        reason : 'يحتوي علي الفاظ خارجة'
                    },
                ],
                nameReason      : name
            });
        }
    };

    selectReportId(id, name) {
        this.setState({reportId : id, infoReason : name});
    }

    onSentReport (){
        this.setState({loadItem: true});

        if (this.state.nameReason === 'reportComment'){

            axios.post(`${CONST.url}reportComment`, {
                comment_id      : this.state.commentId,
                lang            : this.state.lang ,
                blog_id         : this.props.navigation.state.params.blog_id,
                user_id         : this.state.user_id,
                reason          : this.state.infoReason,
            }).then( (response)=> {
                this.setState({
                    reportId : null,
                    loadItem : false,
                    reportModal: !this.state.reportModal
                });
                Toast.show({
                    text: response.data.msg,
                    type: response.data.status  !== 0 ? "success" : "danger",
                    duration: 3000,
                    textStyle: {
                        color: "white",
                        fontFamily: 'CairoRegular',
                        textAlign: 'center',
                    }
                });
            }).catch( (error)=> {
                this.setState({loadItem: false});
            });

        } else if (this.state.nameReason === 'reportAdv'){

            axios.post(`${CONST.url}report`, {
                lang            : this.state.lang ,
                blog_id         : this.props.navigation.state.params.blog_id,
                user_id         : this.state.user_id,
                reason          : this.state.infoReason,
            }).then( (response)=> {
                this.setState({
                    reportId : null,
                    loadItem : false,
                    reportModal: !this.state.reportModal
                });
                Toast.show({
                    text: response.data.msg,
                    type: response.data.status  !== 0 ? "success" : "danger",
                    duration: 3000,
                    textStyle: {
                        color: "white",
                        fontFamily: 'CairoRegular',
                        textAlign: 'center',
                    }
                });
            }).catch( (error)=> {
                this.setState({loadItem: false});
            });

        }

    }

    render() {

        const { width } = Dimensions.get('window');
        this.loadingAnimated = [];

      return (

      <Container style={{ backgroundColor : '#e5e5e5' }}>
          <Header style={styles.Header_Up}>
              <Left style={[styles.LeftDir,styles.flex]}>
                  <Button  transparent onPress={()=> this.onShare()} >
                      <Icon style={{color : '#fff',fontSize:22}} type="EvilIcons"  name="share-google"/>
                  </Button>
              </Left>
              <Body style={[styles.body_header,styles.flex]}>
                  <Title style={styles.headerTitle}>{I18n.translate('productDet')}</Title>
              </Body>
              <Right style={[ styles.RightDir ,styles.flex]}>
                  <Button transparent onPress={()=> this.props.navigation.goBack()} >
                      <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                  </Button>
              </Right>
          </Header>
                  <Content>
                      <View>
                      <NavigationEvents onWillFocus={() => this.onFocus()}/>
                          {  this.state.spinner ?
                              this._renderRows(this.loadingAnimated, 5, '5rows'):
                      <View style={[styles.block_slider, {marginVertical: 0, marginTop : 10}]}>
                          <View style={[styles.position_A, styles.overlay_black, styles.bottom_0, styles.Width_100, styles.rowGroups, styles.paddingVertical_5, styles.paddingHorizontal_5]}>
                              {
                                  (this.state.blog.user_id !== this.state.user_id) ?
                                      <TouchableOpacity onPress={() => {this.props.navigation.navigate('UserDetailes', {user_id: this.state.id})}} style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Image source={{uri: this.state.avatar}} style={{width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: '#DDD', marginHorizontal: 5}} resizeMode='cover'/>
                                          <Text style={{fontSize: 13, fontFamily: 'CairoBold', color: "#FFF"}}>{this.state.name}</Text>
                                      </TouchableOpacity>
                                      :
                                      <View/>
                              }
                              <Text style={[ styles.textRegular, styles.text_White, styles.textSize_14]}>
                                  {this.state.blog.price} {this.state.currency}
                              </Text>
                          </View>
                          {
                              this.state.blog.user_id !== this.state.user_id ?
                                  <TouchableOpacity
                                      style={[ styles.bg_black, styles.width_30, styles.height_30, styles.flexCenter, styles.position_A, styles.right_0, styles.top_0 ]}
                                      onPress={() => this.reportModalFun(this.props.navigation.state.params.blog_id , 'reportAdv')}
                                  >
                                      <Icon  style={styles.report} type="FontAwesome" name='flag' />
                                  </TouchableOpacity>
                                  :
                                  <View/>
                          }
                          <Swiper containerStyle={styles.wrapper} autoplay={true}>
                              {
                                  this.state.images.map((slider, i) => {
                                      return (
                                          <View key={i}>
                                              <TouchableOpacity onPress={() => {this.setState({isImageViewVisible: true})}}>
                                                  <Image style={styles.slide} source={{uri: slider.url}}/>
                                              </TouchableOpacity>
                                          </View>
                                      )
                                  })
                              }
                          </Swiper>
                      </View>}

                          {
                          this.state.spinner ?

                              this._renderRows(this.loadingAnimated, 5, '5rows'):

                      <View style={[styles.rowCenter , styles.paddingVertical_5 ,{ backgroundColor : '#F7F7F7',width : '95%' }]}>
                          <View style={[ styles.flex_25, styles.flexCenter, styles.paddingHorizontal_10, styles.paddingVertical_5, { borderLeftColor : '#ebebeb', borderRightWidth : 1 } ]}>
                              <TouchableOpacity
                                  style={[styles.position_R, styles.padding_0, styles.margin_0,]}
                                  onPress={() => this.favourite()}
                              >
                                  <View style={[]}>
                                      <Icon style={{color: this.state.is_favourite === 1 ? '#f00' : '#231F20', fontSize: 20}} type="FontAwesome" name='heart'/>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          {
                              (this.state.blog.is_chat === true && this.state.user_id !== this.state.blog.user_id)  ?
                                  <View style={[ styles.flex_25, styles.flexCenter, styles.paddingHorizontal_10, styles.paddingVertical_5, { borderLeftColor : '#ebebeb', borderRightWidth : 1 } ]}>
                                      <TouchableOpacity onPress={() => {
                                          this.props.navigation.navigate('chatroom', {
                                              other: this.state.blog.user_id,
                                              room: this.props.navigation.state.params.blog_id
                                          })
                                      }}>
                                          <View style={[]}>
                                              <View style={styles.marginHorizontal_5}>
                                                  <Icon style={[styles.icon_blcok, {color: '#231F20', fontSize: 20}]} type="Ionicons" name='ios-chatbubbles'/>
                                              </View>
                                              {/*<Text style={styles.block_Call_text}>{I18n.translate('send_mail')}</Text>*/}
                                          </View>
                                      </TouchableOpacity>
                                  </View>
                                  :
                                  <View/>
                          }
                          {
                              (this.state.blog.is_phone === true && this.state.user_id !== this.state.blog.user_id) ?
                                  <View style={[ styles.flex_25, styles.flexCenter, styles.paddingHorizontal_10, styles.paddingVertical_5, { borderLeftColor : '#ebebeb', borderRightWidth : 1 } ]}>
                                  <TouchableOpacity onPress={() => {Linking.openURL(`tel://${this.state.blog.mobile}`)}}>
                                          <View style={styles.marginHorizontal_5}>
                                              <Icon style={[styles.icon_blcok, {color: '#231F20', fontSize: 20}]} type="Ionicons" name='ios-call'/>
                                          </View>
                                          {/*<Text style={styles.block_Call_text}>{I18n.translate('call')}</Text>*/}
                                  </TouchableOpacity>
                                  </View>
                                  :
                                  <View/>
                          }
                          {
                              (this.state.blog.is_phone === true && this.state.user_id !== this.state.blog.user_id) ?
                                  <View style={[ styles.flex_25, styles.flexCenter, styles.paddingHorizontal_10, styles.paddingVertical_5 ]}>
                                  <TouchableOpacity onPress={() => {Linking.openURL('http://api.whatsapp.com/send?phone=' + this.state.blog.mobile);}}>
                                          <View style={styles.marginHorizontal_5}>
                                              <Icon style={[styles.icon_blcok, {color: '#231F20', fontSize: 20}]} type="Ionicons" name='logo-whatsapp'/>
                                          </View>
                                          {/*<Text style={styles.block_Call_text}>{I18n.translate('whats')}</Text>*/}
                                  </TouchableOpacity>
                                  </View>
                                  :
                                  <View/>
                          }
                      </View>
                     }

                      {
                          this.state.spinner ?
                              this._renderRows(this.loadingAnimated, 5, '5rows')
                              :
                              null
                      }



                      <View style={[ styles.Width_100, styles.paddingVertical_10, styles.paddingHorizontal_10 ]}>
                          <Text style={[styles.TiTle, styles.textSize_16]}>- {I18n.translate('description')}</Text>
                          <View style={[styles.Width_90, styles.paddingHorizontal_10]}>
                              <HTML
                                  html={this.state.blog.description}
                                  baseFontStyle={{
                                      fontSize            : 13,
                                      fontFamily          : 'CairoBold',
                                      color               : '#444' ,
                                      writingDirection    : I18nManager.isRTL ? 'rtl' : 'ltr'
                                  }}
                                  magesMaxWidth={Dimensions.get('window').width}
                              />
                          </View>
                      </View>

                      <TouchableOpacity
                          onPress={()=> {this.openMap(this.state.region.latitude , this.state.region.longitude)}}
                          style={[ styles.rowCenter, styles.marginVertical_15 ]}>
                          <Icon name={'location-pin'} type={'Entypo'} style={[ styles.text_red, styles.textSize_14 ]}/>
                          <Text style={[styles.textBold, styles.textSize_14, styles.text_red, styles.textDecoration]}>{I18n.translate('show_location')}</Text>
                      </TouchableOpacity>

                          <View style={[ styles.paddingHorizontal_10, styles.paddingVertical_10 , styles.Width_95 , styles.centerColum , { backgroundColor : '#F7F7F7' }]}>
                              <View style={[ styles.rowGroup, styles.Width_100 ]}>
                                  <View style={[styles.rowFlex,]}>
                                      <View style={[styles.rowFlex]}>
                                          <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray, styles.marginHorizontal_5 ]}>
                                              {I18n.translate('sar')} :
                                          </Text>
                                          {
                                              (this.state.id !== this.props.auth) ?
                                                  <View style={[styles.SelfLeft, styles.paddingHorizontal_5, { marginTop : 8 }]}>
                                                      <StarRating
                                                          disabled={false}
                                                          fullStarColor='#DAA520'
                                                          starSize={15}
                                                          maxStars={5}
                                                          rating={this.state.rate}
                                                      />
                                                  </View>
                                                  :
                                                  <View/>
                                          }
                                      </View>
                                  </View>
                                  <View style={[styles.rowFlex ,]}>
                                      <View style={[styles.rowFlex, styles.paddingHorizontal_10 ,{ borderLeftColor : '#ebebeb', borderRightWidth : 1 }]}>
                                          <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray,  ]}>
                                              {I18n.translate('id')} :
                                          </Text>
                                          <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray ]}>
                                              {this.state.blog.id}
                                          </Text>
                                      </View>
                                      <View style={[styles.rowFlex,]}>
                                          <Icon style={[ styles.textSize_14, styles.text_gray, styles.marginHorizontal_10 ]} type="FontAwesome5" name='map-marker-alt'/>
                                          <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray ]}>{this.state.blog.city} </Text>
                                      </View>
                                  </View>
                            </View>
                              <View style={[ styles.Width_100 ]}>
                                  <Text style={[styles.textBold, styles.textSize_18, styles.marginVertical_10, styles.marginHorizontal_5, { writingDirection : I18nManager.isRTL ? 'rtl' : 'ltr' }]}>
                                      {this.state.blog.title}
                                  </Text>
                              </View>
                              <View style={[styles.rowFlex , styles.Width_100, { marginTop : 5 }]}>
                                  <View style={[styles.rowFlex]}>
                                      <View style={[ styles.flexCenter, styles.width_30, styles.height_30 ]}>
                                        <Icon style={[ styles.textSize_14, styles.text_gray ]} type="Feather" name='flag'/>
                                      </View>
                                      <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray ]}>{this.state.blog.country} </Text>
                                  </View>
                              </View>
                              <View style={[styles.rowFlex , styles.Width_100, { marginTop : 5 }]}>
                                  <View style={[styles.rowFlex]}>
                                      <View style={[ styles.flexCenter, styles.width_30, styles.height_30 ]}>
                                          <Icon style={[ styles.textSize_20, styles.text_gray ]} type="FontAwesome" name='mobile-phone'/>
                                      </View>
                                      <Text style={[ styles.textRegular, styles.textSize_14, styles.text_gray ]}>{this.state.blog.mobile} </Text>
                                  </View>
                              </View>
                              {
                                  (this.state.blog.is_video === '1')
                                      ?
                                      <View style={[styles.rowFlex , styles.Width_100]}>
                                          <Text style={[ styles.textBold, styles.textSize_14, styles.text_black ]}>
                                              {I18n.translate('vdieo')} :
                                          </Text>
                                          <TouchableOpacity style={[ styles.marginHorizontal_10 ]} onPress={() => this.setState({is_video: true})}>
                                              <Icon name="video" type="Entypo" style={{color: '#F00'}}/>
                                          </TouchableOpacity>
                                      </View>
                                      :
                                      <View/>
                              }
                              {
                                  (this.props.auth) ?
                                      <View style={styles.write_comment}>
                                          <TouchableOpacity onPress={() => this.commentModal(2)}>
                                              <Text
                                                  style={[styles.textBold, styles.text_pink, styles.textSize_16, styles.textDecoration]}
                                                  onChangeText={(comment) => this.changeFocusName(comment)}
                                              >
                                                  {(this.state.all_comments.length === 0) ? I18n.translate('addComment') : I18n.translate('more')}
                                              </Text>
                                          </TouchableOpacity>
                                      </View>
                                      :
                                      <View/>
                              }
                          </View>

                      <View style={{paddingHorizontal: 10}}>

                          {
                              (this.state.show_model === 1) ?
                                  <View>
                                      <Text style={[styles.TiTle, styles.textSize_16]}>- {I18n.translate('model')}</Text>
                                      <View style={[styles.Width_90, styles.paddingHorizontal_10]}>
                                          <Text style={[ styles.textRegular , styles.text_gray, styles.textSize_14, { writingDirection : I18nManager.isRTL ? 'rtl' : 'ltr' } ]}>
                                              { this.state.model_car }
                                          </Text>
                                      </View>
                                  </View>
                                  :
                                  <View/>
                          }

                      </View>
                      <View style={styles.comment}>
                          <Text style={[styles.TiTle, styles.textSize_16]}>- {I18n.translate('comments')}</Text>
                          {
                              this.state.comments.length !== 0 ?
                                  this.state.comments.map((comment, i) => {
                                      return (
                                          <View key={i} style={[ styles.massage_user, styles.bg_White ]}>
                                              <View style={styles.user}>
                                                  <Text style={[ styles.text_gray, styles.textRegular, styles.textSize_12 ]}>{comment.date}</Text>
                                                  <View style={styles.views}>
                                                      <Icon style={styles.icon_user} type="FontAwesome5" name='user'/>
                                                      <Text style={[styles.text_user]}>
                                                          {comment.user}
                                                      </Text>
                                                  </View>
                                              </View>
                                              <View style={[styles.block_massage, styles.SelfLeft]}>
                                                  <Text style={[styles.massage, styles.SelfLeft]}>{comment.comment}</Text>
                                              </View>
                                              {
                                                  (this.state.user_id == comment.user_id)
                                                      ?
                                                      <TouchableOpacity style={[ styles.bg_black, styles.width_30, styles.height_30, styles.flexCenter, styles.Radius_30, styles.position_A, styles.right_0, { top : -15 } ]} onPress={() => {this.delete(comment.id, i, 'original')}}>
                                                          <Icon style={styles.report} type="FontAwesome" name='trash'/>
                                                      </TouchableOpacity>
                                                      :
                                                      <View/>
                                              }
                                              {
                                                  (this.state.user_id !== comment.user_id && this.props.auth) ?
                                                      <TouchableOpacity style={[ styles.bg_black, styles.width_30, styles.height_30, styles.flexCenter, styles.Radius_30, styles.position_A, styles.right_0, { top : -15 } ]} onPress={() => this.reportModalFun(comment.id, 'reportComment')}>
                                                          <Icon  style={styles.report} type="FontAwesome" name='flag' />
                                                      </TouchableOpacity>
                                                      :
                                                      <View/>
                                              }
                                          </View>
                                      )
                                  })
                                  :
                                  <View style={[ styles.flexCenter, styles.marginVertical_20, styles.Width_100 ]}>
                                      <Text style={[ styles.text_red, styles.textRegular ]}>
                                          {I18n.translate('noCom')}
                                      </Text>
                                  </View>
                          }

                      </View>
                      <Modal isVisible={this.state.is_video} avoidKeyboard={true}>
                          <View style={[styles.model, {backgroundColor: '#ff785f'}]}>
                              <Video
                                  source={{uri: this.state.blog.video}}
                                  shouldPlay
                                  resizeMode="cover"
                                  style={{width: '100%', height: 300}}
                              />
                              <TouchableOpacity onPress={() => {this.setState({is_video: false})}}>
                                  <Text style={{color: 'white', textAlign: 'center', fontSize: 22}}>{I18n.translate('cancel')}</Text>
                              </TouchableOpacity>
                          </View>
                      </Modal>

                      <View style={[styles.old_section, {marginHorizontal: 5}]}>
                          <Text style={[styles.TiTle]}>{I18n.translate('like')}</Text>
                          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                              {this.state.results.map((result, i) => {
                                  return (
                                      <View key={i} style={[styles.block_section_move_mune, styles.width_200, {padding: 0}]}>
                                          <TouchableOpacity onPress={() => {
                                              this.props.navigation.navigate({routeName: 'details', params: {blog_id: result.id,}, key: 'APage' + i})}}>
                                              <View style={{position: 'relative', overflow: 'hidden'}}>
                                                  <Image style={styles.image_MAZAD} source={{uri: result.img}}/>
                                                  <Text style={[styles.textDate, {textAlign: 'right', fontSize: 10, fontFamily: 'CairoBold'}]}>{result.date}</Text>
                                              </View>
                                              <View style={[styles.overHidden, styles.paddingVertical_10, styles.paddingHorizontal_10]}>
                                                  <View style={{flexDirection: 'row', width: '100%', marginVertical: 5}}>
                                                      <Text style={{fontSize: 13, color: '#bbb', fontFamily: 'CairoBold'}} numberOfLines={1} ellipsizeMode='tail'>
                                                          {result.title}
                                                      </Text>
                                                  </View>
                                                  <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
                                                      <View style={{flexDirection: 'row'}}>
                                                          <Icon style={styles.icon_user} type="FontAwesome5" name='user'/>
                                                          <Text style={styles.text_user}>
                                                              {result.user}
                                                          </Text>
                                                      </View>
                                                      <View style={{flexDirection: 'row'}}>
                                                          <Icon style={styles.icon_user} type="FontAwesome5" name='map-marker-alt'/>
                                                          <Text style={styles.text_user}>{result.country}</Text>
                                                      </View>
                                                  </View>
                                              </View>
                                          </TouchableOpacity>
                                      </View>
                                  )
                              })}
                          </ScrollView>
                      </View>

                      <Modal
                          style={{backgroundColor: 'transeprent'}}
                          visible={this.state.isImageViewVisible}
                          transparent={true}
                          enableImageZoom={true}
                          enableSwipeDown={true}
                      >
                          <ImageViewer
                              style={{backgroundColor: 'transeprent'}}
                              imageUrls={this.state.blog.images}
                              onSaveToCamera = {true}
                          />
                          <TouchableOpacity
                              style={{position: 'absolute', top: 35, right: 20}}
                              onPress={() => this.setState({isImageViewVisible: false})}
                          >
                              <Icon
                                  name="close"
                                  style={{fontSize: 30, color: 'white'}}
                              />
                          </TouchableOpacity>
                      </Modal>
                  </View>
                  </Content>

          <Modal avoidKeyboard={true} onBackdropPress={() => this.setState({ commentModal: false })} isVisible={this.state.commentModal}>
              <View style={styles.model}>
                  <View style={[styles.commenter , {width:'100%'}]}>
                      <Text style={styles.TiTle}>{I18n.translate('comments')}</Text>
                      <ScrollView style={[ styles.height_200, styles.Width_100, styles.paddingVertical_10 ]} ref={ref => this.scrollView = ref} onContentSizeChange={(contentWidth, contentHeight)=>{ this.scrollView.scrollToEnd({animated: true})}}>
                          {this.state.all_comments.map((comment, i) => {
                              return (
                                  <View key ={i} style={styles.massage_user}>
                                      <View style={styles.user}>
                                          <Text style={[ styles.text_gray, styles.textRegular, styles.textSize_12 ]}>{comment.date}</Text>
                                          <View style={styles.views}>
                                              <Icon style={styles.icon_user} type="FontAwesome5" name='user'/>
                                              <Text style={styles.text_user}>
                                                  {comment.user}
                                              </Text>
                                          </View>
                                      </View>
                                      <View style={[styles.block_massage, styles.SelfLeft]}>
                                          <Text style={[styles.massage, styles.SelfLeft]}>{comment.comment}</Text>
                                      </View>
                                      {
                                          (this.state.user_id == comment.user_id)
                                              ?
                                              <TouchableOpacity style={[ styles.bg_black, styles.width_30, styles.height_30, styles.flexCenter, styles.Radius_30, styles.position_A, styles.right_0, { top : -15 } ]} onPress={()=>{this.delete(comment.id,i,'modal') }}>
                                                  <View>
                                                      <Icon  style={styles.report} type="FontAwesome" name='trash' />
                                                  </View>
                                              </TouchableOpacity>
                                              :
                                              <View/>
                                      }
                                      {
                                          (this.state.user_id !== comment.user_id && this.props.auth) ?
                                              <TouchableOpacity style={[ styles.bg_black, styles.width_30, styles.height_30, styles.flexCenter, styles.Radius_30, styles.position_A, styles.right_0, { top : -15 } ]} onPress={() => this.reportModalFun(comment.id, 'reportComment')}>
                                                  <Icon  style={styles.report} type="FontAwesome" name='flag' />
                                              </TouchableOpacity>
                                              :
                                              <View/>
                                      }
                                  </View>
                              )
                          })}
                      </ScrollView>
                      <View style={{ marginTop : 20 }} >
                          <View style={[ styles.paddingHorizontal_10 ]} >
                              {/*<Input */}
                              {/*    value={this.state.comment} */}
                              {/*    onChangeText={(comment)=> this.setState({comment: comment})}  */}
                              {/*    style={{ textAlign : 'center',fontFamily: 'CairoRegular'}} */}
                              {/*    placeholder={I18n.translate('leave_comment')}*/}
                              {/*/>*/}
                              <Textarea
                                  value={this.state.comment}
                                  style={[ styles.texteriaForm, styles.Border , styles.borderGray ]}
                                  onChangeText={(comment)=> this.setState({comment: comment})}
                                  rowSpan={5}
                                  placeholder={I18n.translate('leave_comment')}
                              />
                          </View>
                          <View style={styles.write_comment}>
                              <TouchableOpacity style={[ styles.bg_ligth, styles.width_130, styles.flexCenter, styles.height_40, styles.Radius_5 ]}>
                                  <Text onPress={() => this.CommentBlog()} style={[ styles.textSize_14, styles.textRegular, styles.text_White ]}>{I18n.translate('addComment')}</Text>
                              </TouchableOpacity>
                          </View>
                      </View>
                   </View>
               </View>
          </Modal>

          <Modal isVisible={this.state.reportModal} onBackdropPress={() => this.setState({reportModal : !this.state.reportModal})} style={[ styles.bottomCenter, styles.Width_100 ]}>
              <View style={[styles.overHidden, styles.bg_White , styles.Width_100, styles.position_R, styles.top_20]}>

                  <ScrollView>
                      <View style={[styles.paddingVertical_15, styles.Border, styles.border_gray]}>
                          <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.textCenter]}>
                              {I18n.translate('report')}
                          </Text>
                      </View>
                      <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>
                          {
                              this.state.arrReport.map((report, i) => (
                                  <TouchableOpacity
                                      style={[styles.rowGroup, styles.marginVertical_10]}
                                      onPress={() => this.selectReportId(report.id, report.reason)}
                                  >
                                      <View style={[styles.overHidden, styles.rowRight]}>
                                          <CheckBox
                                              style={[styles.checkBox, styles.bg_ligth,  styles.borderBlue, ]}
                                              color={styles.text_pink}
                                              selectedColor={styles.text_pink}
                                              checked={this.state.reportId === report.id}
                                          />
                                          <Text
                                              style={[styles.textRegular, styles.text_pink, styles.textSize_16, styles.paddingHorizontal_20]}>
                                              { report.reason }
                                          </Text>
                                      </View>
                                  </TouchableOpacity>
                              ))
                          }
                      </View>
                      <TouchableOpacity
                          style={[styles.bg_ligth, styles.Width_90, styles.flexCenter, styles.marginVertical_10, styles.height_50, styles.Radius_5]}
                          onPress={() => this.onSentReport()}>
                          {
                              this.state.loadItem ?
                                  <ActivityIndicator size="small" color="#fff" />
                                  :
                                  <Text style={[styles.textRegular, styles.textSize_14, styles.text_White]}>
                                      {I18n.translate('send')}
                                  </Text>
                          }

                      </TouchableOpacity>
                  </ScrollView>
              </View>
          </Modal>

      </Container>
    );
  }
}
const mapStateToProps = ({ auth,profile, lang  }) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        result   : auth.success,
        userId   : auth.user_id,
    };
};
export default connect(mapStateToProps, { userLogin ,profile})(DetilsE3lan);

