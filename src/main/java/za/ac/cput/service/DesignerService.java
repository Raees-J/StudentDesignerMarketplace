package za.ac.cput.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.UType.Designer;
import za.ac.cput.repository.DesignerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DesignerService implements IDesignerService{

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
    public Designer read(String id) {
        Optional<Designer> optionalDesigner = repository.findById(id);
        return optionalDesigner.orElse(null);
    }

    @Override
    public Designer update(Designer designer) {
        if (repository.existsById(designer.getPortfolioURL())) { // Assuming portfolioURL is the ID for simplicity
            return repository.save(designer);
        }
        return null; // Or throw an exception if the designer doesn't exist
    }
    @Override
    public boolean delete(String id) {
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
    public List<Designer> findDesignersByPortfolioURLContaining(String keyword) {
        // This method would require a custom query in the DesignerRepository
        // For now, we'll just return all designers and filter in memory (not efficient for large datasets)
        // In a real application, you'd add a method like:
        // List<Designer> findByPortfolioURLContaining(String keyword); to DesignerRepository
        return repository.findAll().stream()
                .filter(designer -> designer.getPortfolioURL() != null && designer.getPortfolioURL().contains(keyword))
                .toList();
    }


}
