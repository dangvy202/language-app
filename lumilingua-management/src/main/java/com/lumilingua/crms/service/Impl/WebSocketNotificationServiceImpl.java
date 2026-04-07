package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.service.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationServiceImpl implements WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyContractUpdate(Long id, String message, BigDecimal price, boolean isUser) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("message", message);
        payload.put("price", price != null ? price.toString() : null);
        payload.put("isUser", isUser);
        payload.put("timestamp", System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/contracts/" + id, payload);
    }
}
