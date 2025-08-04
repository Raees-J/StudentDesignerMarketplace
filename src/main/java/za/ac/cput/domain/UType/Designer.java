package za.ac.cput.domain.UType;

import za.ac.cput.domain.User;

public class Designer extends User {
    private String portfolioURL;

    public Designer(Builder builder) {


    }

    public Designer(String portfolioURL) {
        this.portfolioURL = portfolioURL;
    }

    public String getPortfolioURL() {
        return portfolioURL;
    }

    @Override
    public String toString() {
        return "Designer{" +
                "portfolioURL='" + portfolioURL + '\'' +
                '}';
    }

    public static class Builder {
        private String portfolioURL;

        public Builder setPortfolioURL(String portfolioURL) {
            this.portfolioURL = portfolioURL;
            return this;
        }

        public Builder copy(Designer designer) {
            this.portfolioURL = designer.portfolioURL;
            return this;
        }
        public Designer build() {
            return new Designer(this);
        }
    }


}
