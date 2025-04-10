package NewsWebsite.news.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import NewsWebsite.news.service.AdminService;
import NewsWebsite.news.service.JwtService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestParam String username, @RequestParam String password) {
        return ResponseEntity.ok(adminService.createAdmin(username, password));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteAdmin(@RequestBody Map<String, Long> requestBody) {
        Long id = requestBody.get("id");
        if (id == null) {
            return ResponseEntity.badRequest().body("ID 不能为空");
        }
        adminService.deleteAdmin(id);
        return ResponseEntity.ok("Admin deleted.");
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        String token = adminService.login(username, password);
        return ResponseEntity.ok("Bearer " + token);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String token) {
        String newToken = jwtService.refreshToken(token);
        return ResponseEntity.ok("Bearer " + newToken);
    }

    // **修改超级管理员密码**
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        adminService.changeAdminPassword(username, oldPassword, newPassword);
        return ResponseEntity.ok("密码修改成功");
    }
    
}
