package com.lumilingua.crms.service;

import java.math.BigDecimal;

public interface WebSocketNotificationService {
    void notifyContractUpdate(Long userId, String message, BigDecimal price, boolean isUser);
}
