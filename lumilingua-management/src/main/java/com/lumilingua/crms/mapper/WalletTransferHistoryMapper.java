package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.responses.WalletTransferHistoryResponse;
import com.lumilingua.crms.entity.WalletTransferHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface WalletTransferHistoryMapper {
    WalletTransferHistoryMapper INSTANT = Mappers.getMapper(WalletTransferHistoryMapper.class);

    @Mapping(target = "fundTransferWalletId", source = "fundTransferWalletId")
    @Mapping(target = "receiveWalletId", source = "receiveWalletId")
    @Mapping(target = "balanceTransfer", source = "balanceTransfer")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "amountType", source = "amountType")
    WalletTransferHistoryResponse fundTransferWallet(String amountType, String description, BigDecimal balanceTransfer, String fundTransferWalletId, String receiveWalletId);

    @Mapping(target = "fundTransferWalletId", source = "fundTransferWalletId")
    @Mapping(target = "receiveWalletId", source = "receiveWalletId")
    @Mapping(target = "balanceTransfer", source = "balanceTransfer")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "amountType", source = "amountType")
    @Mapping(target = "status", source = "status")
    WalletTransferHistory toWalletTransferHistory(String status, String amountType, String description, BigDecimal balanceTransfer, String fundTransferWalletId, String receiveWalletId);

}
