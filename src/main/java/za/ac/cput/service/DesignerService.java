package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.UType.Designer;
import za.ac.cput.repository.DesignerRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DesignerService implements IDesignerService {

    private final DesignerRepository repository;

    @Autowired
    public DesignerService(DesignerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Designer create(Designer designer) {
        return repository.save(designer);
    }

    @Override
    public Designer read(UUID id) {
        Optional<Designer> optionalDesigner = repository.findById(id);
        return optionalDesigner.orElse(null);
    }

    @Override
    public Designer update(Designer designer) {
        if (designer.getUserId() != null && repository.existsById(designer.getUserId())) {
            return repository.save(designer);
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
}
