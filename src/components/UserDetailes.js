import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    Linking, FlatList,
    TouchableOpacity,ActivityIndicator
} from 'react-native';
import {
    Container,
    Content,
    Button,
    Icon,
    Title,
    Header,
    Body,
    Right,
} from 'native-base';

import axios from "axios";
import {NavigationEvents} from "react-navigation";
import I18n from "ex-react-native-i18n";
import CONST from '../consts';
import StarRating from 'react-native-star-rating';


import {connect} from "react-redux";
import {profile, userLogin} from "../actions";
import styles from '../../assets/style'


class UserDetailes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: null,
            rate: 0.0,
            name: '',
            avatar: '',
            id: '',
            title: '',
            img: null,
            description: '',
            ads_data: [],
            columnCount: 2,
            rated_id: '',
            AllData: [],
            rating : 0,
            city : '',
            country : '',
            phone : '',
            activated : '',
            spinner: true

        };
    }

    componentWillMount() {

        if (this.props.auth !== null) {
            this.setState({user_id: this.props.auth.data.id})
        }

        axios.post(`${CONST.url}user_details`, {
            user_id: JSON.stringify(this.props.navigation.getParam('user_id'))
        })
            .then((response) => {
                this.setState({AllData      : response.data.data.ads_data});
                this.setState({rate         : response.data.data.user.rate});
                this.setState({rated_id     : response.data.data.user.id});
                this.setState({city     : response.data.data.user.city});
                this.setState({country     : response.data.data.user.country});
                this.setState({phone     : response.data.data.user.phone});
                this.setState({name         : response.data.data.user.name});
                this.setState({avatar       : response.data.data.user.avatar});
                this.setState({activated       : response.data.data.user.activated});
            })
            .catch((error) => {
                console.warn(error);
                this.setState({spinner: false});
            }).then(() => {
            this.setState({spinner: false});
        })
    }

    onStarRatingPress(rating){

        this.setState({ rating : rating });

        if(this.props.auth !== null){

            this.setState({spinner: true});

            axios.post(`${CONST.url}rate`, {
                rated_id        : this.state.rated_id,
                user_id         : this.props.auth.data.id,
                lang            : this.props.lang,
                rate            : rating
            }).then((response) => {

                if(response.data.key === 'success'){
                    // Toast.show({
                    //     text            : (this.props.lang === 'en') ? 'rate successfully' : 'تم التقييم بنجاح',
                    //     duration        : 2000  ,
                    //     type            : "success",
                    //     textStyle           : {
                    //         color               : "white",
                    //         fontFamily          : 'CairoRegular' ,
                    //         textAlign           : 'center'
                    //     }
                    // });
                    CONST.showToast( (this.props.lang === 'en') ? 'rate successfully' : 'تم التقييم بنجاح',   "success")

                }

                this.setState({spinner: false});

            }).catch((error) => {
                console.warn(error);
                this.setState({spinner: false});
            })

        }else {
            this.props.navigation.navigate('login');
            // Toast.show({
            //     text        : I18n.t('signonly'),
            //     duration    : 2000,
            //     type        : "danger",
            //     textStyle   : {
            //         color       : "white",
            //         fontFamily  : 'CairoRegular',
            //         textAlign   : 'center'
            //     }
            // });
            CONST.showToast(  I18n.t('signonly'),   "danger")

        }
    }


    onFocus(){
        this.componentWillMount()
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

        const { width } = Dimensions.get('window');

        return (
            <Container style={{ backgroundColor : '#e5e5e5' }}>

                <NavigationEvents onWillFocus={() => this.onFocus()}/>

                {this.renderLoader()}

                <Header style={styles.Header_Up}>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                    <Body style={[ styles.body_header, styles.textHead ]}>
                        <Title style={[styles.headerTitle]}>{ this.state.name }</Title>
                    </Body>
                </Header>

                <Content>
                    <View style={{flexDirection:'row',width:'100%', padding : 10}}>
                        <TouchableOpacity style={{flexDirection:'row' ,padding : 10, overflow: 'hidden', width : '100%',borderColor: '#DDD', borderWidth: 1,}}>
                            <View style={{flexBasis:'15%', alignItems : 'center' }}>
                                <Image
                                    source={{uri:this.state.avatar}}
                                    style={{width:50,height:50, borderRadius: 50,borderWidth : 1, borderColor : '#DDD',}}
                                    resizeMode='contain'
                                />
                            </View>
                            <View style={[ styles.overHidden, styles.paddingHorizontal_10 ,{ flexBasis : '85%' } ]}>
                                <View style={[ styles.rowCol ]}>
                                    {

                                        this.state.activated == 1 ?
                                            <Image style={{ width : 23, height: 23, marginHorizontal : 5 }} resizemode={'contain'} source={require('../../assets/medal.png')}/>
                                            :
                                            <View/>
                                    }
                                    <Text style={{fontFamily  : 'CairoRegular', fontSize : 14, color : '#333', marginBottom : 5, textAlign : 'left'}}>
                                        {this.state.name}
                                    </Text>
                                </View>
                                <View style={[styles.rowRight]}>
                                    <StarRating
                                        emptyStar       = {'ios-star-outline'}
                                        fullStar        = {'ios-star'}
                                        halfStar        = {'ios-star-half'}
                                        iconSet         = {'Ionicons'}
                                        maxStars        = {5}
                                        starSize        = {15}
                                        rating          = {this.state.rating}
                                        selectedStar    = {(rating) => this.onStarRatingPress(rating)}
                                        fullStarColor   = {'#DAA520'}
                                        starStyle       = {styles.starStyle}
                                    />
                                </View>
                                <View style={{ display : 'flex' , flexDirection : 'row', alignItems  : 'center', marginVertical : 5 }}>
                                    <View style={{flexDirection:'row' , alignItems:'center',}}>
                                        <Icon style={{ color : '#bbb', fontSize : 11}} type="Feather" name='flag' />
                                        <Text style={{fontFamily  : 'CairoRegular', fontSize : 14, color : '#333', marginHorizontal: 5 }}>{this.state.country}</Text>
                                    </View>
                                    <View style={{flexDirection:'row' , alignItems:'center', marginHorizontal : 15}}>
                                        <Icon style={{ color : '#bbb', fontSize : 11}} type="FontAwesome5" name='map-marker-alt' />
                                        <Text style={{fontFamily  : 'CairoRegular', fontSize : 14, color : '#333', marginHorizontal: 5 }}>{this.state.city}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row' , alignItems:'center'}}>
                                    <Icon style={{ color : '#bbb', fontSize : 11}} type="AntDesign" name='mobile1' />
                                    <Text style={{fontFamily  : 'CairoRegular', fontSize : 14, color : '#333', marginHorizontal: 5 }}>{this.state.phone}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.block_Content , { borderBottomWidth : 0, paddingTop : 0, marginVertical : 0 }]}>
                        <TouchableOpacity onPress={()=> { Linking.openURL(`tel://${this.state.phone}`)}}>
                            <View style={[ styles.block_Call, styles.box_call, styles.marginHorizontal_10 ]}>
                                <View style={styles.marginHorizontal_5}>
                                    <Icon style={[ styles.icon_blcok, { color : '#FFF' }]} type="AntDesign" name='mobile1' />
                                </View>
                                <Text style={styles.block_Call_text}>{I18n.translate('call')}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=> {    Linking.openURL(
                            'http://api.whatsapp.com/send?phone=' + this.state.phone);}}>
                            <View style={[ styles.block_Call, styles.box_whats, styles.marginHorizontal_10 ]}>
                                <View style={styles.marginHorizontal_5}>
                                    <Icon style={[ styles.icon_blcok, { color : '#FFF' }]} type="FontAwesome" name='whatsapp' />
                                </View>
                                <Text style={styles.block_Call_text}>{I18n.translate('whats')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[ styles.rowGroup ]}>
                        <FlatList
                            horizontal={false}
                            keyExtractor={item => item.id}
                            data={this.state.AllData}
                            numColumns={this.state.columnCount}
                            key={this.state.columnCount}
                            renderItem={({item}) => {
                                return (
                                    <View style={[{
                                        borderWidth: 1,
                                        margin: 5,
                                        borderRadius: 4,
                                        borderColor: '#ccc',
                                        flexBasis  : '47.5%'
                                    }, ]}>
                                        <View style={[ styles.position_R ]}>
                                            <Image resizeMode={'cover'} style={[{height: 150, width: '100%'}]} source={{uri: item.img}}/>
                                            <Text style={[styles.textDate,{textAlign:'right',fontSize : 10 , fontFamily :'CairoBold'}]}>
                                                {I18n.translate('price')} : {item.price}
                                            </Text>
                                        </View>
                                        <View style={{ padding : 5 }}>
                                            <Text style={[styles.info, {width: 100, color: CONST.color, fontSize: 13, fontFamily: 'CairoRegular', marginBottom: 10}]} numberOfLines={1} ellipsizeMode='tail'>
                                                {item.title}
                                            </Text>
                                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems : 'center'}}>
                                                <View style={{flexDirection: 'row', alignItems : 'center'}}>
                                                    <Icon style={{fontSize : 12, marginHorizontal : 1}} active type="Feather" name='map-pin'/>
                                                    <Text style={{fontSize: 10, fontFamily: 'CairoRegular',}} numberOfLines={1} ellipsizeMode='tail'>{item.country}</Text>
                                                </View>
                                                <View style={{flexDirection: 'row', alignItems : 'center'}}>
                                                    <Icon style={{fontSize : 12, marginHorizontal : 1}} active type="Feather" name='clock'/>
                                                    <Text style={{fontSize: 10, fontFamily: 'CairoRegular'}} numberOfLines={1} ellipsizeMode='tail'>{item.date}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            }}
                        >

                        </FlatList>


                    </View>


                </Content>
            </Container>


        );
    }


}

const mapStateToProps = ({auth, lang}) => {

    return {
        auth: auth.user,
        lang: lang.lang,
        result: auth.success,
        userId: auth.user_id,
    };
};
export default connect(mapStateToProps, {userLogin, profile})(UserDetailes);


