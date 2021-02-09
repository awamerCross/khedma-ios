import React  from 'react';
import {
    StyleSheet,
    ScrollView,
    Platform,
    TouchableOpacity,
    ImageEditor,
    Image,
    ImageStore,
    Dimensions,
    ActivityIndicator,
    KeyboardAvoidingView, I18nManager as RNI18nManager, Picker
} from 'react-native';
import {
    Container,
    Icon,
    Content,
    ActionSheet,
    Body,
    Button,
    Title,
    Text,
    View,
    Item,
    Input,
    Textarea,
    CheckBox,
    Left,
    ListItem,
    Toast, Right, Header
}
    from 'native-base';
import axios       from "axios";
// import {Bubbles}   from "react-native-loader";
import {connect}   from "react-redux";
// import Spinner     from "react-native-loading-spinner-overlay";

import * as ImagePicker from 'expo-image-picker';
import MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import I18n from "ex-react-native-i18n";
import {ImageBrowser,CameraBrowser} from 'expo-multiple-imagepicker';
let    base64   = [];
const  height = Dimensions.get('window').height;
import marker from '../../assets/marker.png'
import {NavigationEvents} from "react-navigation";
import CONST from '../consts';
import styles from '../../assets/style'
import Modal from "react-native-modal";
const  isIphoneX = Platform.OS === 'ios' && height == 812 || height == 896;

let BUTTONS = [
    { text: I18n.translate('gallery_photo') ,i : 0 },
    { text: I18n.translate('camera_photo'),i : 1},
    { text: I18n.translate('gallery_video') ,i : 2},
    { text: I18n.translate('cancel'),   color: "#ff5b49" }
];
let DESTRUCTIVE_INDEX = 3;
let CANCEL_INDEX = 3;

