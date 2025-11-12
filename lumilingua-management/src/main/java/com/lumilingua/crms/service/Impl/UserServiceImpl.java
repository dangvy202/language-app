package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.mapper.UserMapper;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.service.UserService;
import com.lumilingua.crms.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final WalletService walletService;

    @Override
    @Transactional
    public Result<UserResponse> registerAccountByCustomer(UserRequest userRequest) {
        LOG.info("Register user in service...");
        if(StringUtils.hasLength(userRequest.getEmail()) && StringUtils.hasLength(userRequest.getPhone())) {
            Optional<User> userByEmail = userRepository.findUserByEmail(userRequest.getEmail());
            Optional<User> userByPhone = userRepository.findUserByPhone(userRequest.getPhone());
            if(userByEmail.isPresent() || userByPhone.isPresent()) {
                LOG.error("Unable to register because email is exist");
                return Result.badRequestError();
            } else {
                userRequest.setPassword(bCryptPasswordEncoder.encode(userRequest.getPassword()));
                User userRegister = userRepository.save(UserMapper.INSTANT.toUserEntity(userRequest));
                LOG.info("The account is register SUCCESS!");
                WalletResponse walletResponse = walletService.createWalletByUser(userRegister).getData();
                LOG.info("Create wallet of user '%s' is SUCCESS!".formatted(userRegister.getEmail()));
                userRegister.setWalletId(walletResponse.getWalletId());
                userRepository.save(userRegister);
                LOG.info("Update wallet id in table user SUCCESS!");
                UserResponse response = UserMapper.INSTANT.toUserResponse(userRegister);
                return Result.create(response);
            }
        } else {
            LOG.error("The phone and the email is required!");
            return Result.badRequestError();
        }
    }
}
