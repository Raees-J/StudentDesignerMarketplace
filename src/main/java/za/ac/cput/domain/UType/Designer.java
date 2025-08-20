package za.ac.cput.domain.UType;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import za.ac.cput.domain.User;

@Entity
@PrimaryKeyJoinColumn(name = "userId")

public class Designer extends User {
    private String portfolioURL;

    protected Designer() {

    }

    public Designer(Builder builder) {
        super(builder.email, builder.password, builder.role);
        this.portfolioURL = builder.portfolioURL;
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
        private String email;
        private String password;
        private String role;
        private String portfolioURL;

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder setRole(String role) {
            this.role = role;
            return this;
        }

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
