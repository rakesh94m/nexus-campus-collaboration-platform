package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddInterestRequest;
import com.nexus.backend.dto.request.UpdateInterestRequest;
import com.nexus.backend.dto.response.InterestResponse;

import java.util.List;

public interface InterestService {

    InterestResponse addInterest(AddInterestRequest request);

    List<InterestResponse> getMyInterests();

    InterestResponse updateInterest(Long id, UpdateInterestRequest request);

    void deleteInterest(Long id);

}