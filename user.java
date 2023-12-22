/**
 *  用户相关UI 层
 */
@Controller
@RequestMapping(value = "/user")
public class UserController {
	@Autowired
	private UserService userService;
	@Autowired
	private FollowService followService;

	// 转登陆页
	@RequestMapping(value = "/login.html")
	public String login(HttpServletRequest request, HttpServletResponse response, ModelMap model) {
		// 1. 首先判断session 中 有没有用户信息
		String path = request.getServletContext().getContextPath();
		HttpSession session = request.getSession();
		/*
		 * // 判断session是否有usersession对象，有跳转至首页 if
		 * (session.getAttribute(Constants.USER_SESSION) != null) { return
		 * "redirect:/user/"+((UserModel)session.getAttribute(Constants.
		 * USER_SESSION)).getUserLogin()+"/main.html"; }
		 */

		// 第二步 判断cookie 中是否存在
		Cookie autoCookie = null;
		Cookie cookies[] = request.getCookies();
		if (cookies != null) {
			// 遍历cookie
			for (Cookie cookie : cookies) {
				// 判断cookie 中是否有autologin 标示符的cookie
				if ("autologin".equals(cookie.getName())) {
					autoCookie = cookie;// 赋值
				}
			}
			/* System.out.println("----------" + autoCookie + "------"); */
			// 判断cookie 中是否有
			if (autoCookie == null) {

				return "login";
			}
			/* System.out.println("+++++++++++" + autoCookie); */

			// 获取cookie 的值
			String value = autoCookie.getValue();
			// 拆分
			String temp[] = value.split(":");
			/* System.out.println("length::::::::;;" + temp.length); */
			// 判断长度 对否等于自己拼凑的长度
			if (temp.length != 3) {

				return "login";
			}
			String name = temp[0];
			String time = temp[1];
			String pass = temp[2];
			/*
			 * System.out.println(Long.valueOf(time) + "----- 时间------" +
			 * System.currentTimeMillis()); System.out.println(
			 * Long.valueOf(time) + "----- " + (Long.valueOf(time) >
			 * System.currentTimeMillis() ? true : false) + "------" +
			 * System.currentTimeMillis());
			 */
			// 判断是否失效
			if (Long.valueOf(time) <= System.currentTimeMillis()) {

				return "login";
			}
			// 根据cookie中的用户名去查询
			UserModel userModel = userService.userLogin(name, pass,null);
			/* System.out.println("-------- 重新查询" + userModel); */
			// 判断该用户是否存在！
			if (userModel != null) {
				// 保存session的用户信息
				session.setAttribute(Constants.USER_SESSION, userModel);

				// 跳转至首页
				return "redirect:/user/" + name + "/main.html";
			}
		}

		return "login";
	}

	// 转注册页
	@RequestMapping(value = "/register.html")
	public String register(ModelMap model) {

		return "register";
	}

	// 效验用户名是否合法
	@RequestMapping(value = "/existlogin.json", method = RequestMethod.POST)
	@ResponseBody
	public Object existLogin(@RequestParam(value = "userLogin", required = false) String userLogin) {
		HashMap<String, String> resultMap = new HashMap<String, String>();
		if (StringUtils.isBlank(userLogin)) {
			resultMap.put("userLogin", "notnull");
		} else {
			boolean flag = userService.existLogin(userLogin);
			if (flag) {
				resultMap.put("userLogin", "noexist");
				System.out.println("noexist");
			} else {
				resultMap.put("userLogin", "exist");
			}

		}
		return JSONArray.toJSONString(resultMap);
	}

	// 创建用户
	@RequestMapping(value = "/doregister.json", method = RequestMethod.POST)
	@ResponseBody
	public Object doRegister(@RequestParam String userLogin, @RequestParam String userPassword,
			@RequestParam String vaild, HttpSession session)
					throws NoSuchAlgorithmException, UnsupportedEncodingException {
		HashMap<String, String> successmap = new HashMap<String, String>();

		String _verifyCodeValue = ((String) session.getAttribute("verifyCodeValue")).toUpperCase();
		// 效验验证码
		if (!vaild.equals(_verifyCodeValue)) {
			successmap.put("error", "errorCode");
			return JSONArray.toJSONString(successmap);
		} else {
			// 效验账号是否存在
			if (!userService.existLogin(userLogin)) {
				successmap.put("error", "errorExlogin");
				return JSONArray.toJSONString(successmap);
			}
			Long userCreateType = (long) this.getUserCreateType(userLogin);
			// 调用addNewUser方法
			boolean result = userService.addNewUser(userLogin, Constants.EncodeByMd5(userPassword), userCreateType);
			// 效验是否添加成功！
			if (result) {
				successmap.put("success", "succeed");
				System.out.println("=====》账号：  " + userLogin + " 密码：" + userPassword);
			} else {
				successmap.put("error", "failure");
			}
		}
		return JSONArray.toJSONString(successmap);
	}

	// 登录效验
	@RequestMapping(value = "/dologin.json", method = RequestMethod.POST)
	@ResponseBody
	public String dologin(HttpServletRequest request, HttpServletResponse response, HttpSession session,
			@RequestParam String userLogin, @RequestParam String userPassword,
			@RequestParam(value = "autologin", required = false) boolean autologin, @RequestParam String valid,
			Map<String, Object> map) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		
		JSONObject obj = new JSONObject();
		String _verifyCodeValue = ((String) session.getAttribute("verifyCodeValue")).toUpperCase();
		// 转换成大写
		valid = valid.toUpperCase();
		if (!_verifyCodeValue.equals(valid)) {
			
			return this.getError(2,"验证码错误");
		}
		// 效验用户名或密码是否为空
		/* System.out.println("============>  " + autologin); */		
		
		
		//记录登录ip
		String ipaddr = IpUtils.getIpAddress(request);
		UserModel userModel = userService.userLogin(userLogin, Constants.EncodeByMd5(userPassword),ipaddr);
		if (userModel == null) {

			
			return this.getError("用户名或密码不正确");
		}
		if (autologin == true) {
			// 声明 cookie
			Cookie autoCookie = null;
			// 获取所有的 ｃｏｏｋｉｅ
			Cookie cookies[] = request.getCookies();
			// 遍历cookie
			for (Cookie cookie : cookies) {
				// 判断是否存在自动登录记录
				if ("autologin".equals(cookie.getName())) {
					autoCookie = cookie;// 赋值
					// 当cookie 存在的时候 我需要重新设置值
					// 将时间转为毫秒Constants.USER_COOKIE_TIME*1000
					long time = System.currentTimeMillis() + Constants.USER_COOKIE_TIME * 1000;
					String newValue = userLogin + ":" + time + ":" + Constants.EncodeByMd5(userPassword);
					cookie.setValue(newValue);
				} else {
					// 不在创建
					// 将时间转为毫秒Constants.USER_COOKIE_TIME*1000
					long time = System.currentTimeMillis() + Constants.USER_COOKIE_TIME * 1000;
					String cookieValue = userLogin + ":" + time + ":" + Constants.EncodeByMd5(userPassword);
					autoCookie = new Cookie("autologin", cookieValue);

				}

			}
			// 保存cookie
			autoCookie.setMaxAge(Constants.USER_COOKIE_TIME);
			autoCookie.setPath("/");
			response.addCookie(autoCookie);// 添加里边去了
		}
		// 把相关信息保存到session
		session.setAttribute(Constants.USER_SESSION, userModel);
		obj.put("error", 0);
		
		obj.put("message", userLogin);

		return obj.toJSONString();
	}