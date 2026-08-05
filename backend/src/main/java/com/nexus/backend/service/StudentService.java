package com.nexus.backend.service;

import com.nexus.backend.dto.request.UpdateAvailabilityRequest;
import com.nexus.backend.dto.request.UpdateProfileRequest;
import com.nexus.backend.dto.request.UpdateSocialLinksRequest;
import com.nexus.backend.dto.response.StudentProfileResponse;



public interface StudentService {

   StudentProfileResponse getMyProfile();

StudentProfileResponse updateProfile(UpdateProfileRequest request);

StudentProfileResponse updateSocialLinks(UpdateSocialLinksRequest request);

StudentProfileResponse updateAvailability(UpdateAvailabilityRequest request);

}