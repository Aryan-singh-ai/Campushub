package com.campushub.services;

import com.campushub.dto.EventCreateRequest;
import com.campushub.models.Event;
import com.campushub.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getPublishedEvents() {
        return eventRepository.findByStatus("PUBLISHED");
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(EventCreateRequest req) {
        String id = req.getId() != null && !req.getId().isBlank() 
                ? req.getId() 
                : "evt-" + UUID.randomUUID().toString().substring(0, 8);

        Event event = new Event(
                id,
                req.getTitle(),
                req.getDescription(),
                req.getCategory(),
                req.getVenue(),
                req.getEventDate(),
                req.isPaid(),
                req.getRegFee(),
                req.getPaymentInstructions(),
                req.getRegistrationSchemaJson(),
                req.getClubName()
        );
        event.setBannerUrl(req.getBannerUrl());
        event.setPaymentQrUrl(req.getPaymentQrUrl());
        if (req.getCapacity() > 0) {
            event.setCapacity(req.getCapacity());
        }

        return eventRepository.save(event);
    }

    public Event updateEvent(String id, EventCreateRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        if (req.getTitle() != null) event.setTitle(req.getTitle());
        if (req.getDescription() != null) event.setDescription(req.getDescription());
        if (req.getCategory() != null) event.setCategory(req.getCategory());
        if (req.getVenue() != null) event.setVenue(req.getVenue());
        if (req.getEventDate() != null) event.setEventDate(req.getEventDate());
        event.setPaid(req.isPaid());
        event.setRegFee(req.getRegFee());
        if (req.getPaymentInstructions() != null) event.setPaymentInstructions(req.getPaymentInstructions());
        if (req.getPaymentQrUrl() != null) event.setPaymentQrUrl(req.getPaymentQrUrl());
        if (req.getRegistrationSchemaJson() != null) event.setRegistrationSchemaJson(req.getRegistrationSchemaJson());
        if (req.getClubName() != null) event.setClubName(req.getClubName());

        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}
