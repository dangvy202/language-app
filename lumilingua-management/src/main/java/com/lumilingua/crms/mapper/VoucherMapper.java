package com.lumilingua.crms.mapper;

import com.lumilingua.crms.dto.requests.VoucherRequest;
import com.lumilingua.crms.dto.responses.VoucherResponse;
import com.lumilingua.crms.entity.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
    VoucherMapper INSTANT = Mappers.getMapper(VoucherMapper.class);

    Voucher toVoucherEntity(VoucherRequest request);

    VoucherResponse toVoucherResponse(Voucher voucher);

    void updateVoucher(VoucherRequest request, @MappingTarget Voucher voucher);

}
