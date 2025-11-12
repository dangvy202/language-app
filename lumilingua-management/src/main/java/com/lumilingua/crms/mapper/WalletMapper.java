package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.entity.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface WalletMapper {
    WalletMapper INSTANT = Mappers.getMapper(WalletMapper.class);

    @Mapping(target = "amountLearn", constant = "0")
    @Mapping(target = "amountTopUp", constant = "0")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "idUser", source = "user.idUser")
    @Mapping(target = "walletId", source = "walletIdRd")
    Wallet createWalletByUser(User user, String walletIdRd);

    WalletResponse toWalletResponse(Wallet wallet);
}
