import React, { Component } from 'react';
import {Text, Image, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Container, Content, Button, Icon, Title, Header, Body, Right} from 'native-base';
import I18n from "ex-react-native-i18n";
import axios from "axios";
import {connect} from "react-redux";
import {profile} from "../actions";
import CONST from '../consts';
import styles from '../../assets/style'
import {NavigationEvents} from "react-navigation";



class SubCategory extends Component {

    constructor(props) {
        super(props);

        this.state = {spinner: true, text: '', categories : [] , lang : this.props.lang};
    }
    componentWillMount() {

        if(this.props.navigation.state.params.type ===  1)
        {
            this.setState({page    : 'forme3lan'});

        }else {
            this.setState({page    : 'forme3lan_photo'});
        }

        axios.post(`${CONST.url}sub_categories`, { lang: this.props.lang , id : this.props.navigation.state.params.category_id  })
            .then( (response)=> {
                this.setState({categories: response.data.data});
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

                {this.renderLoader()}
                <NavigationEvents onWillFocus={() => this.onFocus()}/>

                <Header style={styles.Header_Up}>
                    <Body style={styles.body_header}>
                        <Title style={styles.headerTitle}>{I18n.translate('sub_category')}</Title>
                    </Body>
                    <Right style={[ styles.RightDir ]}>
                        <Button transparent onPress={()=> this.props.navigation.goBack()} >
                            <Icon style={styles.icons} type="AntDesign" name={ (this.state.lang !== 'ar' || this.state.lang == null) ? 'right' : 'left' }/>
                        </Button>
                    </Right>
                </Header>

                <Content>

                    <View style={styles.blockAboutCate}>

                        {

                            this.state.categories.map((item, key) => (
                                <TouchableOpacity key={key} onPress={()=> { this.props.navigation.navigate(this.state.page,{
                                    category_id : this.props.navigation.state.params.category_id,
                                    sub_category_id : item.id,
                                })}}>
                                    <View style={{justifyContent:'space-between',flexDirection :'row', alignSelf : 'center' , alignItems : 'center' ,borderRadius: 5,marginVertical : 10 ,padding :10, borderWidth:.5,borderColor :'#e7e7e7', width : '90%'}}>
                                        <Text>
                                            <Icon style={styles.icon_user} type="AntDesign" name='right' />
                                        </Text>
                                        <View style={{flexDirection :'row',alignItems : 'center' }}>
                                            <Text style={[styles.text,{lineHeight: 50, fontSize : 16, marginHorizontal : 10}]}>{item.name}</Text>
                                            <Image style={styles.slide_cate} source={{uri:item.icon}}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            ))

                        }



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
export default connect(mapStateToProps,{profile})(SubCategory);



