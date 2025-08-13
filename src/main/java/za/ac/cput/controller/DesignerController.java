package za.ac.cput.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.UType.Designer;
import za.ac.cput.service.DesignerService;
import java.util.List;
@RestController
@RequestMapping("/designer")
public class DesignerController {
    private final DesignerService designerService;
    @Autowired
    public DesignerController(DesignerService designerService) {
        this.designerService = designerService;
    }
    @PostMapping("/create")
    public ResponseEntity<Designer> create(@RequestBody Designer designer) {
        Designer createdDesigner = designerService.create(designer);
        return new ResponseEntity<>(createdDesigner, HttpStatus.CREATED);
    }
    @GetMapping("/read/{id}")
    public ResponseEntity<Designer> read(@PathVariable String id) {
        Designer designer = designerService.read(id);
        if (designer != null) {
            return new ResponseEntity<>(designer, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PutMapping("/update")
    public ResponseEntity<Designer> update(@RequestBody Designer designer) {
        Designer updatedDesigner = designerService.update(designer);
        if (updatedDesigner != null) {
            return new ResponseEntity<>(updatedDesigner, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
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
        List<Designer> designers = designerService.findDesignersByPortfolioURLContaining(keyword);
        return new ResponseEntity<>(designers, HttpStatus.OK);
    }
}
