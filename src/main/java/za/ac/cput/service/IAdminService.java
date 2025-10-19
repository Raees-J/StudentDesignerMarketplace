/**
 * Author: Justin Angelo Karoles (222008237)
 * Date: August 2025
 */

package za.ac.cput.service;

import org.springframework.stereotype.Service;
import za.ac.cput.domain.Admin;
import java.util.List;

@Service
public interface IAdminService extends IService<Admin, Long>{
    void delete(long messageId);
    List<Admin> getAll();

}
