package com.hzblogs.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.hzblogs.service.answering.AnsweringService;
import com.hzblogs.service.message.MessageService;
import com.hzblogs.service.model.AnsweringModel;
import com.hzblogs.service.model.MessageModel;
import com.hzblogs.service.model.UserModel;
import com.hzblogs.service.user.UserService;
import com.hzblogs.tool.Constants;
import com.hzblogs.tool.PageSupport;

/**
*  留言相关UI 层
*/
@Controller
@RequestMapping("/user/lea")
public class LeaveWordsController {
	
	@Autowired
	private UserService userService;
	@Autowired
	private MessageService messageService;
	@Autowired
	private AnsweringService answeringService;
	
	
	
	@RequestMapping(value="/{userLogin}/leave.html")
	public String leave(@PathVariable(value="userLogin")String userLogin,@RequestParam(value="page",defaultValue="1")Integer page,HttpSession session,ModelMap model){
		//登录用户
		int loginUserid = ((UserModel)session.getAttribute(Constants.USER_SESSION)).getId();
		UserModel loginUserModel = userService.selectByUserId(loginUserid);
		model.addAttribute("loginUser", loginUserModel);
		//访问用户
		int userid = (userService.selectByUserLogin(userLogin)).getId();
		UserModel userModel = userService.selectByUserId(userid);
		model.addAttribute("userModel", userModel);
		//查询留言信息和留言回复信息
		PageSupport<MessageModel> pages = messageService.selectByMeUserid(userid,page);
		model.addAttribute("page", pages);
		return "leave";
	}
	//添加留言
	@RequestMapping(value="/{userLogin}/addmessage.json",method=RequestMethod.POST)
	@ResponseBody
	public String addMessage(@PathVariable(value="userLogin")String userLogin,@RequestParam(value="content")String meContent,HttpSession session){
		int userid = ((UserModel)session.getAttribute(Constants.USER_SESSION)).getId();
		//获取留言者id
		int meLeaveid =userid ;
		//获取被留言者id 
		int meUserid =(userService.selectByUserLogin(userLogin)).getId();
		
		//添加用户留言信息
		MessageModel messageModel = new MessageModel();
		messageModel.setMeLeaveid(meLeaveid);
		messageModel.setMeUserid(meUserid);
		messageModel.setMeContent(meContent);
		MessageModel _messageModel = messageService.addMessage(messageModel);
		if(null==_messageModel){
			
			return getError("添加留言失败");
		}
		
		JSONObject obj = new JSONObject();
		obj.put("error", 0);
		obj.put("messageModel", _messageModel);
		return obj.toJSONString();	
	}
	//添加留言回复
	@RequestMapping(value="addanswering.json",method=RequestMethod.POST)
	@ResponseBody
	public String addAnswering(@RequestParam(value="anUserid")Integer anUserid ,
			@RequestParam(value="anContent")String anContent,
			@RequestParam(value="anMessageid")Integer anMessageid,
			HttpSession session){
		int userid = ((UserModel)session.getAttribute(Constants.USER_SESSION)).getId();
		//获取留言回复者id
		int anLeaveid = userid;
		AnsweringModel answeringModel = new AnsweringModel();
		answeringModel.setAnLeaveid(anLeaveid);
		answeringModel.setAnUserid(anUserid);
		answeringModel.setAnMessageid(anMessageid);
		answeringModel.setAnContent(anContent);
		
		AnsweringModel _answeringModel = answeringService.addMessageAnswering(answeringModel);
		if(null==_answeringModel){
			
			return getError("添加留言失败");
		}
		
		JSONObject obj = new JSONObject();
		obj.put("error", 0);
		obj.put("answeringModel", _answeringModel);
		return obj.toJSONString();	
	}
	
	
	//删除留言信息
	@RequestMapping(value="/del/{mid}",method=RequestMethod.POST)
	@ResponseBody
	public String delMessage(@PathVariable(value="mid")Integer meId,HttpSession session){
		int userid = ((UserModel)session.getAttribute(Constants.USER_SESSION)).getId();
		
		if(!messageService.delMessageByMeIdAndMeUserid(meId,userid)){
			return getError("删除留言失败！");
		}
		
		JSONObject obj = new JSONObject();
		obj.put("error", 0);
		return obj.toJSONString();
	}
	
	
		//删除留言回复信息
		@RequestMapping(value="/delanswered/{anid}",method=RequestMethod.POST)
		@ResponseBody
		public String delAnswered(@PathVariable(value="anid")Integer anId,HttpSession session){
			int userid = ((UserModel)session.getAttribute(Constants.USER_SESSION)).getId();
			
			if(!answeringService.delAnsweredByAnId(anId)){
				return getError("删除留言回复失败！");
			}
			
			JSONObject obj = new JSONObject();
			obj.put("error", 0);
			return obj.toJSONString();
		}	
	
	
	
	
	// ======================== 工具方法 ====================================
			/**
			 * json的返回消息
			 * 
			 * @param message
			 * @return
			 */
			private String getError(String message) {
				JSONObject obj = new JSONObject();
				obj.put("error", 1);
				obj.put("message", message);
				return obj.toJSONString();
			}
}