class Edit_ad extends React.Component {
    constructor(props) {
        super(props);
        RNI18nManager.forceRTL(true);
        this.state = {
            lang             : 'ar',
            phone            : 'ar',
            video            : '',
            youtube          : '',
            title            : '',
            price            : '',
            description      : '',
            video_base64     : '',
            type             : '',
            formData         :  new FormData(),
            blog             : '',
            image            : null,
            city_id          : null,
            sub_section_id   : null,
             section_id      : null,
            key              : null,
            mobile           : null,
            user_id          : this.props.auth.data.id,
            is_chat          : false,
            is_phone         : false,
            is_location      : false,
            is_refresh       : false,
            country_id       : null,
            sub_category_id  : null,
            category_id      : null,
            imageBrowserOpen : false,
            isLoaded         : false,
            cameraBrowserOpen: false,
            photos           : [],
            countries        : [],
            categories       : [],
            sub_categories   : [],
            codes            : [],
            images           : [],
            base64           : [],
            Base64           : [],
            sections         : [],
            models           : [],
            cities           : [],
            region           : {
                latitudeDelta    : 0.0922,
                longitudeDelta   : 0.0421,
                latitude         : null,
                longitude        : null
            },
            model : null,
            years : [],
            year  : null,

            nameCountry: I18n.t('choose_country'),
            modelCountry: false,

            nameCity: I18n.t('choose_city'),
            modelCity: false,

            nameCode: I18n.t('keyCountry'),
            modelCode: false,

            nameCar: I18n.t('choose_model'),
            modelCar: false,

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

        if (type === 'car'){
            this.setState({
                modelCar           : !this.state.modelCar,
            });
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

        if (type === 'car'){
            this.setState({
                modelCar             : !this.state.modelCar,
                nameCar              : id,
                year                 : id,
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

    renderLoader(){
        if (this.state.spinner){
            return(
                <View style={[styles.loading, styles.flexCenter]}>
                    <ActivityIndicator size="large" color="#444" />
                </View>
            );
        }
    }

    async componentWillMount() {

        this.setState({lang : this.props.lang});
        this.setState({spinner: true});
        this.setState({images: [],photos: []});
        axios.post(`${CONST.url}countries`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({countries: response.data.data});
                axios.post(`${CONST.url}BlogDetails`, {  lang: this.props.lang , id : this.props.navigation.state.params.id, user_id : this.props.user.id })
                    .then( (response)=> {

                        axios.post(`${CONST.url}cities`, { lang:this.props.lang , country_id: response.data.data.country_id })
                            .then( (response)=> {
                                this.setState({cities: response.data.data});
                            }).catch( (error)=> {
                            this.setState({spinner: false});
                        });

                        this.setState({
                            blog: response.data.data,
                            key : response.data.data.key
                        });

                        this.setState({phone: response.data.data.phone});
                        this.setState({youtube: response.data.data.youtube});
                        this.setState({country_id: response.data.data.country_id});
                        this.setState({city_id: response.data.data.city_id});
                        this.setState({title: response.data.data.title});
                        this.setState({price: response.data.data.price});
                        this.setState({description: response.data.data.description});
                        this.setState({mobile: response.data.data.mobile});
                        this.setState({category_id: response.data.data.category_id});
                        this.setState({sub_section_id: response.data.data.sub_section_id});
                        this.setState({section_id: response.data.data.section_id});
                        this.setState({is_location: response.data.data.is_location});
                        this.setState({sub_category_id: response.data.data.sub_category_id});
                        this.setState({is_chat: response.data.data.is_chat});
                        this.setState({is_phone: response.data.data.is_phone});
                        this.setState({is_refresh: response.data.data.is_refreshed});
                        this.setState({images: response.data.data.images});
                        this.setState({year: response.data.data.model});
                        this.setState({nameCountry: response.data.data.country});
                        this.setState({nameCity: response.data.data.city});
                        this.setState({nameCode: response.data.data.key});
                        this.setState({key: response.data.data.key});
                        this.setState({
                            region: {
                                latitude:  response.data.data.latitude,
                                longitude: response.data.data.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }
                        });

                        for(let i = 2020; i > 1990 ; i--){
                            this.state.years.push(JSON.stringify(i));
                        }

                        // axios.post(`${CONST.url}sections`, {
                        //     lang: this.props.lang ,
                        //     sub_category_id : response.data.data.sub_category_id
                        // }).then((response)=> {
                        //     this.setState({sections: response.data.data});
                        //
                        //     axios.post(`${CONST.url}models`, {
                        //         lang       : this.props.lang ,
                        //         section_id : this.state.section_id
                        //     }).then((response)=> {
                        //         this.setState({
                        //             models : response.data.data,
                        //             spinner:false
                        //         });
                        //     }).catch(e => {
                        //         this.setState({spinner:false});
                        //     });
                        //
                        // });




                        axios.post(`${CONST.url}codes`, {lang: this.props.lang  })
                            .then((response) => {
                                this.setState({codes: response.data.data});
                                // this.setState({key: response.data.data[0]});
                            })
                            .catch((error) => {
                                this.setState({spinner: false});
                            }).then(() => {
                            this.setState({spinner: false});
                        });

                        axios.post(`${CONST.url}categories`, { lang: this.props.lang  })
                            .then( (response)=> {
                                this.setState({categories : response.data.data})

                                // axios.post(`${CONST.url}sub_categories`, { lang: this.props.lang  ,id : this.state.category_id })
                                //     .then( (response)=> {
                                //
                                //         this.setState({sub_categories : response.data.data})
                                //
                                //     }).catch( (error)=> {
                                //     this.setState({spinner: false});
                                // });

                            }).catch( (error)=> {
                            this.setState({spinner: false});
                        }).then(()=>{
                            this.setState({spinner: false});
                        });


                    }).catch( (error)=> {
                        this.setState({spinner: false});
                    })

            })
            .catch( (error)=> {
                this.setState({spinner: false});

            })

    }

    onFocus() {
        this.componentWillMount()
    }

    renderMap() {
        if(this.state.region.latitude !== null)
        {
            return (
                <View style={[ styles.Width_95, styles.height_150, styles.Radius_5, styles.flexCenter, styles.marginVertical_10, styles.Border, styles.overHidden ]}>
                    <MapView
                        style={[ styles.Width_100, styles.height_150 ]}
                        showsBuildings={true}
                        minZoomLevel={7}

                        initialRegion={this.state.region}
                        onRegionChangeComplete={this.onRegionChange}

                    />
                    <View style={styles.markerFixed}>
                        <Image style={styles.marker} source={marker} />
                    </View>

                </View>
            )
        }
    }

    onRegionChange = region => {
        this.setState({
            region
        })
    };

    open() {
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: I18n.translate('image_video')
            },
            buttonIndex => {
                this.images_video(BUTTONS[buttonIndex])

            }
        )
    }

    validate = () => {
        let isError = false;
        let msg = '';

        if (this.state.title === '') {
            isError = true;
            msg = I18n.t('titleValidation');
        }
        // else if (this.state.price === '') {
        //     isError = true;
        //     msg = I18n.t('priceRequired');
        // }
        else if (this.state.description === '') {
            isError = true;
            msg = I18n.t('descriptionRequired');
        }
        if (msg != ''){
            CONST.showToast( msg,  "danger")
          //  Toast.show({ text: msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });

        }
        return isError;
    };

    onLoginPressed() {
        const err = this.validate();
        if (!err){
            this.setState({ isLoaded: true });
            this.state.formData.append('id',this.props.navigation.state.params.id);
            axios.post(`${CONST.url}uploadVideo`, this.state.formData)
                .then((response) => {
                }).catch((error) => {
            });
            this.state.formData.append('id',this.props.navigation.state.params.id);
            axios.post(`${CONST.url}uploadVideo`, this.state.formData)
                .then((response) => {
                }).catch((error) => {
            });
            axios.post(`${CONST.url}editAd`,
                {
                    id              : this.props.navigation.state.params.id,
                    title           : this.state.title,
                    mobile          : this.state.mobile,
                    phone           : this.state.phone,
                    youtube         : this.state.youtube,
                    price           : this.state.price,
                    key             : this.state.key,
                    description     : this.state.description,
                    country_id      : this.state.country_id,
                    latitude        : this.state.region.latitude,
                    longitude       : this.state.region.longitude,
                    user_id         : this.state.user_id,
                    city_id         : this.state.city_id,
                    category_id     : this.state.category_id,
                    sub_category_id : this.state.sub_category_id,
                    is_refreshed    : this.state.is_refresh,
                    sub_section_id  : this.state.sub_section_id,
                    section_id      : this.state.section_id,
                    is_mobile       : this.state.is_phone,
                    is_chat         : this.state.is_chat,
                    is_location     : this.state.is_location,
                    model           : this.state.year,
                    images          : base64
                }
            ).then( (response)=> {
                    if(response.data.value === '1' )
                    {
                        CONST.showToast(response.data.msg,  "success")

                        // Toast.show({ text:response.data.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                        this.props.navigation.navigate('MyAds');
                    }else {
                        CONST.showToast(response.data.msg,  "danger")
                        //Toast.show({ text:response.data.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                    }
                }).catch( (error)=> {
                    this.setState({isLoaded: false});
                }).then(()=>{
                this.setState({isLoaded: false});
            });
        }
    }

    renderSubmit() {
        if (this.state.isLoaded){
            return(
                <View  style={{ justifyContent:'center', alignItems:'center', marginVertical: 30}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <Button  onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('save')}</Text>
            </Button>
        );
    }

    images_video = async (i) => {

        if (i.i === 0) {

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.All,
                aspect     : [4, 3],
                quality    : .5,
                base64     : true
            });
            if (!result.cancelled) {
                this.setState({
                    photos : this.state.photos.concat(result.uri)
                });
                base64.push(result.base64);
            }

        } else if (i.i === 1) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes : ImagePicker.MediaTypeOptions.All,
                aspect     : [4, 3],
                quality    : .5,
                base64     : true
            });
            if (result) {
                this.setState({
                    photos: this.state.photos.concat(result.uri)
                });
                base64.push(result.base64);
            }

        } else if (i.i === 2) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Videos',
                quality: 0
            });
            if (!result.cancelled) {
                this.setState({video: result.uri ,video_base64:result.base64, image: result.uri});
            }

            let localUri = result.uri;
            let filename = localUri.split('/').pop();
            let match    = /\.(\w+)$/.exec(filename);
            let type     = match ? `video/${match[1]}` : video;
            this.state.formData.append('media', {
                uri: localUri, name: filename, type
            });
        }
    };

    imageBrowserCallback = ( callback  ) => {
        callback.then((photos) => {
                this.setState({
                    imageBrowserOpen   : false,
                    cameraBrowserOpen  : false,
                    photos             : this.state.photos.concat(photos)
                });
                const imgs = this.state.photos;
                for (let i =0; i < imgs.length; i++){
                    const imageURL = imgs[i].file;
                    Image.getSize(imageURL, (width, height) => {
                        let imageSize = {
                            size: {
                                width,
                                height
                            },
                            offset: {
                                x: 0,
                                y: 0,
                            },
                        };
                        ImageEditor.cropImage(imageURL, imageSize, (imageURI) => {
                            ImageStore.getBase64ForTag(imageURI, (base64Data) => {
                                base64.push(base64Data);
                            }, (reason) => console.log(reason) )
                        }, (reason) => console.log(reason) )
                    }, (reason) => console.log(reason))
                }
            }
        ).catch((e) => console.log(e))
    };

    delete_img(i) {
        this.state.photos.splice(i,1);
        base64.splice(i,1);
        this.setState({photos: this.state.photos})
    }

    delete_video(i) {
        this.setState({image: null , video : ''})
    }

    deleteـImage(id,i) {
        this.setState({spinner: true});
        axios.post(`${CONST.url}deleteImage`, { lang:this.props.lang , id:id })
            .then( (response)=> {

                if(response.data.value === '1' )
                {
                    this.state.images.splice(i,1);
                    // Toast.show({ text:response.data.msg, duration : 2000  ,type :"success", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                    CONST.showToast(response.data.msg,  "success")

                }else {
                    CONST.showToast(response.data.msg,  "danger")

                    // Toast.show({ text:response.data.msg, duration : 2000  ,type :"danger", textStyle: {  color: "white",fontFamily : 'CairoRegular' ,textAlign:'center' } });
                }
            })

            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
            this.setState({spinner: false});
        });
    }

    renderImage(item, i) {
        return(
            <View key={i} style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>

                <Image
                    style={{width : '100%', height :  "100%"}}
                    source={{uri: item}}
                    key={i}
                />
                <TouchableOpacity onPress={()=> {this.delete_img(i)}} style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: '100%',
                    height : '100%',
                    alignItems  : 'center',
                    justifyContent : 'center'
                }}>

                    <Icon name="close" style={{ color : 'white' , textAlign:'center', fontSize:32}}/>

                </TouchableOpacity>
            </View>
        )
    }

    renderImages(item, i) {
        return(
            <View key={i} style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>

                <Image
                    style={{width : '100%', height : '100%'}}
                    source={{uri: item.url}}
                    key={i}
                />
                <TouchableOpacity onPress={()=> {this.deleteـImage(item.id,i)}} style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: '100%',
                    height : '100%',
                    alignItems  : 'center',
                    justifyContent : 'center'
                }}>

                    <Icon name="close" style={{ color : 'white' , textAlign:'center', fontSize:25}}/>

                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    };

    render() {
        const { width } = Dimensions.get('window');
        if (this.state.imageBrowserOpen) {
            return(<ImageBrowser base64={true}  max={8}  callback={this.imageBrowserCallback}/>);
        }else if (this.state.cameraBrowserOpen) {

            return(<CameraBrowser base64={true}   max={8} callback={this.imageBrowserCallback}/>);
        }

        return (
            <Container style={{ backgroundColor : '#e5e5e5' }}>
                <NavigationEvents onWillFocus={() => this.onFocus()} />
                {this.renderLoader()}
                {/*<Spinner visible={this.state.spinner}/>*/}
                <Header style={styles.Header_Up}>
                    <Body style={[styles.body_header,styles.textHead]}>
                        <Title style={styles.headerTitle}>{I18n.translate('editProduct')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={styles.upload}>
                        <Text style={styles.textes}>{I18n.translate('add_photo')}</Text>
                        <View >
                            <TouchableOpacity onPress={()=> this.open()}>
                                <View style={styles.blockUpload}>
                                    <Icon style={styles.iconUpload} active type="AntDesign" name='pluscircleo' />
                                    <Text style={styles.textes}>
                                        {I18n.translate('image_video')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>
                        {this.state.photos.map((item,i) => this.renderImage(item,i))}
                        {this.state.images.map((item,i) => this.renderImages(item,i))}
                        {
                            (this.state.video !== '')

                                ?
                                <View style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>
                                    <Image source={{uri: this.state.image}} style={{width : '100%', height : '100%'}}/>
                                    <TouchableOpacity onPress={()=> {this.delete_video()}} style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        width: '100%',
                                        height : '100%',
                                        alignItems  : 'center',
                                        justifyContent : 'center'
                                    }}>
                                        <Icon name="close" style={{ color : 'white' , textAlign:'center', fontSize:22}}/>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View/>
                        }
                    </ScrollView>

                    <View style={[ styles.rowGroup, styles.paddingHorizontal_5, styles.marginVertical_10 ]}>
                        <View style={[ styles.flex_50, styles.paddingHorizontal_5 ]}>
                            <TouchableOpacity onPress={() => this.toggleModal('country')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.bg_White, { paddingVertical : 12 }]}>
                                <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                    { this.state.nameCountry }
                                </Text>
                                <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                            </TouchableOpacity>
                        </View>
                        <View style={[ styles.flex_50, styles.paddingHorizontal_5 ]}>
                            <TouchableOpacity onPress={() => this.toggleModal('city')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.bg_White,{ paddingVertical : 12 }]}>
                                <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                    { this.state.nameCity }
                                </Text>
                                <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                            </TouchableOpacity>
                        </View>
                    </View>

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

                    <View style={[ styles.paddingHorizontal_10 ]}>
                        {
                            (this.props.navigation.state.params.nameCar === 'car') ?
                                <TouchableOpacity onPress={() => this.toggleModal('car')} style={[ styles.clickFunctionHome, styles.flex_100, styles.Width_100, styles.marginVertical_10, styles.paddingHorizontal_10, styles.bg_White, styles.height_50 ]}>
                                    <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                        { this.state.nameCar }
                                    </Text>
                                    <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>

                    <Modal isVisible={this.state.modelCar} onBackdropPress={() => this.toggleModal('car')} style={[styles.bottomCenter, styles.Width_100]}>
                        <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}>

                            <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                                <ScrollView style={{ height: 300, width: '100%' }}>
                                    <View>
                                        {
                                            this.state.years.map((year, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={index.toString()}
                                                            style={[styles.rowGroup, styles.marginVertical_10]}
                                                            onPress={() => this.selectId('car', year)}
                                                        >
                                                            <View style={[styles.overHidden, styles.rowRight]}>
                                                                <CheckBox
                                                                    style={[styles.checkBox, styles.bg_black, styles.borderBlack]}
                                                                    color={styles.text_White}
                                                                    selectedColor={styles.text_White}
                                                                    checked={this.state.year === year}
                                                                />
                                                                <Text style={[styles.textRegular, styles.text_black, styles.textSize_16, styles.paddingHorizontal_20]}>
                                                                    {year}
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

                    {/*<KeyboardAvoidingView behavior="padding" style={{  flex: 1}} >*/}
                        <View style={[ styles.block_section , { margin : 0 , marginHorizontal : 10, padding : 0 ,paddingHorizontal : 5 } ]}>

                            {/*<Item style={styles.item}>*/}
                            {/*    <Input  value = {this.state.title} onChangeText={(title)=>{ this.setState({title})}} style={[styles.input, { paddingRight : 10,paddingLeft : 10}]} placeholder={I18n.translate('title')} />*/}
                            {/*</Item>*/}

                            {/*<Item style={styles.item}>*/}
                            {/*    <Input value={this.state.price} keyboardType={'number-pad'} style={[styles.input, { paddingRight : 10,paddingLeft : 10}]}   onChangeText={(price)=>{ this.setState({price})}} placeholder={I18n.translate('price')} />*/}
                            {/*</Item>*/}

                            <View style={[ styles.item, { borderColor : '#DDD' ,borderWidth : .5 } ]} >
                                <Input
                                    // style={[styles.input,{width : '100%'}]}
                                    placeholder={ I18n.translate('title')}
                                    onChangeText={(title) => this.setState({title})}
                                    style={[styles.input, styles.height_50, { paddingRight : 10, paddingLeft : 10, color : "#121212" }]}
                                    value = {this.state.title}
                                />
                            </View>

                            <View style={[ styles.item, { borderColor : '#DDD' ,borderWidth : .5 } ]} >
                                <Input
                                    // style={[styles.input,{width : '100%'}]}
                                    placeholder={ I18n.translate('price')}
                                    onChangeText={(price) => this.setState({price})}
                                    style={[styles.input, styles.height_50, { paddingRight : 10, paddingLeft : 10, color : "#121212" }]}
                                    value={this.state.price}
                                />
                            </View>

                            <View style={[styles.overHidden, styles.Width_100]}>
                                <Textarea value={this.state.description} style={{
                                    borderBottomColor       : '#DDD',
                                    borderBottomWidth       : 1,
                                    height                  : 100,
                                    textAlign               : 'right',
                                    color                   : '#444',
                                    fontFamily              : 'CairoRegular',
                                    fontSize                : 14,
                                    borderColor             : '#DDD',
                                    width                   : '100%',
                                    padding                 : 0
                                }}  onChangeText={(description)=>{ this.setState({description})}}  rowSpan={5} bordered placeholder={I18n.translate('description')} />
                            </View>

                            {/*<View style={{flex:1, flexDirection: 'row'}}>*/}

                            {/*    <View style={{flex:2}}>*/}
                            {/*        <Item  style={styles.item} >*/}
                            {/*            <Icon style={[styles.icon_input , {top : 20}]} active type="FontAwesome" name='whatsapp' />*/}
                            {/*            <Input style={styles.input}  keyboardType={'number-pad'} onChangeText={(phone) => this.setState({phone})}  value={ this.state.phone } placeholder={ I18n.translate('whatsapp')}   />*/}
                            {/*        </Item>*/}
                            {/*    </View>*/}

                            {/*    <View style={{flex:1, top : 18}}>*/}

                            {/*        <Item style={[ styles.itemPiker_second ]} regular>*/}
                            {/*            <Picker*/}
                            {/*                iosHeader={I18n.translate('choose_code')}*/}
                            {/*                headerBackButtonText={I18n.translate('goBack')}*/}
                            {/*                mode="dropdown"*/}
                            {/*                style={styles.Picker}*/}
                            {/*                selectedValue={this.state.key}*/}
                            {/*                onValueChange={this.onValueChange_key.bind(this)}*/}
                            {/*                placeholderStyle={{ color: "#bbb", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 16 }}*/}
                            {/*                textStyle={{ color: "#bbb",fontFamily : 'CairoRegular', writingDirection: 'rtl',paddingLeft : 0,paddingRight : 0 }}*/}
                            {/*                placeholder={I18n.translate('choose_code')}*/}
                            {/*                itemTextStyle={{ color: '#bbb',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>*/}

                            {/*                <Picker.Item style={styles.itemPicker} label={I18n.translate('choose_code')} value={null} />*/}

                            {/*                {*/}
                            {/*                    this.state.codes.map((country, i) => (*/}
                            {/*                        <Picker.Item style={styles.itemPicker} key={i} label={country} value={country} />*/}
                            {/*                    ))*/}
                            {/*                }*/}

                            {/*            </Picker>*/}
                            {/*            <Icon style={styles.iconPicker} type="AntDesign" name='down' />*/}
                            {/*        </Item>*/}

                            {/*    </View>*/}

                            {/*</View>*/}

                            <View style={{flexDirection: 'row', width : '100%'}}>
                                <View style={[ styles.flex_60 ]}>
                                    <View style={{
                                        padding                 : 0,
                                        width                   : '100%',
                                        marginVertical          : 10,
                                        marginLeft              : 0,
                                    }} >
                                        {/*<Icon style={styles.icon_input} active type="SimpleLineIcons" name='phone' />*/}
                                        {/*<Label style={styles.label}>{ I18n.translate('enterchoose')}</Label>*/}
                                        <Input
                                            placeholder={I18n.translate('whatsapp')}
                                            style={[styles.input, { paddingRight : 10, paddingLeft : 10, color : "#121212", borderWidth : 0.5, borderColor : '#b5b5b5' }]}
                                            onChangeText={(phone) => this.setState({phone})}
                                            value={ this.state.phone }
                                            keyboardType={'number-pad'}
                                        />
                                    </View>
                                </View>
                                <View style={[ styles.flex_40 ]}>
                                    <TouchableOpacity onPress={() => this.toggleModal('code')} style={[ styles.Width_100 , styles.paddingHorizontal_10 , styles.rowGroup, styles.Border, this.state.key !== null ? styles.borderRed : styles.borderGray, { paddingVertical : 14.5, marginTop : 10 }]}>
                                        <Text style={[styles.textRegular, styles.textSize_11, styles.text_black]}>
                                            { this.state.nameCode }
                                        </Text>
                                        <Icon style={[styles.textSize_14, styles.text_gray]} type="AntDesign" name='down' />
                                    </TouchableOpacity>
                                </View>
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

                        <View style={[styles.textsetting, styles.bgLiner, styles.height_40, styles.width_200, styles.Radius_5]}>
                            <Icon style={styles.icoSetting} type="Octicons" name='settings' />
                            <Text style={[styles.textBtn]}>{I18n.translate('configurations')}</Text>
                        </View>

                        <View style={[ styles.overHidden, styles.marginVertical_10 ]}>

                            <View style={[ styles.overHidden, styles.paddingHorizontal_10 ]}>
                                <ListItem style={{ paddingRight : 0, marginLeft : 0 }}  onPress={() => this.setState({ is_phone: !this.state.is_phone })}>
                                    <CheckBox
                                        checked={this.state.is_phone}
                                        value={this.state.is_phone}
                                        style = {[styles.checkBox, { backgroundColor : '#f00', borderColor : '#f00', borderWidth : 1 }]}
                                        onPress={() => this.setState({ is_phone: !this.state.is_phone })}
                                    />
                                    <View style={[ styles.flexCenter, styles.Radius_40, { width : 30, height : 30, marginHorizontal : 5,backgroundColor : '#f4f4f4' } ]}>
                                        <Icon name={'chat'} type={'MaterialCommunityIcons'} style={{color : '#9c9c9c' , fontSize : 14}}/>
                                    </View>
                                    <Body>
                                        <Text style={styles.textIner}>{I18n.translate('with_phone')}</Text>
                                    </Body>
                                </ListItem>
                            </View>

                            <View style={[ styles.overHidden, styles.paddingHorizontal_10 ]}>
                                <ListItem style={{ paddingRight : 0, marginLeft : 0 }}  onPress={() => this.setState({ is_refresh: !this.state.is_refresh })}>
                                    <CheckBox
                                        checked={this.state.is_refresh}
                                        style = {[styles.checkBox, { backgroundColor : '#f00', borderColor : '#f00', borderWidth : 1 }]}
                                        onPress={() => this.setState({ is_refresh: !this.state.is_refresh })}
                                    />
                                    <View style={[ styles.flexCenter, styles.Radius_40, { width : 30, height : 30, marginHorizontal : 5,backgroundColor : '#f4f4f4' } ]}>
                                        <Icon name={'cellphone-off'} type={'MaterialCommunityIcons'} style={{color : '#9c9c9c' , fontSize : 14}}/>
                                    </View>
                                    <Body>
                                        <Text style={styles.textIner}>{I18n.translate('renew')}</Text>
                                    </Body>
                                </ListItem>
                            </View>

                            <View style={[ styles.overHidden, styles.paddingHorizontal_10 ]}>
                                <ListItem style={{ paddingRight : 0, marginLeft : 0 }} onPress={() => this.setState({ is_chat: !this.state.is_chat })}>
                                    <CheckBox
                                        checked={this.state.is_chat}
                                        value={this.state.is_chat}
                                        style = {[styles.checkBox, { backgroundColor : '#f00', borderColor : '#f00', borderWidth : 1 }]}
                                        onPress={() => this.setState({ is_chat: !this.state.is_chat })}
                                    />
                                    <View style={[ styles.flexCenter, styles.Radius_40, { width : 30, height : 30, marginHorizontal : 5,backgroundColor : '#f4f4f4' } ]}>
                                        <Icon name={'refresh'} type={'SimpleLineIcons'} style={{color : '#9c9c9c' , fontSize : 14}}/>
                                    </View>
                                    <Body>
                                        <Text style={styles.textIner}>{I18n.translate('private')}</Text>
                                    </Body>
                                </ListItem>
                            </View>

                        </View>

                        {/*<ListItem  onPress={() => this.setState({ is_phone: !this.state.is_phone })}>*/}
                        {/*    <CheckBox*/}
                        {/*        checked={this.state.is_phone}*/}
                        {/*        value={this.state.is_phone}*/}
                        {/*        style = {[styles.checkBox]}*/}
                        {/*    />*/}
                        {/*    <Body>*/}
                        {/*        <Text style={styles.textIner}>{I18n.translate('with_phone')}</Text>*/}
                        {/*    </Body>*/}
                        {/*</ListItem>*/}

                        {/*<ListItem  onPress={() => this.setState({ is_refresh: !this.state.is_refresh })}>*/}
                        {/*    <CheckBox*/}
                        {/*        checked={this.state.is_refresh}*/}
                        {/*        style = {[styles.checkBox]}*/}
                        {/*    />*/}
                        {/*    <Body>*/}
                        {/*        <Text style={styles.textIner}>{I18n.translate('renew')}</Text>*/}
                        {/*    </Body>*/}
                        {/*</ListItem>*/}

                        {/*<ListItem   onPress={() => this.setState({ is_chat: !this.state.is_chat })}>*/}
                        {/*    <CheckBox*/}
                        {/*        checked={this.state.is_chat}*/}
                        {/*        value={this.state.is_chat}*/}
                        {/*        style = {[styles.checkBox]}*/}
                        {/*    />*/}
                        {/*    <Body>*/}
                        {/*        <Text style={styles.textIner}>{I18n.translate('private')}</Text>*/}
                        {/*    </Body>*/}
                        {/*</ListItem>*/}

                        { this.renderMap() }

                        { this.renderSubmit() }

                    {/*</KeyboardAvoidingView>*/}
                </Content>

            </Container>
        );
    }
}


const mapStateToProps = ({ auth, lang ,profile}) => {

    return {

        auth   : auth.user,
        lang   : lang.lang,
        user   : profile.user,
    };
};
export default connect(mapStateToProps,{})(Edit_ad);
