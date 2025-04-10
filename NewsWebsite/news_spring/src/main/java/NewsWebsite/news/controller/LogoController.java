package NewsWebsite.news.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import NewsWebsite.news.service.LogoService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/logo")
public class LogoController {

    @Autowired
    private LogoService logoService;

    // 获取当前 Logo
    @GetMapping
    public ResponseEntity<String> getCurrentLogo() {
        String logo = logoService.getCurrentLogo();
        return logo != null ? ResponseEntity.ok(logo) : ResponseEntity.notFound().build();
    }

    // 替换当前 Logo
    @PostMapping("/replace")
    public ResponseEntity<String> replaceLogo(@RequestParam("file") MultipartFile file) throws IOException {
        String newLogo = logoService.replaceLogo(file);
        return ResponseEntity.ok(newLogo);
    }

    // 删除当前 Logo
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteLogo() {
        boolean deleted = logoService.deleteLogo();
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
