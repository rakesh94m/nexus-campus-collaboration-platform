package com.nexus.backend.service;

import com.nexus.backend.dto.request.AddCollaborationRequest;
import com.nexus.backend.dto.request.UpdateCollaborationRequest;
import com.nexus.backend.dto.response.CollaborationRequestResponse;

import java.util.List;

public interface CollaborationRequestService {

    CollaborationRequestResponse sendRequest(
            AddCollaborationRequest request);

    List<CollaborationRequestResponse> getReceivedRequests();

    List<CollaborationRequestResponse> getSentRequests();

    CollaborationRequestResponse updateRequest(
            Long id,
            UpdateCollaborationRequest request);

    void deleteRequest(Long id);

}