import React, { Component } from 'react';
import {StyleSheet, Text, Image, View, Dimensions,I18nManager, ActivityIndicator} from 'react-native';
import {Container, Content, Button, Icon, Title, Header, Body, Right,Left} from 'native-base';
import I18n from "ex-react-native-i18n";
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

        this.state = {spinner: true, text: '' , lang: this.props.lang};
    }

    componentWillMount() {
        axios.post(`${CONST.url}aboutUs`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({text: response.data.data});
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
                        <Title style={styles.headerTitle}>{I18n.translate('about_us')}</Title>
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
                                <Image style={styles.logo} source={require('../../assets/lang.png')}/>
                            </Animatable.View>
                        </View>


                        <View style={[ styles.Width_90 ]}>
                            <HTML
                                html                  = {this.state.text}
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



