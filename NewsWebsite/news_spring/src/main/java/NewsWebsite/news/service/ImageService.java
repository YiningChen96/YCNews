package NewsWebsite.news.service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import NewsWebsite.news.model.Article;
import NewsWebsite.news.model.Image;
import NewsWebsite.news.repository.ImageRepository;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Value("${news.image.base-dir}")
    private String baseDir;

    // 上传文章图片并与文章关联
    public Image uploadArticleImage(MultipartFile file, Article article) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String relativePath = "/images/articles/" + fileName;
        File uploadFile = new File(baseDir + relativePath);
        uploadFile.getParentFile().mkdirs();
        file.transferTo(uploadFile);

        Image image = new Image();
        image.setUrl(relativePath);
        image.setArticle(article);

        return imageRepository.save(image);
    }

    // 上传背景图片（仅存储文件，不存数据库）
    public String uploadBackgroundImage(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String relativePath = "/images/backgrounds/" + fileName;
        File uploadFile = new File(baseDir + relativePath);
        uploadFile.getParentFile().mkdirs();
        file.transferTo(uploadFile);

        return relativePath;
    }

    // 获取所有背景图片
    public List<String> getAllBackgroundImages() {
        File dir = new File(baseDir + "/images/backgrounds/");
        if (!dir.exists() || !dir.isDirectory()) {
            return List.of();
        }

        return Arrays.stream(dir.listFiles())
                .filter(File::isFile)
                .map(file -> "/images/backgrounds/" + file.getName())
                .collect(Collectors.toList());
    }

    // 删除背景图片（前端传完整URL，后端提取文件名）
    public boolean deleteBackgroundImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith("/images/backgrounds/")) {
            return false;
        }

        String fileName = imageUrl.substring("/images/backgrounds/".length());
        File file = new File(baseDir + "/images/backgrounds/" + fileName);
        return file.exists() && file.isFile() && file.delete();
    }

    // 获取某篇文章的所有图片
    public List<Image> getImagesByArticleId(Long articleId) {
        return imageRepository.findByArticleId(articleId);
    }

    // 删除文章相关的所有图片
    public void deleteImagesByArticle(Article article) {
        List<Image> images = imageRepository.findByArticleId(article.getId());
        for (Image image : images) {
            deleteImage(image.getId());
        }
    }

    // 删除文章图片（包括本地文件）
    public void deleteImage(Long imageId) {
        imageRepository.findById(imageId).ifPresent(image -> {
            String fullPath = baseDir + image.getUrl();
            File file = new File(fullPath);

            if (file.exists() && file.isFile()) {
                file.delete();
            }

            imageRepository.delete(image);
        });
    }
}
