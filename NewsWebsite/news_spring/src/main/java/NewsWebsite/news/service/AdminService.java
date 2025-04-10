package NewsWebsite.news.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import NewsWebsite.news.model.Admin;
import NewsWebsite.news.repository.AdminRepository;
import jakarta.annotation.PostConstruct;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void initSuperAdmin() {
        if (adminRepository.findByUsername("admin").isEmpty()) {
            createSuperAdmin();
        }
    }

    private Admin createSuperAdmin() {
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole("SUPER_ADMIN");
        return adminRepository.save(admin);
    }

    public Admin createAdmin(String username, String password) {
        if (adminRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("管理员已存在");
        }
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ADMIN");
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public String login(String username, String password) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("管理员不存在"));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        return jwtService.generateToken(username, admin.getRole());
    }

    // **修改超级管理员密码**
    public void changeAdminPassword(String username, String oldPassword, String newPassword) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("管理员不存在"));

        if (!passwordEncoder.matches(oldPassword, admin.getPassword())) {
            throw new RuntimeException("旧密码错误");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }
}
