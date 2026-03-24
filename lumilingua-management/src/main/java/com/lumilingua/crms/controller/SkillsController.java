package com.lumilingua.crms.controller;

import com.lumilingua.crms.constant.ResultApiConstant;
import com.lumilingua.crms.dto.Result;
import com.lumilingua.crms.dto.requests.SkillRequest;
import com.lumilingua.crms.dto.responses.SkillResponse;
import com.lumilingua.crms.service.SkillsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/skill")
public class SkillsController {
    private static final Logger LOG = LoggerFactory.getLogger(SkillsController.class);

    private final SkillsService skillsService;

    @PostMapping
    public ResponseEntity<Result<SkillResponse>> createSkill(@RequestBody SkillRequest request) {
        LOG.info("Call api create skill by controller: '%s'".formatted("/api/v1/skill"));
        Result<SkillResponse> result = skillsService.createSkill(request);

        if(result.code == ResultApiConstant.StatusCode.INTERNAL_SERVER_ERROR) {
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Result<List<SkillResponse>>> getAllSkill() {
        LOG.info("Call api get all skills '%s' by controller".formatted("/api/v1/skill"));
        Result<List<SkillResponse>> results = skillsService.getAllSkill();
        return new ResponseEntity<>(results, HttpStatus.OK);
    }
}
