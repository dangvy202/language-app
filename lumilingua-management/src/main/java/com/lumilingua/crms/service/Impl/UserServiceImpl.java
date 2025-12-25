package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.AuthenticationRequest;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.enums.StatusEnum;
import com.lumilingua.crms.mapper.UserMapper;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.security.UserDetail;
import com.lumilingua.crms.service.JwtService;
import com.lumilingua.crms.service.UserService;
import com.lumilingua.crms.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);
    // Repository
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    // Service
    private final WalletService walletService;
    private final JwtService jwtService;
    private final RedisTemplate<String , String> redisTemplate;

    @Override
    @Transactional
    public Result<UserResponse> registerAccountByCustomer(UserRequest userRequest) {
        LOG.info("Register user in service...");
        if(StringUtils.hasLength(userRequest.getEmail()) && StringUtils.hasLength(userRequest.getPhone())) {
            Optional<User> userByEmail = userRepository.findUserByEmail(userRequest.getEmail());
            Optional<User> userByPhone = userRepository.findUserByPhone(userRequest.getPhone());
            Optional<User> userByName = userRepository.findUserByUsername(userRequest.getUsername());

            if(userByEmail.isPresent() || userByPhone.isPresent() || userByName.isPresent()) {
                LOG.error("Unable to register because email or phone or username is exist");
                return Result.badRequestError("Unable to register because email or phone or username is exist");
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
            return Result.badRequestError("The phone and the email is required!");
        }
    }

    public Result<AuthenticationResponse> getTokenInRedis(String keyRedis) {
        String tokenRedis = redisTemplate.opsForValue().get(keyRedis);
        long expired = redisTemplate.getExpire(keyRedis);
        long expiredConvertMilisecon = TimeUnit.MILLISECONDS.convert(expired,TimeUnit.SECONDS);
        long timeNow = TimeUnit.MILLISECONDS.convert(System.currentTimeMillis(),TimeUnit.MILLISECONDS);
        if(timeNow > expiredConvertMilisecon) {
            redisTemplate.delete(keyRedis);
            return Result.forbiden("The user is NOT exists!");
        }
        else if (tokenRedis.isEmpty() ) {
            return Result.forbiden("The user is NOT exists!");
        } else{
            return Result.create(AuthenticationResponse.builder().expired(String.valueOf(expired)).token(tokenRedis).build());
        }
    }

    @Override
    public Result<AuthenticationResponse> login(AuthenticationRequest request) {
        User userEntity = userRepository.findUserByEmail(request.getEmail()).orElse(null);

        if (userEntity == null) {
            return Result.forbiden("The user is NOT exists!");
        }
        if (userEntity.getStatus() != StatusEnum.ACTIVE) {
            return Result.unauthorized("The status user is NOT active");
        }
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            long secondExpired = (System.currentTimeMillis() + 1000 * 60 * 24);
            long dateExpired = new Date(secondExpired).getTime();
            UserDetail userDetail = new UserDetail(userEntity);
            String jwtToken = jwtService.generateToken(userDetail);
            String keyRedis = UUID.randomUUID().toString();
            //save token into redis
            long expiredTimeRedis = TimeUnit.MILLISECONDS.convert(dateExpired,TimeUnit.MILLISECONDS);
            redisTemplate.opsForValue().set(keyRedis,jwtToken,expiredTimeRedis,TimeUnit.MILLISECONDS);
            return getTokenInRedis(keyRedis);
        } catch (Exception ex) {
            LOG.error(ex.getMessage());
            return Result.forbiden("The user is NOT exists!");
        }
    }
}
