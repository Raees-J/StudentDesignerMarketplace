package za.ac.cput.controller;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import za.ac.cput.domain.UType.Designer;
import za.ac.cput.service.DesignerService;

@RestController
@RequestMapping("/designer")
public class DesignerController {
    private final DesignerService designerService;

    public DesignerController(DesignerService designerService) {
        this.designerService = designerService;
    }

    @PostMapping("/create")
    public ResponseEntity<Designer> create(@RequestBody @Valid Designer designer) {
        Designer createdDesigner = designerService.create(designer);
        return new ResponseEntity<>(createdDesigner, HttpStatus.CREATED);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Designer> read(@PathVariable UUID id) {
        Designer designer = designerService.read(id);
        if (designer != null) {
            return new ResponseEntity<>(designer, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update")
    public ResponseEntity<Designer> update(@RequestBody @Valid Designer designer) {
        Designer updatedDesigner = designerService.update(designer);
        if (updatedDesigner != null) {
            return new ResponseEntity<>(updatedDesigner, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boolean deleted = designerService.delete(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Designer>> getAll() {
        List<Designer> designers = designerService.getAll();
        return new ResponseEntity<>(designers, HttpStatus.OK);
    }

    @GetMapping("/findByPortfolioURLContaining")
    public ResponseEntity<List<Designer>> findByPortfolioURLContaining(@RequestParam String keyword) {
        List<Designer> designers = designerService.findDesignerByPortfolioURLContaining(keyword);
        return new ResponseEntity<>(designers, HttpStatus.OK);
    }
}
