package com.nexus.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner checkDatabase(DataSource dataSource) {
		return args -> {
			try (Connection connection = dataSource.getConnection()) {

				System.out.println("\n=================================");
				System.out.println("CONNECTED DATABASE: " + connection.getCatalog());
				System.out.println("CONNECTED USER: " + connection.getMetaData().getUserName());
				System.out.println("DATABASE URL: " + connection.getMetaData().getURL());
				System.out.println("=================================\n");

			}
		};
	}
}