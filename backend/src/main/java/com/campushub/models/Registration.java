package com.campushub.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    private String id; // e.g. "reg-abc123"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private String studentName;
    private String enrollmentNo;
    private String email;
    private String phone;
    private String branch;
    private String year;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String formDataJson;

    private String collegeIdUrl;
    private String paymentScreenshotUrl;
    private String transactionRef;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    private String ticketCode;
    private boolean attended = false;

    private LocalDateTime registeredAt = LocalDateTime.now();

    public Registration() {}

    public Registration(String id, Event event, User user, String studentName, String enrollmentNo,
                        String email, String phone, String branch, String year, String formDataJson,
                        String collegeIdUrl, String paymentScreenshotUrl, String transactionRef) {
        this.id = id;
        this.event = event;
        this.user = user;
        this.studentName = studentName;
        this.enrollmentNo = enrollmentNo;
        this.email = email;
        this.phone = phone;
        this.branch = branch;
        this.year = year;
        this.formDataJson = formDataJson;
        this.collegeIdUrl = collegeIdUrl;
        this.paymentScreenshotUrl = paymentScreenshotUrl;
        this.transactionRef = transactionRef;
        this.ticketCode = "TKT-" + Math.abs(id.hashCode());
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getEnrollmentNo() { return enrollmentNo; }
    public void setEnrollmentNo(String enrollmentNo) { this.enrollmentNo = enrollmentNo; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getFormDataJson() { return formDataJson; }
    public void setFormDataJson(String formDataJson) { this.formDataJson = formDataJson; }

    public String getCollegeIdUrl() { return collegeIdUrl; }
    public void setCollegeIdUrl(String collegeIdUrl) { this.collegeIdUrl = collegeIdUrl; }

    public String getPaymentScreenshotUrl() { return paymentScreenshotUrl; }
    public void setPaymentScreenshotUrl(String paymentScreenshotUrl) { this.paymentScreenshotUrl = paymentScreenshotUrl; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public boolean isAttended() { return attended; }
    public void setAttended(boolean attended) { this.attended = attended; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}
