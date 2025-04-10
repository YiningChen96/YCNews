package NewsWebsite.news.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import NewsWebsite.news.model.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // 使用 @EntityGraph 来避免加载不必要的字段，排除 content 字段
    @EntityGraph(attributePaths = {"id", "title"})  // 只加载 id 和 title 字段
    List<Article> findAllByOrderByIdDesc(); // 根据 id 倒序查询所有文章
    List<Article> findByIdNotIn(List<Long> ids);
}
