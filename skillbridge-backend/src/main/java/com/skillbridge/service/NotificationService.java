package com.skillbridge.service;

import com.skillbridge.model.Notification;
import com.skillbridge.model.User;
import com.skillbridge.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, String type, String title, String message, Long relatedId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        return notificationRepository.save(notification);
    }

    public void notifyNewMessage(User receiver, User sender) {
        createNotification(
                receiver,
                "MESSAGE",
                "New message from " + (sender.getFullName() != null ? sender.getFullName() : sender.getUsername()),
                "You have a new message. Click to open the conversation.",
                sender.getId()
        );
    }

    public void notifyApplicationStatusChange(User volunteer, String opportunityTitle, String newStatus) {
        String statusText = newStatus.equalsIgnoreCase("ACCEPTED") ? "accepted" : "rejected";
        createNotification(
                volunteer,
                "APPLICATION",
                "Application " + statusText,
                "Your application for \"" + opportunityTitle + "\" has been " + statusText + ".",
                null
        );
    }

    public void notifyNewApplication(User ngo, String volunteerName, String opportunityTitle) {
        createNotification(
                ngo,
                "APPLICATION",
                "New application received",
                volunteerName + " applied for \"" + opportunityTitle + "\".",
                null
        );
    }
}
