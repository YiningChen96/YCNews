package NewsWebsite.news.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FallbackController {
 
    @RequestMapping(value = "/home")
    public String redirect() {
        return "forward:/index.html";
    }
    
}
