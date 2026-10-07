package com.campushub.dto;

import java.util.Map;

public class RegistrationRequest {
    private String eventId;
    private String studentName;
    private String enrollmentNo;
    private String email;
    private String phone;
    private String branch;
    private String year;
    private String collegeIdUrl;
    private String paymentScreenshotUrl;
    private String transactionRef;
    private Map<String, Object> formValues;

    public RegistrationRequest() {}

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

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

    public String getCollegeIdUrl() { return collegeIdUrl; }
    public void setCollegeIdUrl(String collegeIdUrl) { this.collegeIdUrl = collegeIdUrl; }

    public String getPaymentScreenshotUrl() { return paymentScreenshotUrl; }
    public void setPaymentScreenshotUrl(String paymentScreenshotUrl) { this.paymentScreenshotUrl = paymentScreenshotUrl; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public Map<String, Object> getFormValues() { return formValues; }
    public void setFormValues(Map<String, Object> formValues) { this.formValues = formValues; }
}
