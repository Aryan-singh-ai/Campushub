package com.campushub.config;

import com.campushub.models.*;
import com.campushub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedClubs();
        seedEvents();
        seedProposals();
        seedAnnouncements();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        String defaultPassword = passwordEncoder.encode("Password123!");

        User student = new User("Aarav Sharma", "student@university.edu", defaultPassword, Role.STUDENT, "EN2023CS0101", "Computer Science");
        User officer = new User("Rohan Gupta", "president@university.edu", defaultPassword, Role.CLUB_OFFICER, "EN2022CS0042", "Computer Science");
        User faculty = new User("Dr. Sunita Rao", "faculty@university.edu", defaultPassword, Role.FACULTY, "FAC-CSE-01", "Computer Science");
        User admin = new User("Prof. Vikram Verma", "admin@university.edu", defaultPassword, Role.ADMIN, "ADM-001", "Dean Student Affairs");
        User eventHead = new User("Ananya Desai", "eventhead@university.edu", defaultPassword, Role.EVENT_HEAD, "EN2022EC0089", "Electronics");

        userRepository.save(student);
        userRepository.save(officer);
        userRepository.save(faculty);
        userRepository.save(admin);
        userRepository.save(eventHead);
    }

    private void seedClubs() {
        if (clubRepository.count() > 0) return;

        Club coding = new Club("Coding Club", "Fostering programming excellence, hackathons, and open source development.", "Technical", "Rohan Gupta", "president@university.edu", "Dr. Sunita Rao");
        coding.setMemberCount(142);

        Club arts = new Club("Fine Arts Club", "Exploring visual arts, painting, digital sketching, and photography.", "Cultural", "Meera Iyer", "meera@university.edu", "Prof. K. Sen");
        arts.setMemberCount(88);

        Club quiz = new Club("Quiz Club", "Sharpening knowledge across history, science, pop culture, and sports.", "Academic", "Kunal Shah", "kunal@university.edu", "Dr. N. Roy");
        quiz.setMemberCount(64);

        Club sports = new Club("Sports Society", "Promoting physical fitness, inter-college athletics, football, and cricket.", "Sports", "Arjun Nair", "arjun@university.edu", "Coach R. Singh");
        sports.setMemberCount(210);

        Club robotics = new Club("Robotics & AI Club", "Building autonomous bots, drone racing, and machine learning research.", "Technical", "Siddharth Jain", "siddharth@university.edu", "Dr. P. Batra");
        robotics.setMemberCount(95);

        clubRepository.save(coding);
        clubRepository.save(arts);
        clubRepository.save(quiz);
        clubRepository.save(sports);
        clubRepository.save(robotics);
    }

    private void seedEvents() {
        if (eventRepository.count() > 0) return;

        String cseFormSchema = """
        {
          "sections": [
            {
              "id": "sec-student",
              "title": "Student Information",
              "fields": [
                { "id": "f-name", "label": "Full Name", "type": "text", "isRequired": true, "placeholder": "e.g. Karthik Rajan" },
                { "id": "f-enrollment", "label": "Enrollment Number", "type": "text", "isRequired": true, "placeholder": "e.g. EN2022CS0421" },
                { "id": "f-email", "label": "University Email ID", "type": "email", "isRequired": true, "placeholder": "e.g. karthik@university.edu" },
                { "id": "f-phone", "label": "Contact Number", "type": "text", "isRequired": true, "placeholder": "e.g. +91-98765-43210" }
              ]
            },
            {
              "id": "sec-academic",
              "title": "Academic Details",
              "fields": [
                { "id": "f-branch", "label": "Branch / Department", "type": "text", "isRequired": true, "placeholder": "e.g. Computer Science & Engineering" },
                { "id": "f-year", "label": "Year of Study", "type": "radio", "isRequired": true, "options": [
                  { "id": "yr-1", "label": "1st Year", "value": "1" },
                  { "id": "yr-2", "label": "2nd Year", "value": "2" },
                  { "id": "yr-3", "label": "3rd Year", "value": "3" },
                  { "id": "yr-4", "label": "4th Year", "value": "4" }
                ]}
              ]
            },
            {
              "id": "sec-event",
              "title": "Event Track Selection",
              "fields": [
                { "id": "f-track", "label": "Which track are you participating in?", "type": "radio", "isRequired": true, "options": [
                  { "id": "tr-1", "label": "Hackathon (Team of 2–4)", "value": "hackathon" },
                  { "id": "tr-2", "label": "Paper Presentation (Solo / Duo)", "value": "paper" },
                  { "id": "tr-3", "label": "Workshop Attendee", "value": "workshop" }
                ]},
                { "id": "f-team", "label": "Team Name (for Hackathon)", "type": "text", "isRequired": false, "placeholder": "e.g. ByteStormers" },
                { "id": "f-diet", "label": "Dietary Preference", "type": "radio", "isRequired": true, "options": [
                  { "id": "d-1", "label": "Vegetarian", "value": "veg" },
                  { "id": "d-2", "label": "Non-Vegetarian", "value": "nonveg" }
                ]},
                { "id": "f-tshirt", "label": "T-Shirt Size", "type": "radio", "isRequired": true, "options": [
                  { "id": "ts-1", "label": "S", "value": "S" },
                  { "id": "ts-2", "label": "M", "value": "M" },
                  { "id": "ts-3", "label": "L", "value": "L" },
                  { "id": "ts-4", "label": "XL", "value": "XL" }
                ]}
              ]
            },
            {
              "id": "sec-documents",
              "title": "Required Uploads",
              "fields": [
                { "id": "f-college-id", "label": "College ID Card Image", "type": "file", "isRequired": true, "description": "Upload a clear photo or PDF scan of your student ID card." },
                { "id": "f-payment-screenshot", "label": "Screenshot of Payment", "type": "file", "isRequired": true, "description": "Upload payment transaction screenshot/receipt." }
              ]
            }
          ]
        }
        """;

        Event e1 = new Event("evt-001", "CSE Tech Fest 2025",
                "A grand technology festival featuring hackathons, paper presentations, and workshops. Open to all branches.",
                "Technical", "Main Auditorium, Block A", LocalDateTime.now().plusDays(20), true, 299.0,
                "Scan the UPI QR code and transfer ₹299. Enter the UTR reference number below.", cseFormSchema, "Coding Club");

        Event e2 = new Event("evt-002", "Annual Photography Showcase",
                "Submit your best shots and compete in the campus photography competition. All genres welcome.",
                "Cultural", "Gallery Hall, Block C", LocalDateTime.now().plusDays(35), false, 0.0,
                "", cseFormSchema, "Fine Arts Club");

        Event e3 = new Event("evt-003", "Inter-College Quiz Bowl",
                "Battle of minds across general knowledge, science, current affairs, and pop culture.",
                "Academic", "Seminar Hall 2, Block B", LocalDateTime.now().plusDays(40), true, 100.0,
                "Transfer ₹100 per team via UPI and submit the UTR number.", cseFormSchema, "Quiz Club");

        Event e4 = new Event("evt-004", "Sports Meet 2025",
                "Annual sports meet featuring cricket, basketball, badminton, and athletics. Register for your chosen sport.",
                "Sports", "University Sports Ground", LocalDateTime.now().plusDays(50), false, 0.0,
                "", cseFormSchema, "Sports Society");

        eventRepository.save(e1);
        eventRepository.save(e2);
        eventRepository.save(e3);
        eventRepository.save(e4);
    }

    private void seedProposals() {
        if (proposalRepository.count() > 0) return;

        Proposal p1 = new Proposal("prop-001", "Robotics Workshop Series",
                "Hands-on workshop on Arduino, ROS, and autonomous robotics with industry mentors.",
                "Coding Club", "Rohan Gupta", 15000.0);
        p1.setStatus("PENDING");
        p1.setProposedVenue("Robotics Lab, Block D");

        Proposal p2 = new Proposal("prop-002", "Art Exhibition – Monsoon Edition",
                "Student artwork showcase, painting contests, and live pottery demonstrations.",
                "Fine Arts Club", "Meera Iyer", 8000.0);
        p2.setStatus("APPROVED");
        p2.setFacultyRemarks("Approved with budget limit of ₹8,000. Ensure auditorium booking is confirmed.");

        Proposal p3 = new Proposal("prop-003", "Inter-College Quiz Bowl",
                "Inviting quiz teams from 20+ universities in Delhi NCR with prize pool.",
                "Quiz Club", "Kunal Shah", 12000.0);
        p3.setStatus("PENDING");
        p3.setProposedVenue("Main Seminar Hall");

        proposalRepository.save(p1);
        proposalRepository.save(p2);
        proposalRepository.save(p3);
    }

    private void seedAnnouncements() {
        if (announcementRepository.count() > 0) return;

        Announcement a1 = new Announcement(
                "CSE Tech Fest 2025 Registrations are Open!",
                "Register early to secure your slot for Hackathon tracks and workshops. Limited seats available.",
                "Coding Club", "Rohan Gupta", "EVENT_UPDATE", true);

        Announcement a2 = new Announcement(
                "Auditions for Fine Arts Monsoon Exhibition",
                "Submit your portfolio by this Friday at the Gallery Hall.",
                "Fine Arts Club", "Meera Iyer", "GENERAL", false);

        announcementRepository.save(a1);
        announcementRepository.save(a2);
    }
}
