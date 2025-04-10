package NewsWebsite.news.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import NewsWebsite.news.model.Article;
import NewsWebsite.news.repository.ArticleRepository;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ImageService imageService; // 注入 ImageService

    // 获取所有文章，但不返回 content 字段
    public List<Article> getAllArticles() {
        return articleRepository.findAllByOrderByIdDesc();
    }

    // 根据 id 获取单个文章，包括 content
    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }

    // 添加文章
    public Article addArticle(Article article) {
        return articleRepository.save(article);
    }

    // 删除文章（同时删除相关图片）
    public void deleteArticle(Long id) {
        articleRepository.findById(id).ifPresent(article -> {
            // 删除文章关联的所有图片
            imageService.deleteImagesByArticle(article);
            // 删除文章本身
            articleRepository.delete(article);
        });
    }
    
}
