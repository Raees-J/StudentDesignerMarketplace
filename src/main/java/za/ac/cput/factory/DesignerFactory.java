package za.ac.cput.factory;

import za.ac.cput.domain.UType.Designer;
import za.ac.cput.util.Helper;

public class DesignerFactory {
    public static Designer createDesigner(String firstName, String lastName, String email, String password, String portfolioURL) {
        if (!Helper.isValidURL(portfolioURL))
            return null;

        return new Designer.Builder()
                .setFirstName(firstName)
                .setLastName(lastName)
                .setEmail(email)
                .setPassword(password)
                .setRole("designer") // Default role
                .setPortfolioURL(portfolioURL)
                .build();
    }

    // Overloaded method for backward compatibility (without names)
    public static Designer createDesigner(String portfolioURL) {
        return createDesigner("", "", "", "", portfolioURL);
    }
}
