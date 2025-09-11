package za.ac.cput.factory;

import za.ac.cput.domain.UType.Designer;
import za.ac.cput.util.Helper;

public class DesignerFactory {
    public static Designer createDesigner(String portfolioURL) {
        if (!Helper.isValidURL(portfolioURL))
            return null;

        return new Designer.Builder()
                .setPortfolioURL(portfolioURL)
                .build();

    }
}
