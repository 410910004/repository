/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80028
 Source Host           : localhost:3306
 Source Schema         : test2

 Target Server Type    : MySQL
 Target Server Version : 80028
 File Encoding         : 65001

 Date: 25/04/2023 10:53:37
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attendance
-- ----------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance`  (
  `id` int(0) NOT NULL,
  `no` int(0) NULL DEFAULT NULL COMMENT '学生学号',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生姓名',
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生性别',
  `msg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '签到信息',
  `time` datetime(0) NULL DEFAULT NULL COMMENT '签到时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of attendance
-- ----------------------------
INSERT INTO `attendance` VALUES (1, 212206644, '张三', '男', '已签到', NULL);
INSERT INTO `attendance` VALUES (2, 212211112, '李四', '男', '已签到', NULL);
INSERT INTO `attendance` VALUES (3, 2324, 'jake', '男', '已签到', NULL);
INSERT INTO `attendance` VALUES (4, 234235, '小张', '男', '已签到', NULL);
INSERT INTO `attendance` VALUES (5, 2342352, '小李', '男', '已签到', NULL);
INSERT INTO `attendance` VALUES (6, 23453243, '小四', '女', '已签到', NULL);
INSERT INTO `attendance` VALUES (7, 3242523, '小五', '女', '未签到', NULL);
INSERT INTO `attendance` VALUES (8, 2352342, '小刘', '女', '未签到', NULL);
INSERT INTO `attendance` VALUES (9, 332235, '小航', '女', '未签到', NULL);
INSERT INTO `attendance` VALUES (10, 324524, '12543', '女', '未签到', NULL);
INSERT INTO `attendance` VALUES (11, 5324324, '1241', '女', '未签到', NULL);

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class`  (
  `id` int(0) NOT NULL,
  `className` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `num` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of class
-- ----------------------------

-- ----------------------------
-- Table structure for face_info
-- ----------------------------
DROP TABLE IF EXISTS `face_info`;
CREATE TABLE `face_info`  (
  `x` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `y` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `w` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `h` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of face_info
-- ----------------------------

-- ----------------------------
-- Table structure for info
-- ----------------------------
DROP TABLE IF EXISTS `info`;
CREATE TABLE `info`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `adname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '管理员姓名',
  `identity` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '身份',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of info
-- ----------------------------
INSERT INTO `info` VALUES (1, 'admin', '111111', '	\r\n陈海逸', '管理员');
INSERT INTO `info` VALUES (2, 'liuTeacher', '111111', '刘老师', '教师');

-- ----------------------------
-- Table structure for sit
-- ----------------------------
DROP TABLE IF EXISTS `sit`;
CREATE TABLE `sit`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `stuId` int(0) NOT NULL COMMENT '学生表id',
  `isfocus` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否专注',
  `x` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '坐标',
  `y` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '坐标',
  `w` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '坐标',
  `h` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '坐标',
  `img` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生坐姿图片',
  `updateTime` datetime(0) NULL DEFAULT NULL COMMENT '坐姿上传时间',
  `start` int(0) NOT NULL COMMENT '坐姿是否合格',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sit
-- ----------------------------
INSERT INTO `sit` VALUES (1, 3, '3', '4', '4', '4', '4', 'sit/1/c4fb0b75-7178-4004-bb37-c930998addff7.png', '2023-03-31 18:39:17', 1);
INSERT INTO `sit` VALUES (2, 3, '3', '2', '4', '3', '5', 'sit/2/287e7748-81c6-41d0-8275-d9cdad62d8cb2.jpg', '2023-04-08 13:57:11', 0);
INSERT INTO `sit` VALUES (3, 3, '52', '2', '3', '21', '2', 'sit/3/f1b68232-991f-40de-8156-98775299b11e8.png', '2023-04-08 13:59:05', 1);
INSERT INTO `sit` VALUES (4, 4, '2', '2', '2', '2', '2', 'sit/4/6b34b495-eb1d-44ae-a441-0f3056fe49a15.jpg', '2023-04-09 15:03:01', 1);
INSERT INTO `sit` VALUES (5, 5, '3', '3', '3', '3', '3', 'sit/5/f5997675-e861-4d92-8d25-f668419611d04.jpg', '2023-04-09 15:19:21', 1);

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `no` int(0) NOT NULL COMMENT '学生学号',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学生姓名',
  `age` int(0) NULL DEFAULT NULL COMMENT '学生年龄',
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生性别',
  `classname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '班级',
  `img` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学生头像',
  `base` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT 'base64位图片',
  `teacherid` int(0) NULL DEFAULT NULL COMMENT '教师id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES (1, 212206612, '李涛', 23, '男', '班级2', 'student/1/25d6f4a0-1e70-4c80-b647-160b62d2d2491.png', NULL, NULL);
INSERT INTO `student` VALUES (2, 212206666, '俊彦', 23, '男', '班级2', 'student/2/0dcb7bb7-ff37-4c43-b74a-ca93839186542.png', NULL, NULL);
INSERT INTO `student` VALUES (3, 212206611, '冠宇', 24, '男', '班级2', 'student/14/9ad1b963-5b30-442b-974f-00bd02eb38752.png', NULL, NULL);
INSERT INTO `student` VALUES (4, 212206615, '李宇', 22, '女', '班级1', 'student/4/a392e930-f168-4cd4-877e-3196a4f55a844.png', NULL, 0);
INSERT INTO `student` VALUES (5, 212206632, '李峰', 24, '男', '班级1', 'student/5/35123730-ba0d-458d-9851-941e2d559ce95.png', NULL, 0);
INSERT INTO `student` VALUES (6, 212206621, '铭扬', 23, '男', '班级2', 'student/6/fedb44ab-1bf8-48af-8c42-8de1c0d793214.png', NULL, NULL);
INSERT INTO `student` VALUES (7, 212206633, '明轩', 23, '男', '班级2', 'student/7/f7d53994-2e42-4c6f-a2ff-1a3bfeddced33.png', NULL, NULL);
INSERT INTO `student` VALUES (8, 212206635, '天翊', 22, '男', '班级2', 'student/8/bbb88472-08de-405e-b974-8fcbbf1d7ac86.png', NULL, NULL);
INSERT INTO `student` VALUES (9, 212206668, '玉枫', 23, '女', '班级2', 'student/9/cd7419fb-a253-4f92-9495-07f1e7c909a47.png', NULL, NULL);
INSERT INTO `student` VALUES (10, 212206670, '苏晚', 23, '女', '班级2', 'student/10/c92da0f1-88bb-4ed7-a7dc-9a3ac7d798945.png', NULL, NULL);
INSERT INTO `student` VALUES (11, 212206607, '贺杰', 21, '男', '班级1', 'student/11/31f70f12-6c53-4c5e-a1d2-b99a7526d3fa9.png', NULL, 0);
INSERT INTO `student` VALUES (12, 212206605, '振波', 24, '男', '班级1', 'student/12/b417128d-80a9-4c08-9f0e-41419d9655a410.png', NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;
