@Controller
@RequestMapping("/seccode")
public class SecCodeController {
	/**
	 * 获取验证码
	 * 
	 * @param response
	 * @param session
	 */
	@RequestMapping(value="/getverifycode")
	public void generate(HttpServletResponse response, HttpSession session) {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		String verifyCodeValue = drawImg(output);
 
		session.setAttribute("verifyCodeValue", verifyCodeValue);

		try {
			ServletOutputStream out = response.getOutputStream();
			output.writeTo(out);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 绘画验证码
	 * 
	 * @param output
	 * @return
	 */
	private String drawImg(ByteArrayOutputStream output) {
		String code = "";
		// 随机产生4个字符
		for (int i = 0; i < 4; i++) {
			code += randomChar();
		}
		int width = 100;
		int height = 38;
		BufferedImage bi = new BufferedImage(width, height,
				BufferedImage.TYPE_3BYTE_BGR);
		Font font = new Font("Times New Roman", Font.PLAIN, 21);
		// 调用Graphics2D绘画验证码
		Graphics2D g = bi.createGraphics();
		g.setFont(font);
		
		Random r = new Random(); 
		int sj=r.nextInt(3)+1;
		Color color = null;
		if(sj==1){
			color = new Color(66, 2, 82);
		}else if(sj==2){
			color = new Color(0,100,0);
		}else{
			color = new Color(255,20,147);
		}
		g.setColor(color);
		g.setBackground(new Color(255,255,255));
		g.clearRect(0, 0, width, height);
		FontRenderContext context = g.getFontRenderContext();
		Rectangle2D bounds = font.getStringBounds(code, context);
		double x = (width - bounds.getWidth()) / 2;
		double y = (height - bounds.getHeight()) / 2;
		double ascent = bounds.getY();
		double baseY = y - ascent;
		g.drawString(code, (int) x, (int) baseY);
		g.dispose();
		try {
			ImageIO.write(bi, "png", output);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return code;
	}
 
	/**
	 * 随机参数一个字符
	 * 
	 * @return
	 */
	private char randomChar() {
		Random r = new Random();
		String s = "ABCDEFGHJKLMNPRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		return s.charAt(r.nextInt(s.length()));
	}

}