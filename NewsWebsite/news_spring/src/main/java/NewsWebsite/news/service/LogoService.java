package NewsWebsite.news.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LogoService {

    private final String logoDir;
    private static final String LOGO_FILE_NAME = "current_logo.png"; // 统一命名

    @Value("${news.image.base-dir}")
    private String baseDir;

    public LogoService(@Value("${news.image.base-dir}") String baseDir) {
        // 使用 baseDir 配置路径，确保图片存储路径正确
        this.logoDir = baseDir + "/images/logos/";
        File dir = new File(logoDir);
        if (!dir.exists()) {
            dir.mkdirs(); // 确保目录存在
        }
    }

    // 获取当前 Logo 的文件名（如果存在）
    public String getCurrentLogo() {
        File logoFile = new File(logoDir + LOGO_FILE_NAME);
        // 直接返回完整的 URL 路径
        if (logoFile.exists()) {
            return "http://localhost:8080/images/logos/" + LOGO_FILE_NAME; // 返回完整的 URL
        }
        return null; // 如果没有 logo 返回 null
    }

    // 替换当前 Logo（上传新 Logo，删除旧 Logo）
    public String replaceLogo(MultipartFile file) throws IOException {
        Path filePath = Paths.get(logoDir, LOGO_FILE_NAME);

        // 删除旧 Logo（如果存在）
        Files.deleteIfExists(filePath);

        // 保存新 Logo
        Files.copy(file.getInputStream(), filePath);

        return "http://localhost:8080/images/logos/" + LOGO_FILE_NAME; // 返回完整的 URL
    }

    // 删除当前 Logo
    public boolean deleteLogo() {
        File logoFile = new File(logoDir + LOGO_FILE_NAME);
        return logoFile.exists() && logoFile.delete(); // 删除 logo 文件
    }
}
