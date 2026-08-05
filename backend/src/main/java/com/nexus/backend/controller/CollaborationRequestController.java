package com.nexus.backend.controller;

import com.nexus.backend.dto.request.AddCollaborationRequest;
import com.nexus.backend.dto.request.UpdateCollaborationRequest;
import com.nexus.backend.dto.response.CollaborationRequestResponse;
import com.nexus.backend.service.CollaborationRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaboration-requests")
@RequiredArgsConstructor
public class CollaborationRequestController {

    private final CollaborationRequestService collaborationRequestService;

    // =========================================
    // Send Collaboration Request
    // =========================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollaborationRequestResponse sendRequest(
            @Valid @RequestBody AddCollaborationRequest request) {

        return collaborationRequestService.sendRequest(request);

    }

    // =========================================
    // Get Received Requests
    // =========================================

    @GetMapping("/received")
    public List<CollaborationRequestResponse> getReceivedRequests() {

        return collaborationRequestService.getReceivedRequests();

    }

    // =========================================
    // Get Sent Requests
    // =========================================

    @GetMapping("/sent")
    public List<CollaborationRequestResponse> getSentRequests() {

        return collaborationRequestService.getSentRequests();

    }

    // =========================================
    // Accept / Reject Request
    // =========================================

    @PutMapping("/{id}")
    public CollaborationRequestResponse updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCollaborationRequest request) {

        return collaborationRequestService.updateRequest(id, request);

    }

    // =========================================
    // Delete Request
    // =========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRequest(@PathVariable Long id) {

        collaborationRequestService.deleteRequest(id);

    }

}