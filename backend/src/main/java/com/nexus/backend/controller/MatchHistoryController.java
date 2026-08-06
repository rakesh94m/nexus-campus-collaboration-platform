package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddMatchHistoryRequest;
import com.nexus.backend.dto.request.UpdateMatchHistoryRequest;
import com.nexus.backend.dto.response.MatchHistoryResponse;
import com.nexus.backend.service.MatchHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match-history")
@RequiredArgsConstructor
public class MatchHistoryController {

    private final MatchHistoryService matchHistoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatchHistoryResponse createMatchHistory(
            @Valid @RequestBody AddMatchHistoryRequest request) {

        return matchHistoryService.createMatchHistory(request);
    }

    @GetMapping
    public List<MatchHistoryResponse> getAllMatchHistory() {

        return matchHistoryService.getAllMatchHistory();
    }

    @GetMapping("/{id}")
    public MatchHistoryResponse getMatchHistoryById(
            @PathVariable Long id) {

        return matchHistoryService.getMatchHistoryById(id);
    }

    @PutMapping("/{id}")
    public MatchHistoryResponse updateMatchHistory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMatchHistoryRequest request) {

        return matchHistoryService.updateMatchHistory(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMatchHistory(
            @PathVariable Long id) {

        matchHistoryService.deleteMatchHistory(id);
    }

}