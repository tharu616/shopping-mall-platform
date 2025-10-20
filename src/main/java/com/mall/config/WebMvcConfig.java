package com.mall.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload.directory:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from /profile-pictures/** URLs
        registry.addResourceHandler("/profile-pictures/**")
                .addResourceLocations("file:" + uploadDir + "/profile-pictures/");

        // You can add more mappings for other file types
        registry.addResourceHandler("/receipts/**")
                .addResourceLocations("file:" + uploadDir + "/receipts/");
    }
}
