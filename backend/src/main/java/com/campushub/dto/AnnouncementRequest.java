package com.campushub.dto;

public class AnnouncementRequest {
    private String title;
    private String content;
    private String clubName;
    private String category = "GENERAL";
    private boolean isPinned = false;

    public AnnouncementRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isPinned() { return isPinned; }
    public void setPinned(boolean pinned) { isPinned = pinned; }
}
