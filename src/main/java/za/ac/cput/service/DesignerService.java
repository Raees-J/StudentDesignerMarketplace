package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.UType.Designer;
import za.ac.cput.repository.DesignerRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Locale;

@Service
public class DesignerService implements IDesignerService {

    private final DesignerRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DesignerService(DesignerRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Designer create(Designer designer) {
        Designer preparedDesigner = prepareDesigner(designer);
        return repository.save(preparedDesigner);
    }

    @Override
    public Designer read(UUID id) {
        Optional<Designer> optionalDesigner = repository.findById(id);
        return optionalDesigner.orElse(null);
    }

    @Override
    public Designer update(Designer designer) {
        if (designer.getUserId() != null && repository.existsById(designer.getUserId())) {
            Designer preparedDesigner = prepareDesigner(designer);
            return repository.save(preparedDesigner);
        }
        return null;
    }

    @Override
    public boolean delete(UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Designer> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Designer> findDesignerByPortfolioURLContaining(String keyword) {
        return repository.findAll().stream()
                .filter(designer -> designer.getPortfolioURL() != null && designer.getPortfolioURL().contains(keyword))
                .toList();
    }

    private Designer prepareDesigner(Designer designer) {
        Designer.Builder builder = new Designer.Builder().copy(designer);
        String resolvedRole = designer.getRole() == null ? "DESIGNER" : designer.getRole().toUpperCase(Locale.ROOT);
        builder.setRole(resolvedRole);
        builder.setPassword(encodeIfNeeded(designer.getPassword()));
        return builder.build();
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
