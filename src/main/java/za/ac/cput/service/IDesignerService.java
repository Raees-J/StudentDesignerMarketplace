package za.ac.cput.service;

import za.ac.cput.domain.UType.Designer;

import java.util.List;

public interface IDesignerService extends IService <Designer, String> {
    List<Designer> findDesignersByPortfolioURLContaining(String keyword);
    List<Designer> getAll();
}
