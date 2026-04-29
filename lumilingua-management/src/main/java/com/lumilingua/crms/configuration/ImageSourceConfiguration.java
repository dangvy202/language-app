package com.lumilingua.crms.configuration;

import com.lumilingua.crms.constant.CrmsConstant;
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
        linkImages.put("/" + CrmsConstant.Directory.AVATAR_DIR + "/**", CrmsConstant.Path.AVATAR_PATH);
        linkImages.put("/" + CrmsConstant.Directory.UPLOAD_DIR + "/**", CrmsConstant.Path.UPLOAD_PATH);
        linkImages.put("/" + CrmsConstant.Directory.EVIDENCE_DIR + "/**", CrmsConstant.Path.EVIDENCE_PATH);
        linkImages.put("/" + CrmsConstant.Directory.CATEGORY_DIR + "/**", CrmsConstant.Path.CATEGORIES_PATH);
        for (Map.Entry<String, String> entry : linkImages.entrySet()) {
            registry.addResourceHandler(entry.getKey())
                    .addResourceLocations(entry.getValue());
        }
    }
}