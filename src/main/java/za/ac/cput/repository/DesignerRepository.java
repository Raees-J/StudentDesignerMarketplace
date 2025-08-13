package za.ac.cput.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.UType.Designer;

import java.util.List;

@Repository
public interface DesignerRepository extends JpaRepository<Designer, String> {
   List<Designer> findDesignerByPortfolioURL(String portfolioURL);
}
