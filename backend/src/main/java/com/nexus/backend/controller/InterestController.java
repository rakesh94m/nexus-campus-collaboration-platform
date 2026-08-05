package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddInterestRequest;
import com.nexus.backend.dto.request.UpdateInterestRequest;
import com.nexus.backend.dto.response.InterestResponse;
import com.nexus.backend.service.InterestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interests")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;

    // =========================================
    // Add Interest
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterestResponse addInterest(
            @Valid @RequestBody AddInterestRequest request) {

        return interestService.addInterest(request);
    }

    // =========================================
    // Get My Interests
    // =========================================

    @GetMapping
    public List<InterestResponse> getMyInterests() {

        return interestService.getMyInterests();
    }

    // =========================================
    // Update Interest
    // =========================================

    @PutMapping("/{id}")
    public InterestResponse updateInterest(
            @PathVariable Long id,
            @Valid @RequestBody UpdateInterestRequest request) {

        return interestService.updateInterest(id, request);
    }

    // =========================================
    // Delete Interest
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInterest(@PathVariable Long id) {

        interestService.deleteInterest(id);
    }

}