package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.WithdrawRequest;
import com.lumilingua.crms.dto.responses.WithdrawResponse;
import com.lumilingua.crms.entity.Withdraw;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface WithdrawMapper {
    WithdrawMapper INSTANT = Mappers.getMapper(WithdrawMapper.class);

    Withdraw toWithdraw(WithdrawRequest request);
    WithdrawResponse toWithdrawResponse(Withdraw withdraw);

}
