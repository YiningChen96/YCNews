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
import org.springframework.web.multipart.MultipartFile;

import NewsWebsite.news.model.Article;
import NewsWebsite.news.model.Image;
import NewsWebsite.news.service.ArticleService;
import NewsWebsite.news.service.ImageService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @Autowired
    private ArticleService articleService;

    // 上传文章图片并关联文章
    @PostMapping("/uploadArticleImage")
    public ResponseEntity<Image> uploadArticleImage(@RequestParam("file") MultipartFile file,
                                                    @RequestParam("articleId") Long id) throws IOException {
        Article article = articleService.getArticleById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        Image savedImage = imageService.uploadArticleImage(file, article);
        return ResponseEntity.ok(savedImage);
    }

    // 上传背景图片（返回图片 URL）
    @PostMapping("/uploadBackgroundImage")
    public ResponseEntity<String> uploadBackgroundImage(@RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = imageService.uploadBackgroundImage(file);
        return ResponseEntity.ok(imageUrl);
    }

    // 获取所有背景图片
    @GetMapping("/getAllBackgroundImages")
    public ResponseEntity<List<String>> getAllBackgroundImages() {
        List<String> imageUrls = imageService.getAllBackgroundImages();
        return ResponseEntity.ok(imageUrls);
    }

// 删除背景图片（前端传URL，而不是文件名）
@PostMapping("/deleteBackgroundImage")
public ResponseEntity<Void> deleteBackgroundImage(@RequestParam("imageUrl") String imageUrl) {
    boolean deleted = imageService.deleteBackgroundImage(imageUrl);
    return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
}

    // 获取某篇文章的所有图片
    @PostMapping("/getImagesByArticleId")
    public ResponseEntity<List<Image>> getImagesByArticleId(@RequestParam("articleId") Long articleId) {
        List<Image> images = imageService.getImagesByArticleId(articleId);
        return ResponseEntity.ok(images);
    }

    // 删除文章图片（同时删除本地文件）
    @PostMapping("/deleteImage")
    public ResponseEntity<Void> deleteImage(@RequestParam("imageId") Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
