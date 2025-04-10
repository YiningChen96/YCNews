package NewsWebsite.news.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import NewsWebsite.news.model.Article;
import NewsWebsite.news.model.Image;
import NewsWebsite.news.repository.ArticleRepository;
import NewsWebsite.news.repository.ImageRepository;

@Service
public class ImageNewsService {

    @Value("${news.image.base-dir}")
    private String baseDir;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ImageRepository imageRepository;

    // 设置图片新闻（复制文章图片为图片新闻）
    public String setImageNews(Long articleId, Long imageId) throws IOException {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        String sourcePath = baseDir + image.getUrl();
        File sourceFile = new File(sourcePath);

        if (!sourceFile.exists()) {
            throw new RuntimeException("Image file not found");
        }

        String extension = sourceFile.getName().substring(sourceFile.getName().lastIndexOf("."));
        String newFileName = articleId + extension;
        String targetPath = baseDir + "/images/imagenews/" + newFileName;
        File targetFile = new File(targetPath);
        targetFile.getParentFile().mkdirs();

        deleteImageNews(articleId);

        Files.copy(sourceFile.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        return "/images/imagenews/" + newFileName;
    }

    // 获取所有图片新闻 URL
    public List<String> getAllImageNewsUrls() {
        File dir = new File(baseDir + "/images/imagenews/");
        if (!dir.exists() || !dir.isDirectory()) {
            return List.of();
        }

        return Arrays.stream(dir.listFiles())
                .filter(File::isFile)
                .map(file -> "/images/imagenews/" + file.getName())
                .collect(Collectors.toList());
    }

    // 获取指定文章的图片新闻（是否存在文件）
    public Optional<Article> getImageNewsByArticleId(Long articleId) {
        File dir = new File(baseDir + "/images/imagenews/");
        if (!dir.exists() || !dir.isDirectory()) {
            return Optional.empty();
        }

        for (File file : dir.listFiles()) {
            if (file.getName().startsWith(articleId.toString())) {
                return articleRepository.findById(articleId);
            }
        }
        return Optional.empty();
    }

    // 删除图片新闻文件
    public boolean deleteImageNews(Long articleId) {
        File dir = new File(baseDir + "/images/imagenews/");
        if (!dir.exists() || !dir.isDirectory()) {
            return false;
        }

        for (File file : dir.listFiles()) {
            if (file.getName().startsWith(articleId.toString())) {
                return file.delete();
            }
        }
        return false;
    }
}
