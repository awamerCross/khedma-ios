import React  from 'react';
import {ScrollView, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
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
    Input,
    Textarea,
    CheckBox,
    ListItem, Right, Header
} from 'native-base';
import MapView from 'react-native-maps'
import axios        from "axios";
import {connect}   from "react-redux";
import * as Location from 'expo-location'
import I18n from "ex-react-native-i18n";
let    base_64   = [];
import CONST from '../consts';
import styles from '../../assets/style'
import {NavigationEvents} from "react-navigation";
import Modal from "react-native-modal";

import * as Permissions from 'expo-permissions';
import * as   ImagePicker from 'expo-image-picker';

let BUTTONS = [
    { text: I18n.translate('gallery_photo') ,i : 0 },
    { text: I18n.translate('camera_photo'),i : 1},
    { text: I18n.translate('gallery_video') ,i : 2},
    { text: I18n.translate('cancel'),   color: "#ff5b49" }
];

let    DESTRUCTIVE_INDEX = 3;
let    CANCEL_INDEX = 3;
let    Base64_   = [];
let    data = new FormData();
data.append('id', 2064);


class AddE3lan extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            lang: 'ar',
            video: '',
            formData :  new FormData(),
            title: '',
            price: '',
            youtube: '',
            video_base64: '',
            description: '',
            type: '',
            new_ad: '',
            image: null,
            expanded        : false,
            pressed         : [],
            city_id: null,
            selected_id: null,
            model_id: null,
            section_id: null,
            key: null,
            mobile: '',
            user_id: this.props.auth.data.id,
            is_chat: true,
            is_phone: true,
            is_location: true,
            is_refresh: true,
            country_id: null,
            imageBrowserOpen: false,
            isLoaded: false,
            cameraBrowserOpen: false,
            mapModal : false,
            photos: [],
            countries: [],
            codes: [],
            models: [],
            sections: [],
            Base64: [],
            images: [],
            base_64: [],
            parents         : [

            ],
            cities: [],
            region: {
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                latitude: 31.037933,
                longitude: 31.381523
            },
            model : null,
            years : [],
            year  : null,
            city                      : '',
            mapRegion: {
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                latitude: 31.037933,
                longitude: 31.381523
            },
            hasLocationPermissions    : false,
            initMap                   : true,
            location                  : '',
            titleStatus         : 0,
            priceStatus      : 0,
            descriptionStatus         : 0,
            mobileStatus      : 0,
            spinner : true,

            nameCountry: I18n.t('choose_country'),
            modelCountry: false,

            nameCity: I18n.t('choose_city'),
            modelCity: false,

            nameCar: I18n.t('choose_model'),
            modelCar: false,

            nameCode: I18n.t('keyCountry'),
            modelCode: false,

        };

        this.setState({lang: this.props.lang});

        axios.post(`${CONST.url}categoriesList`, {
            lang: this.props.lang ,
            parent_id : this.props.navigation.state.params.category_id
        }).then( (response)=> {
            this.setState({parents: response.data.data,spinner: false});
        });

        axios.post(`${CONST.url}countries`, {lang: this.props.lang})
            .then((response) => {
                this.setState({countries: response.data.data});
                axios.post(`${CONST.url}cities`, {lang: this.props.lang, country_id: null})
                    .then((response) => {
                        this.setState({cities: response.data.data});
                        axios.post(`${CONST.url}codes`, {lang: this.props.lang})
                            .then((response) => {
                                this.setState({codes: response.data.data});
                                this.setState({key: response.data.data[0]});
                            })
                            .catch((error) => {
                                this.setState({spinner: false});
                            }).then(() => {
                            this.setState({spinner: false});
                        });
                    }).catch((error) => {
                    this.setState({spinner: false});
                }).then(() => {
                    this.setState({spinner: false});
                });
            })
            .catch((error) => {
                this.setState({spinner: false});
            })
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

    activeInput(type) {

        if (type === 'title' || this.state.title !== '') {
            this.setState({titleStatus: 1})
        }

        if (type === 'price' || this.state.price !== '') {
            this.setState({priceStatus: 1})
        }

        if (type === 'description' || this.state.description !== '') {
            this.setState({descriptionStatus: 1})
        }

        if (type === 'mobile' || this.state.mobile !== '') {
            this.setState({mobileStatus: 1})
        }

    }

    unActiveInput(type) {

        if (type === 'title' && this.state.title === '') {
            this.setState({titleStatus: 0})
        }

        if (type === 'price' && this.state.price === '') {
            this.setState({priceStatus: 0})
        }

        if (type === 'description' && this.state.description === '') {
            this.setState({descriptionStatus: 0})
        }

        if (type === 'mobile' && this.state.mobile === '') {
            this.setState({mobileStatus: 0})
        }

    }

    async componentWillMount() {
        for(let i = 2020; i > 1990 ; i--){
            this.state.years.push(JSON.stringify(i));
        }

        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            // Toast.show({
            //     text: 'Permission to access location was denied',
            //     duration: 4000,
            //     type: 'danger',
            //     textStyle: {color: "white", textAlign: 'center'}
            // });
            CONST.showToast('Permission to access location was denied',  "danger")

        } else {

            return await Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
                maximumAge: 15000
            }).then((position) => {


                this.setState({
                    mapRegion: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                });

            }).catch(err => {
                this.setState({
                    mapRegion: {
                        latitude: 24.774265,
                        longitude: 46.738586,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                });
            });
        }


        this.setState({images: [], photos: [], Base64: [], base_64: []});
        Base64_ = [];
        base_64 = [];


    }

    async componentDidMount() {
        setTimeout(async () => {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            await Permissions.askAsync(Permissions.CAMERA);
            let { statusPr } = await Permissions.askAsync(Permissions.LOCATION);
            let location = await Location.getCurrentPositionAsync({});
            this.setState({
                initMap     : false,
                mapRegion   : location.coords
            });
            console.log('location ---------------', location)
        }, 1000);
    }

    open() {
        ActionSheet.show(
            {
                options                   : BUTTONS,
                cancelButtonIndex         : CANCEL_INDEX,
                destructiveButtonIndex    : DESTRUCTIVE_INDEX,
                title                     : 'آختر طريقه العرض'
            },
            buttonIndex => {
                this.images_video(BUTTONS[buttonIndex])
            }
        )
    }

    images_video = async (i) => {

        if (i.i === 0) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [4, 3],
                quality : .5,
             });

            let localUri = result.uri;
            let filename = localUri.split('/').pop();

            let type = 'image/jpeg';
            data.append('images[]', {
                uri: localUri,
                name: filename, type
            });

            if (!result.cancelled) {
                this.setState({
                    imageBrowserOpen: false,
                    cameraBrowserOpen: false,
                    photos: this.state.photos.concat(result.uri)
                });
            }
        } else if (i.i === 1) {

            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect      : [4, 3],
                quality     : .5,
                // base64      : true
            });

            if (result){

                let localUri = result.uri;
                let filename = localUri.split('/').pop();

                let type = 'image/jpeg';
                data.append('images[]', {
                    uri: localUri,
                    name: filename, type
                });

                this.setState({
                    photos: this.state.photos.concat(result.uri)
                });
            }

        } else if (i.i === 2) {

            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                mediaTypes: 'Videos',
                quality : .5,
            });
            if (!result.cancelled) {
                this.setState({video: result.uri ,video_base64:result.base64, image: result.uri});
            }
            let localUri = result.uri;
            let filename = localUri.split('/').pop();

            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `video/${match[1]}` : video;
            this.state.formData.append('media', {
                uri: localUri, name: filename, type
            });
        }
    };

    onFocus() {
        base_64 = [];
        Base64_ = [];
        this.componentWillMount();
    }

    componentWillUnmount(){
        base_64 = [];
        Base64_ = [];
    }

    validate = () => {

        let isError = false;
        let msg = '';

        if (this.state.photos.length === 0) {
            isError = true;
            msg = I18n.t('image_vid');
        } else if (this.state.country_id === null || this.state.country_id === '') {
            isError = true;
            msg = I18n.t('encountry');
        } else if (this.state.city_id === null || this.state.city_id === '') {
            isError = true;
            msg = I18n.t('chooCity');
        } else if (this.state.year === null && this.props.navigation.state.params.nameCar === 'car') {
            isError = true;
            msg = I18n.t('choose_model');
        } else if (this.state.title === '') {
            isError = true;
            msg = I18n.t('titleValidation');
        }   else if (this.state.description === '') {
            isError = true;
            msg = I18n.t('descriptionRequired');
        }


        if (msg !== '') {
            // Toast.show({
            //     text: msg,
            //     duration: 2000,
            //     type: "danger",
            //     textStyle: {color: "white", fontFamily: 'CairoRegular', textAlign: 'center'}
            // });
            CONST.showToast(msg,  "danger")


        }
        return isError;
    };

    delete_img(i) {
        this.state.photos.splice(i, 1);
        base_64.splice(i, 1);
        Base64_.splice(i, 1);
        this.setState({photos: this.state.photos})
    }

    async onLoginPressed() {
        const err = this.validate();
        if (!err) {
            this.setState({isLoaded: true});
            axios.post(`${CONST.url}uploadAd`,
                {
                    title          : this.state.title,
                    youtube        : this.state.youtube,
                    mobile         : this.state.mobile,
                    key            : this.state.key,
                    price          : this.state.price,
                    description    : this.state.description,
                    country_id     : this.state.country_id,
                    latitude       : this.state.mapRegion.latitude,
                    longitude      : this.state.mapRegion.longitude,
                    user_id        : this.state.user_id,
                    city_id        : this.state.city_id,
                    category_id    : this.props.navigation.state.params.category_id,
                    type           : '1',
                    is_refreshed   : this.state.is_refresh,
                    is_mobile      : this.state.is_phone,
                    model_id       : this.state.model_id,
                    section_id     : this.state.section_id,
                    is_chat        : this.state.is_chat,
                    model          : this.state.year,
                    // images         : this.state.photos
                }
            ).then((response) => {
                    if (response.data.value === '1') {
                        console.log(response.data.data)
                        this.setState({new_ad : 1})
                        data.append('id',response.data.id);
                        this.upload();
                        this.state.formData.append('id',response.data.id);
                        axios.post(`${CONST.url}uploadVideo`, this.state.formData).then((response) => {
                            // CONST.showToast(I18n.translate('image_video'),  "success")
                        }).catch((error) => {
                            // CONST.showToast(I18n.translate('image_video'),  "danger")
                        })

                    } else if (response.data.value === '2') {
                        this.setState({new_ad : 1})
                        data.append('id',response.data.id);
                        this.upload();
                        this.state.formData.append('id',response.data.id);
                        axios.post(`${CONST.url}uploadVideo`, this.state.formData).then((response) => {
                            // CONST.showToast(I18n.translate('image_video'),  "success")
                        }).catch((error) => {
                            // CONST.showToast(I18n.translate('image_video'),  "danger")
                        })
                    } else {
                        CONST.showToast(response.data.msg,  "danger")
                    }
                }).catch((error) => {}).then(() => {});
        }
    }

    renderSubmit() {
        if (this.state.isLoaded) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 30}}>
                    <ActivityIndicator size="large" color="#0070bb" />
                </View>
            )
        }
        return (
            <Button onPress={() => this.onLoginPressed()} style={styles.bgLiner}>
                <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
            </Button>
        );
    }

    upload(){

        fetch(`${CONST.url}upload_images`,{
            method : 'post',
            body:data
        }).then((res) => console.log(res.json())).then( (res) => {
                data = new FormData();
                this.setState({isLoaded: false });
                this.props.navigation.navigate('home',{
                    new_ad   : this.state.new_ad
                });
                CONST.showToast(I18n.translate('donUp'),  "success");
            }).catch((err) => {
                CONST.showToast(I18n.translate('eerrr'),  "danger")
            })
    }

    delete_video(i) {
        this.setState({image: null, video: ''})
    }

    renderImage(item, i) {
        return (
            <View key={i} style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>
                <Image
                    style={{height: '100%', width: '100%' }}
                    source={{uri: item}}
                    key={i}
                />
                <TouchableOpacity onPress={() => {
                    this.delete_img(i)
                }} style={{
                    position       : 'absolute',
                    right          :  0,
                    top            :  0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width          : '100%',
                    height         : '100%',
                    alignItems     : 'center',
                    justifyContent : 'center'
                }}>
                    <Icon name="close" style={{color: 'white', textAlign: 'center', fontSize: 22}}/>
                </TouchableOpacity>
            </View>
        )
    }

    async toggleModalMap (){

        this.setState({ mapModal: !this.state.mapModal});

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('صلاحيات تحديد موقعك الحالي ملغاه');
        }else {
            const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
            const userLocation = { latitude, longitude };
            this.setState({
                initMap     : false,
                mapRegion   : userLocation
            });
        }
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  initMap: false, mapRegion: userLocation });

    };

    _handleMapRegionChange  = async (mapRegion) =>  {
        this.setState({ mapRegion });
    };

    getLocation(){
        this.setState({ mapModal: !this.state.mapModal});
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

    render() {

        return (
            <Container style={{ backgroundColor : '#e5e5e5' }}>
                <NavigationEvents onWillFocus={() => this.onFocus()} />

                {this.renderLoader()}
                {/*<Spinner visible={this.state.spinner}/>*/}
                <Header style={styles.Header_Up}>
                    <Body style={[styles.body_header,{ flex : 1.4 , alignItems : 'center' }]}>
                    <Title style={styles.headerTitle}>{I18n.translate('add_ads')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={styles.upload}>
                        {/*<Text style={styles.textes}>{I18n.translate('add_photo')}</Text>*/}
                        <View>
                            <TouchableOpacity onPress={()=> this.open()}>
                                <View style={styles.blockUpload}>
                                    <Icon style={styles.iconUpload} active type="AntDesign" name='pluscircleo' />
                                    <Text style={[styles.textes, {color: '#FF0000' }]}>
                                        {I18n.translate('image_video')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text style={[ styles.text_black, styles.textSize_11, styles.textRegular, styles.textCenter ]}>
                                {I18n.translate('doover')}
                            </Text>
                        </View>
                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>
                        {
                            this.state.photos.map((item,i) => this.renderImage(item,i))
                        }
                    </ScrollView>

                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{marginHorizontal: 20}}>
                        {
                            (this.state.video !== '')
                                ?
                                <View style={{height: 70, width: 70, margin: 10, overflow : 'hidden', borderRadius : 5 }}>
                                    <Image source={{uri: this.state.image}} style={{height: '100%', width: '100%' }}/>
                                    <TouchableOpacity onPress={()=> {this.delete_video()}} style={{
                                        position            : 'absolute',
                                        right               : 0,
                                        top                 : 0,
                                        backgroundColor     : 'rgba(0,0,0,0.5)',
                                        width               : '100%',
                                        height              : '100%',
                                        alignItems          : 'center',
                                        justifyContent      : 'center'
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

                    {/*<KeyboardAvoidingView behavior="padding" style={{  flex: 1, width : '100%'}} >*/}

                    <View style={[ styles.block_section , { margin : 0 , marginHorizontal : 10, padding : 0 ,paddingHorizontal : 5 } ]}>

                            <View style={[ styles.item, { borderColor : (this.state.titleStatus === 1 ? '#FF0000' : '#DDD') ,borderWidth : .5 } ]} >
                                <Input
                                    // style={[styles.input,{width : '100%'}]}
                                    placeholder={ I18n.translate('title')}
                                    onChangeText={(title) => this.setState({title})}
                                    style={[styles.input, styles.height_50, { paddingRight : 10, paddingLeft : 10, color : "#121212" }]}
                                    onBlur={() => this.unActiveInput('title')}
                                    onFocus={() => this.activeInput('title')}
                                />
                            </View>

                            <View style={[ styles.item, { borderColor : (this.state.priceStatus === 1 ? '#FF0000' : '#DDD') ,borderWidth : .5 } ]} >
                                <Input
                                    // style={[styles.input,{width : '100%'}]}
                                    placeholder={ I18n.translate('price')}
                                    onChangeText={(price) => this.setState({price})}
                                    style={[styles.input, styles.height_50, { paddingRight : 10, paddingLeft : 10, color : "#121212" }]}
                                    onBlur={() => this.unActiveInput('price')}
                                    onFocus={() => this.activeInput('price')}
                                />
                            </View>

                            <View style={[ styles.item, { borderWidth : 0 } ]} >
                                <Textarea
                                    style={[ styles.textarea, { borderColor : (this.state.descriptionStatus === 1 ? '#FF0000' : '#DDD'), borderWidth : .5, paddingTop : 10} ]}
                                    onChangeText={(description)=>{ this.setState({description})}}
                                    rowSpan={5}
                                    placeholder={I18n.translate('description')}
                                    onBlur={() => this.unActiveInput('description')}
                                    onFocus={() => this.activeInput('description')}
                                />
                            </View>

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
                                            onChangeText={(mobile) => this.setState({mobile})}  value={ this.state.mobile }
                                            onBlur={() => this.unActiveInput('mobile')}
                                            onFocus={() => this.activeInput('mobile')}
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

                    <View style={[styles.rowCenter, styles.Width_100, styles.marginVertical_20, styles.bg_blue2, styles.paddingVertical_10, styles.width_200]}>
                            <Icon style={[styles.text_White, styles.textRegular, styles.textSize_14, styles.marginHorizontal_5]} type="Octicons" name='settings' />
                            <Text style={[styles.text_White, styles.textRegular, styles.textSize_14]}>{I18n.translate('configurations')}</Text>
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

                        {/*<TouchableOpacity onPress={()=>{this.props.navigation.navigate('Map',{*/}
                        {/*    latitude   : this.state.latitude,*/}
                        {/*    longitude  : this.state.longitude,*/}
                        {/*})}} style={{justifyContent:"center"  , alignItems : 'center' , flexDirection : 'row' , marginVertical : 12}}>*/}
                        {/*    <Text style={[styles.text, {*/}
                        {/*        color: CONST.color,*/}
                        {/*        fontFamily : 'CairoBold',*/}
                        {/*        textDecorationLine: 'underline',*/}
                        {/*    }]}>{I18n.translate('show_location')}</Text>*/}
                        {/*    <Icon name={'location-pin'} type={'Entypo'} style={{color: CONST.color ,fontSize : 18 ,textDecorationLine: 'underline'}}/>*/}
                        {/*</TouchableOpacity>*/}


                    <TouchableOpacity
                            onPress={() => this.toggleModalMap()}
                            style={{justifyContent:"center"  , alignItems : 'center' , flexDirection : 'row' , marginVertical : 12}}
                        >
                            <Icon name={'location-pin'} type={'Entypo'} style={{color: CONST.color ,fontSize : 18 }}/>
                            <Text style={[styles.text, {color: CONST.color, fontFamily : 'CairoBold', textDecorationLine: 'underline',}]}>{I18n.translate('sw_location')}</Text>
                        </TouchableOpacity>

                    <Modal isVisible={this.state.mapModal} onBackdropPress={() => this.toggleModalMap()}>
                            <View style={styles.model}>
                                <View style={[styles.commenter , {width:'100%'}]}>

                                    <Text style={styles.TiTle}>{I18n.translate('show_location')}</Text>

                                    {
                                        !this.state.initMap ? (
                                            <TouchableOpacity>
                                                <MapView
                                                    style={[ styles.Width_90, styles.height_250, styles.Radius_5, styles.flexCenter, styles.marginVertical_10 ]}
                                                    initialRegion={{
                                                        latitude      :  this.state.mapRegion.latitude,
                                                        longitude     :  this.state.mapRegion.longitude,
                                                        latitudeDelta : 0.0922,
                                                        longitudeDelta: 0.0421,
                                                    }}>
                                                    <MapView.Marker
                                                        draggable
                                                        coordinate={this.state.mapRegion}
                                                        onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}>
                                                        <Image source={require('../../assets/marker.png')} resizeMode={'cover'} style={{ width: 35, height: 35 }}/>
                                                    </MapView.Marker>
                                                </MapView>
                                            </TouchableOpacity>
                                        ) : (<View />)
                                    }

                                    <TouchableOpacity onPress={() => this.getLocation()} style={styles.bgLiner}>
                                        <Text style={styles.textBtn}>{I18n.translate('send')}</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </Modal>

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
export default connect(mapStateToProps,{})(AddE3lan);
