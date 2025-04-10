package NewsWebsite.news.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import NewsWebsite.news.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {

    // 根据文章ID获取所有图片
    List<Image> findByArticleId(Long articleId);

}
