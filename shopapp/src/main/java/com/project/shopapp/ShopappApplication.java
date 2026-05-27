package com.project.shopapp;

import com.project.shopapp.models.Role;
import com.project.shopapp.repositories.RoleRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ShopappApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopappApplication.class, args);
	}

	@Bean
	public org.springframework.boot.CommandLineRunner init(RoleRepository roleRepo) {
		return args -> {
			if (roleRepo.count() == 0) {
				roleRepo.save(Role.builder().name(Role.ADMIN).build());
				roleRepo.save(Role.builder().name(Role.USER).build());
				System.out.println(" Seed roles thành công!");
			}
		};
	}
}