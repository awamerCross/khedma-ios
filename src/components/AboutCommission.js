import React, { Component } from 'react';
import {Image, View, Dimensions,I18nManager, ActivityIndicator} from 'react-native';
import {Container, Content, Button, Icon, Title, Header, Body, Right} from 'native-base';
import I18n from "ex-react-native-i18n";
// import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import styles from '../../assets/style'
import HTML from "react-native-render-html";
import {NavigationEvents} from "react-navigation";
import * as Animatable from 'react-native-animatable';

class About extends Component {

    constructor(props) {
        super(props);

        this.state = {spinner: true, textHead: '' , textInfo: '' , lang : this.props.lang};
        this.setState({spinner: true});
    }

    componentWillMount() {
        axios.post(`${CONST.url}commission_info`, { lang: I18n.currentLocale()  })
            .then( (response)=> {
                this.setState({
                    textHead: response.data.data.site_commission,
                    textInfo: response.data.data.site_commission_notes
                });
            })
            .catch( (error)=> {
                this.setState({spinner: false});
            }).then(()=>{
                this.setState({spinner: false});
            });
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
        return (
            <Container style={{ backgroundColor : '#e5e5e5' }}>

                <NavigationEvents onWillFocus={() => this.onFocus()}/>
                {this.renderLoader()}

                <Header style={[styles.Header_Up]}>
                    <Body  style={[styles.body_header, styles.textHead]}>
                        <Title style={styles.headerTitle}>{I18n.translate('AboutCommission')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                </Header>
                <Content>

                    <View style={styles.blockAbout}>

                        <View style={styles.overHidden}>
                            <Animatable.View animation="zoomIn" easing="ease-out" delay={1000}>
                                <Image style={styles.logo} source={require('../../assets/logo.png')}/>
                            </Animatable.View>
                        </View>

                        <View style={[ styles.Width_90 ]}>
                            <HTML
                                html                  = {this.state.textHead}
                                imagesMaxWidth        = {Dimensions.get('window').width}
                                baseFontStyle         = {{
                                    fontSize            : 14,
                                    fontFamily          : 'CairoRegular' ,
                                    color               : CONST.dark,
                                    writingDirection    : I18nManager.isRTL ? 'rtl' : 'ltr'
                                }}
                            />
                            <HTML
                                html                  = {this.state.textInfo}
                                imagesMaxWidth        = {Dimensions.get('window').width}
                                baseFontStyle         = {{
                                    fontSize            : 14,
                                    fontFamily          : 'CairoRegular' ,
                                    color               : CONST.dark,
                                    writingDirection    : I18nManager.isRTL ? 'rtl' : 'ltr'
                                }}
                            />
                        </View>

                    </View>

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
export default connect(mapStateToProps,{profile})(About);



