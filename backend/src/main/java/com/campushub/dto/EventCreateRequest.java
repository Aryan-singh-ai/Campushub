package com.campushub.dto;

import java.time.LocalDateTime;

public class EventCreateRequest {
    private String id;
    private String title;
    private String description;
    private String category;
    private String venue;
    private LocalDateTime eventDate;
    private boolean isPaid;
    private double regFee;
    private String paymentInstructions;
    private String paymentQrUrl;
    private String bannerUrl;
    private String registrationSchemaJson;
    private String clubName;
    private int capacity = 200;

    public EventCreateRequest() {}

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

    public String getClubName() { return clubName; }
    public void setClubName(String clubName) { this.clubName = clubName; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}
