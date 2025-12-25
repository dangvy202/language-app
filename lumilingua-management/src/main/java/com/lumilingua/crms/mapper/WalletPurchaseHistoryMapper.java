package com.lumilingua.crms.mapper;

import com.lumilingua.crms.entity.WalletPurchaseHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface WalletPurchaseHistoryMapper {
    WalletPurchaseHistoryMapper INSTANT = Mappers.getMapper(WalletPurchaseHistoryMapper.class);

    @Mapping(target = "walletId", source = "walletId")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "amountType", source = "amountType")
    @Mapping(target = "amountPaid", source = "amountPaid")
    @Mapping(target = "status", source = "status")
    WalletPurchaseHistory toWalletPurchaseHistory(String walletId, String description, String amountType, BigDecimal amountPaid, String status);
}
