package com.lumilingua.crms.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ImageSourceConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Map<String,String> linkImages = new HashMap<>();
        linkImages.put("/avatars/**", "file:D:/language-app/lumilingua-management/avatars/");
        linkImages.put("/uploads/**", "file:D:/language-app/lumilingua-management/uploads/");
        for (Map.Entry<String, String> entry : linkImages.entrySet()) {
            registry.addResourceHandler(entry.getKey())
                    .addResourceLocations(entry.getValue());
        }
    }
}