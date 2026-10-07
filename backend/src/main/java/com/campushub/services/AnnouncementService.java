package com.campushub.services;

import com.campushub.dto.AnnouncementRequest;
import com.campushub.models.Announcement;
import com.campushub.repositories.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByPublishedAtDesc();
    }

    public List<Announcement> getAnnouncementsByClub(String clubName) {
        return announcementRepository.findByClubNameOrderByPublishedAtDesc(clubName);
    }

    public Announcement createAnnouncement(AnnouncementRequest req, String authorName) {
        Announcement announcement = new Announcement(
                req.getTitle(),
                req.getContent(),
                req.getClubName(),
                authorName != null ? authorName : "Club Officer",
                req.getCategory(),
                req.isPinned()
        );
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
