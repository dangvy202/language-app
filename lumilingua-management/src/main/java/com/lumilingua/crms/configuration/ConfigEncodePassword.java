package com.lumilingua.crms.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class ConfigEncodePassword {
    @Bean
    public BCryptPasswordEncoder passwordEnCoder() {
        return new BCryptPasswordEncoder();
    }
}