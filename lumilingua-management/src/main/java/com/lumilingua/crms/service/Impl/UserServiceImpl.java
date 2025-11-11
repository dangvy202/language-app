package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.UserRequest;
import com.lumilingua.crms.dto.responses.UserResponse;
import com.lumilingua.crms.entity.User;
import com.lumilingua.crms.mapper.UserMapper;
import com.lumilingua.crms.repository.UserRepository;
import com.lumilingua.crms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public Result<UserResponse> registerAccountByCustomer(UserRequest userRequest) {
        if(StringUtils.hasLength(userRequest.getEmail())) {
            Optional<User> user = userRepository.findUserByEmail(userRequest.getEmail());
            // email exist
            if(user.isPresent()) {
                return Result.badRequestError();
            } else {
                userRequest.setPassword(bCryptPasswordEncoder.encode(userRequest.getPassword()));
                User userRegister = UserMapper.INSTANT.toUserEntity(userRequest);
                System.out.println(userRegister);
            }
        }
        return null;
    }
}
