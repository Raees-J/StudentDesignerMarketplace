/**
 * Author: Justin Angelo Karoles (222008237)
 * Date: August 2025
 */

package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Admin;
import za.ac.cput.repository.AdminRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService implements IAdminService {

    private final AdminRepository repository;

    @Autowired
    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }



    @Override
    public Admin create(Admin admin) {
        Admin newAdmin = new Admin.Builder()
                .setId(admin.getId())
                .setFirstName(admin.getFirstName())
                .setLastName(admin.getLastName())
                .setEmail(admin.getEmail())
                .setPassword(admin.getPassword())
                .setRole("ADMIN")
                .build();

        return repository.save(newAdmin);
    }

    @Override
    public Admin read(Long adminId) {
        return repository.findById(adminId).orElse(null);
    }

    @Override
    public Admin update(Admin admin) {
        if (repository.existsById(admin.getId())) {
            Admin updatedAdmin = new Admin.Builder()
                    .setId(admin.getId())
                    .setFirstName(admin.getFirstName())
                    .setLastName(admin.getLastName())
                    .setEmail(admin.getEmail())
                    .setPassword(admin.getPassword())
                    .setRole("ADMIN")
                    .build();

            return repository.save(updatedAdmin);
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
        Optional<Admin> foundAdmin = repository.findByEmail(admin.getEmail());

        if (foundAdmin != null && foundAdmin.getClass().equals(admin.getPassword())) {
            return "success";
        } else {
            return "fail";
        }
    }


}
