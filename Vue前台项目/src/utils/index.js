import {v4 as uuidv4} from 'uuid';

export const getUUid = ()=>{
    let uuid_token = localStorage.getItem('getUUid');
    if(!uuid_token){
        uuid_token = uuidv4();
        localStorage.setItem('getUUid',uuid_token);
    }
    return uuid_token;
}