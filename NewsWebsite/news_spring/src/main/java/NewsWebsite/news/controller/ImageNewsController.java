package NewsWebsite.news.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import NewsWebsite.news.service.ImageNewsService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/image-news")
public class ImageNewsController {

    @Autowired
    private ImageNewsService imageNewsService;

    // 选定某文章的某张图片作为图片新闻
    @PostMapping("/set")
    public ResponseEntity<String> setImageNews(@RequestParam Long articleId, @RequestParam Long imageId) {
        try {
            String imageUrl = imageNewsService.setImageNews(articleId, imageId);
            return ResponseEntity.ok(imageUrl); // 返回图片新闻的URL
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error setting image news: " + e.getMessage());
        }
    }

    // 获取所有图片新闻的 URL 列表
    @GetMapping("/all")
    public ResponseEntity<List<String>> getAllImageNewsUrls() {
        List<String> imageNewsUrls = imageNewsService.getAllImageNewsUrls();
        return ResponseEntity.ok(imageNewsUrls); // 返回所有图片新闻的 URL 列表
    }

    // 获取某文章的图片新闻详情
    @PostMapping("/get")
    public ResponseEntity<String> getImageNews(@RequestParam Long articleId) {
        String article = imageNewsService.getImageNewsByArticleId(articleId).get().getTitle();
        return ResponseEntity.ok(article);
    }

    // 删除某文章的图片新闻
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteImageNews(@RequestParam Long articleId) {
        boolean deleted = imageNewsService.deleteImageNews(articleId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
