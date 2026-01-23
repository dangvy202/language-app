package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.VoucherRequest;
import com.lumilingua.crms.dto.responses.VoucherResponse;
import com.lumilingua.crms.entity.Voucher;
import com.lumilingua.crms.mapper.VoucherMapper;
import com.lumilingua.crms.repository.VoucherRepository;
import com.lumilingua.crms.service.VoucherService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private static final Logger LOG = LoggerFactory.getLogger(VoucherServiceImpl.class);

    private final VoucherRepository voucherRepository;

    @Override
    public Result<VoucherResponse> createVoucher(VoucherRequest request) {
        LOG.info("Create voucher in service...");
        try {
            Voucher voucher = voucherRepository.save(VoucherMapper.INSTANT.toVoucherEntity(request));
            VoucherResponse response = VoucherMapper.INSTANT.toVoucherResponse(voucher);
            LOG.info("Create voucher is SUCCESS!");
            return Result.create(response);
        } catch (Exception e) {
            String msg = "Unable to create voucher!";
            LOG.error(msg);
            return Result.serverError(msg);
        }
    }

    @Override
    public Result<VoucherResponse> updateVoucher(int idVoucher, VoucherRequest request) {
        LOG.info("Update voucher on voucher table in service...");
        try {
            Voucher voucherUpdate = voucherRepository.findById(idVoucher)
                    .map(voucher -> {
                        VoucherMapper.INSTANT.updateVoucher(request, voucher);
                        return voucherRepository.save(voucher);
            }).orElseThrow(() -> new RuntimeException("Unable to get Voucher by ID '%s'".formatted(idVoucher)));
            LOG.info("Update voucher is SUCCESS: '%s'".formatted(voucherUpdate));
            return Result.update();
        } catch (Exception e) {
            String msg = "Unable to update voucher '%s'".formatted(idVoucher);
            LOG.error(msg);
            return Result.badRequestError(msg);
        }
    }

    @Override
    public Result<List<VoucherResponse>> getAllVoucher() {
        LOG.info("Get all voucher in service...");
        List<VoucherResponse> responses = voucherRepository.findAll().stream()
                .map(VoucherMapper.INSTANT::toVoucherResponse).toList();
        return Result.getAll(responses);
    }

    @Override
    public Result<VoucherResponse> getVoucherById(int id) {
        LOG.info("Get voucher by id '%s' in service...".formatted(id));
        try {
            VoucherResponse voucher = voucherRepository.findById(id)
                    .map(VoucherMapper.INSTANT::toVoucherResponse)
                    .orElseThrow(() -> new RuntimeException("Unable to get voucher by id '%s'".formatted(id)));
            return Result.get(voucher);
        } catch (Exception ex) {
            String msg = "Unable to get voucher by id '%s'".formatted(id);
            LOG.error(msg);
            return Result.badRequestError(msg);
        }
    }

    @Override
    public Result<VoucherResponse> deleteVoucherById(int id) {
        LOG.info("Delete voucher by id '%s' in service...".formatted(id));
        Voucher response = voucherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unable to get voucher by id '%s'".formatted(id)));
        try {
            voucherRepository.deleteById(Integer.parseInt(String.valueOf(response.getIdVoucher())));
            LOG.info("Delete voucher is SUCCESS!");
            return Result.delete();
        } catch (RuntimeException e) {
            LOG.error("Delete voucher is FALIED!");
            throw new RuntimeException(e.getMessage());
        }

    }
}
