package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.AuthenticationRequest;
import com.lumilingua.crms.dto.requests.RefreshTokenRequest;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.AuthenticationResponse;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.dto.responses.WalletResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.enums.StatusEnum;
import com.lumilingua.crms.mapper.AuthenticationMapper;
import com.lumilingua.crms.mapper.UserMapper;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.security.UserDetail;
import com.lumilingua.crms.service.JwtService;
import com.lumilingua.crms.service.UserService;
import com.lumilingua.crms.service.WalletService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
//import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
//    private final RedisTemplate<String , String> redisTemplate;

    // properties
    @Value("${jwt.access-token-expiration}") // 900000 = 15 minute
    private long accessExpirationMs;

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

//    public Result<AuthenticationResponse> getTokenInRedis(String keyRedis) {
//        String tokenRedis = redisTemplate.opsForValue().get(keyRedis);
//        long expired = redisTemplate.getExpire(keyRedis);
//        long expiredConvertMilisecon = TimeUnit.MILLISECONDS.convert(expired,TimeUnit.SECONDS);
//        long timeNow = TimeUnit.MILLISECONDS.convert(System.currentTimeMillis(),TimeUnit.MILLISECONDS);
//        if(timeNow > expiredConvertMilisecon) {
//            redisTemplate.delete(keyRedis);
//            return Result.forbiden("The user is NOT exists!");
//        }
//        else if (tokenRedis.isEmpty() ) {
//            return Result.forbiden("The user is NOT exists!");
//        } else{
//            return Result.create(AuthenticationResponse.builder().expired(expired).token(tokenRedis).build());
//        }
//    }

    @Override
    public Result<AuthenticationResponse> login(AuthenticationRequest request) {
        User userEntity = userRepository.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("The account is incorrect. Please try again!"));

        if (userEntity.getStatus() != StatusEnum.ACTIVE) {
            return Result.unauthorized("The status user is NOT active");
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetail userDetail = new UserDetail(userEntity);

            String accessToken = jwtService.generateAccessToken(userDetail);
            String refreshToken = jwtService.generateRefreshToken(userDetail);

//            String refreshKey = "refresh_token:" + userEntity.getIdUser() + ":" + UUID.randomUUID();
//            redisTemplate.opsForValue().set(refreshKey, refreshToken, 7, TimeUnit.DAYS);

//            String accessKey = "access_token:" + userEntity.getIdUser();
//            redisTemplate.opsForValue().set(accessKey, accessToken, 15, TimeUnit.MINUTES);

            AuthenticationResponse response = AuthenticationMapper.INSTANT.toAuthenticationResponse(accessToken, accessExpirationMs, refreshToken);
            response.setInformation(AuthenticationMapper.INSTANT.toInformationResponse(userEntity));

            return Result.get(response);
        } catch (BadCredentialsException e) {
            return Result.forbidden("Invalid password");
        } catch (Exception ex) {
            LOG.error("Login error", ex);
            return Result.serverError("Login failed");
        }
    }

    @Override
    public Result<AuthenticationResponse> refreshToken(RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            // Extract username by refresh token
            String username = jwtService.extractUserName(refreshToken);

            // Load UserDetails
            UserDetail userDetail = (UserDetail) userDetailsService.loadUserByUsername(username);
            if (!jwtService.isTokenValid(refreshToken, userDetail)) {
                return Result.unauthorized("Invalid or expired refresh token");
            }

            String newAccessToken = jwtService.generateAccessToken(userDetail);

            // Response
            AuthenticationResponse response = new AuthenticationResponse();
            response.setToken(newAccessToken);
            response.setRefreshToken(refreshToken);
            response.setExpired(accessExpirationMs);

            return Result.get(response);
        } catch (Exception e) {
            LOG.error("Refresh token error", e);
            return Result.unauthorized("Invalid refresh token");
        }
    }
}
