# Student Designer Marketplace

![student_designer_marketplace_uml](https://github.com/user-attachments/assets/8c3d7240-640b-4fcd-bed8-e13dfa446368)

## Running the application

The application listens on port 8080 by default. If another process is already using that port you can override it by setting the `SERVER_PORT` environment variable before starting Spring Boot, for example:

```bash
export SERVER_PORT=8081
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
$env:SERVER_PORT="8081"
./mvnw spring-boot:run
```

You can also pass the property directly when running Maven:

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```