package NewsWebsite.news.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import NewsWebsite.news.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);
}
