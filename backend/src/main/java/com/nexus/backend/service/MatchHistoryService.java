package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddMatchHistoryRequest;
import com.nexus.backend.dto.request.UpdateMatchHistoryRequest;
import com.nexus.backend.dto.response.MatchHistoryResponse;

import java.util.List;

public interface MatchHistoryService {

    MatchHistoryResponse createMatchHistory(AddMatchHistoryRequest request);

    List<MatchHistoryResponse> getAllMatchHistory();

    MatchHistoryResponse getMatchHistoryById(Long id);

    MatchHistoryResponse updateMatchHistory(Long id,
                                            UpdateMatchHistoryRequest request);

    void deleteMatchHistory(Long id);

}