/**
 * Author: Justin Angelo Karoles (222008237)
 * Date: August 2025
 */

package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Admin;
import za.ac.cput.repository.AdminRepository;

import java.util.List;

@Service
public class AdminService implements IAdminService {

    private final AdminRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }



    @Override
    public Admin create(Admin admin) {
        Admin preparedAdmin = prepareAdmin(admin);
        return repository.save(preparedAdmin);
    }

    @Override
    public Admin read(Long adminId) {
        return repository.findById(adminId).orElse(null);
    }

    @Override
    public Admin update(Admin admin) {
        if (repository.existsById(admin.getId())) {
            Admin preparedAdmin = prepareAdmin(admin);
            return repository.save(preparedAdmin);
        } else {
            System.out.println("Admin with ID " + admin.getId() + " does not exist.");
            return null;
        }
    }

    @Override
    public boolean delete(Long aLong) {
        return false;
    }


    @Override
    public void delete(long adminId) {
        repository.deleteById(adminId);
    }

    @Override
    public List<Admin> getAll() {
        return repository.findAll();
    }

    public String verify(Admin admin) {
        Admin foundAdmin = repository.findByEmail(admin.getEmail());

        if (foundAdmin != null && passwordEncoder.matches(admin.getPassword(), foundAdmin.getPassword())) {
            return "success";
        } else {
            return "fail";
        }
    }

    private Admin prepareAdmin(Admin admin) {
        String encodedPassword = encodeIfNeeded(admin.getPassword());

        return new Admin.Builder()
                .setId(admin.getId())
                .setFirstName(admin.getFirstName())
                .setLastName(admin.getLastName())
                .setEmail(admin.getEmail())
                .setPassword(encodedPassword)
                .setRole("ADMIN")
                .build();
    }

    private String encodeIfNeeded(String candidate) {
        if (candidate == null || candidate.isBlank()) {
            return candidate;
        }

        String trimmed = candidate.trim();
        if (trimmed.startsWith("$2a$") || trimmed.startsWith("$2b$") || trimmed.startsWith("$2y$")) {
            return trimmed;
        }

        return passwordEncoder.encode(trimmed);
    }


}
