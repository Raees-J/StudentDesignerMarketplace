package za.ac.cput.service;

import za.ac.cput.domain.UType.Designer;

import java.util.List;
import java.util.UUID;

public interface IDesignerService extends IService <Designer, UUID> {
    List<Designer> findDesignerByPortfolioURLContaining(String keyword);
    List<Designer> getAll();
}
