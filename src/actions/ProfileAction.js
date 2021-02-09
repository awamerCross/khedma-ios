import axios from 'axios';
import CONST from '../consts'
import {Toast} from "native-base";
import {AsyncStorage} from "react-native";
import I18n from "ex-react-native-i18n";


export const profile = (token ) => {

    return (dispatch) => {

         axios({
            method: 'POST',
            url: CONST.url + 'profile',
            data : {user_id : token.user_id , lang: token.lang},
        }).then(response => {
            const data = response.data;
                dispatch({type: 'profile_data', data})
        })
    }
};



export const updateProfile = (data) => {
    return async (dispatch) => {
        await axios({
            url: CONST.url + 'editProfile',
            method: 'POST',
            data: {
                name      : data.name,
                avatar     : data.avatar,
                country_id: data.country_id,
                city_id   : data.city_id,
                password  : data.password,
                mute      : data.mute,
                lang      : data.lang,
                user_id   : data.user_id,
                phone     : data.phone,
                key       : data.key,
                email     : data.email
            }}).then(response => {

                const data = response.data;
                dispatch({type: 'update_profile', data});


        }).catch(() => {
            CONST.showToast(I18n.t('eerrr'),  "danger");
        });
    }
};


export const logout = (data) => {
    return (dispatch) =>
    {
        AsyncStorage.clear();
        dispatch({type: 'logout'});
    }
};
