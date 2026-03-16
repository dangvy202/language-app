package com.lumilingua.crms.helper;

import com.lumilingua.crms.constant.CrmsConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.SecureRandom;

public class Helper {
    private static final Logger LOG = LoggerFactory.getLogger(Helper.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String getRandomStringNumeric(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be >= 1");
        }
        StringBuilder result = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(CrmsConstant.CHARACTERS.length());
            result.append(CrmsConstant.CHARACTERS.charAt(index));
        }
        return result.toString();
    }

    public static boolean deleteFile(String fileName, String directoryPath) {
        LOG.info("Delete images into server...");
        try {
            if (fileName == null || fileName.isEmpty()) {
                LOG.warn("File name is null or empty");
                return false;
            }
            Path path = Paths.get(fileName, directoryPath);
            if (Files.exists(path)) {
                Files.delete(path);
                LOG.info("File deleted successfully: {}", fileName);
                return true;
            } else {
                LOG.warn("File not found: {}", fileName);
                return false;
            }
        } catch (Exception e) {
            LOG.error("Unable to delete file from server", e);
            return false;

        }
    }

    public static String uploadFile(MultipartFile file, String directoryPath) {
        LOG.info("Upload images into server...");
        try {
            if (file == null || file.isEmpty()) {
                return null;
            }
            File directory = new File(directoryPath);
            if (!directory.exists()) {
                boolean mkdirs = directory.mkdirs();
                LOG.info("Create directory is '%s'".formatted(mkdirs));
            }
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = getRandomStringNumeric(25) + extension;

            Path path = Paths.get(directoryPath, fileName);

            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (Exception e) {
            LOG.error("Unable to upload images into server", e);
            return null;
        }
    }
}
