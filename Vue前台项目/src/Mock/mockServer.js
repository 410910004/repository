//引入mock
import Mock from 'mockjs';
import banner from './banner';
import floor from './floor';

Mock.mock('/Mock/banner',{code:200,data:banner});
Mock.mock('/Mock/floor',{code:200,data:floor})