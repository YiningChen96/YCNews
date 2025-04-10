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
@RequestMapping("/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ImageService imageService;

    // 获取所有文章，但不返回 content 字段
    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    // 根据 id 获取单个文章，包括 content
    @PostMapping("/getArticle")
    public ResponseEntity<Article> getArticleById(@RequestParam Long id) {
        return articleService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 添加文章（包括图片上传）
    @PostMapping("/add")
    public ResponseEntity<Article> addArticle(@RequestParam("title") String title,
                                              @RequestParam("content") String content,
                                              MultipartFile[] files) throws IOException {
        // 创建文章对象
        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        
        // 保存文章
        article = articleService.addArticle(article);

        // 如果有上传图片，则上传并关联到文章
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                imageService.uploadArticleImage(file, article);
            }
        }

        return ResponseEntity.ok(article);
    }
    // 删除文章（同时删除其关联图片及本地存储的文件）
    @PostMapping("/deleteArticle")
    public ResponseEntity<Void> deleteArticle(@RequestParam Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    // 获取某篇文章的所有图片
    @PostMapping("/getImagesByArticleId")
    public List<Image> getImagesByArticleId(@RequestParam Long id) {
        return imageService.getImagesByArticleId(id);
    }

    // 删除文章图片（同时删除本地文件）
    @PostMapping("/deleteArticleImage")
    public ResponseEntity<Void> deleteArticleImage(@RequestParam Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }


    // 删除背景图片（通过 URL 删除）
    @PostMapping("/deleteBackgroundImage")
    public ResponseEntity<Void> deleteBackgroundImage(@RequestParam String imageUrl) {
        boolean deleted = imageService.deleteBackgroundImage(imageUrl);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // 获取所有背景图片
    @GetMapping("/getAllBackgroundImages")
    public List<String> getAllBackgroundImages() {
        return imageService.getAllBackgroundImages();
    }
}
