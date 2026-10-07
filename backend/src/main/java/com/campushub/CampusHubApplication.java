package com.campushub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusHubApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  🎓 CampusHub Java Spring Boot API is Running!   ");
        System.out.println("  Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("  H2 Console: http://localhost:8080/h2-console    ");
        System.out.println("=================================================");
    }
}
