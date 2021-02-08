import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, I18nManager,Dimensions, ActivityIndicator } from 'react-native';
import  { Container, Content, Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import I18n from "ex-react-native-i18n";
// import Spinner from "react-native-loading-spinner-overlay";
import axios   from 'axios';
import {connect} from "react-redux";
import {profile} from "../actions";
import HTML from 'react-native-render-html';

 import * as Animatable from 'react-native-animatable';
import CONST from '../consts';
import styles from '../../assets/style'
import {NavigationEvents} from "react-navigation";


class Retreival extends Component {

    constructor(props) {
        super(props);
        this.state    = { spinner  : true, text     :   '' , retrieval : '', lang: this.props.lang };
    }
    componentWillMount() {

        axios.post(`${CONST.url}termsAndConditions`, { lang: this.props.lang  })
            .then( (response)=> {
                this.setState({
                    text     : response.data.data,
                    retrieval: response.data.retrieval,
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

                <Header style={styles.Header_Up}>
                    <Body style={[ styles.body_header , styles.textHead ]}>
                    <Title style={styles.headerTitle}>{I18n.translate('retreival')}</Title>
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
                            <Animatable.View animation="fadeInUp" easing="ease-out" delay={500}>
                                <Image style={styles.logo} source={require('../../assets/icon.png')}/>
                            </Animatable.View>
                        </View>

                        <View style={[{width: '90%'}]}>
                            <HTML
                                html={this.state.retrieval}
                                baseFontStyle={{
                                    fontSize    : 12,
                                    fontFamily  : 'CairoBold' ,
                                    textAlign   : 'left',
                                    color       : CONST.dark
                                }}
                                imagesMaxWidth={Dimensions.get('window').width}
                            />
                        </View>

                    </View>

                </Content>

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
export default connect(mapStateToProps, {profile})(Retreival);


