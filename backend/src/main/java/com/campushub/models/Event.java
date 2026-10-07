package com.campushub.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    private String id; // e.g. "evt-001" or generated UUID

    @Column(nullable = false)
    private String title;

    @Column(length = 4000)
    private String description;

    private String category;
    private String venue;
    private LocalDateTime eventDate;
    private boolean isPaid;
    private double regFee;
    
    @Column(length = 2000)
    private String paymentInstructions;
    
    private String paymentQrUrl;
    private String bannerUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String registrationSchemaJson; // JSON representation of dynamic form sections/fields

    private String status = "PUBLISHED"; // DRAFT, PROPOSED, APPROVED, PUBLISHED, COMPLETED
    private String clubName;
    private int capacity = 200;
    private int registeredCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Event() {}

    public Event(String id, String title, String description, String category, String venue,
                 LocalDateTime eventDate, boolean isPaid, double regFee, String paymentInstructions,
                 String registrationSchemaJson, String clubName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.venue = venue;
        this.eventDate = eventDate;
        this.isPaid = isPaid;
        this.regFee = regFee;
        this.paymentInstructions = paymentInstructions;
        this.registrationSchemaJson = registrationSchemaJson;
        this.clubName = clubName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public boolean isPaid() { return isPaid; }
    public void setPaid(boolean paid) { isPaid = paid; }

    public double getRegFee() { return regFee; }
    public void setRegFee(double regFee) { this.regFee = regFee; }

    public String getPaymentInstructions() { return paymentInstructions; }
    public void setPaymentInstructions(String paymentInstructions) { this.paymentInstructions = paymentInstructions; }

    public String getPaymentQrUrl() { return paymentQrUrl; }
    public void setPaymentQrUrl(String paymentQrUrl) { this.paymentQrUrl = paymentQrUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getRegistrationSchemaJson() { return registrationSchemaJson; }
    public void setRegistrationSchemaJson(String registrationSchemaJson) { this.registrationSchemaJson = registrationSchemaJson; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(int registeredCount) { this.registeredCount = registeredCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
