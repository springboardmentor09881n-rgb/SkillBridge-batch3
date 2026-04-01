package com.skillbridge.controller;

import com.skillbridge.model.Message;
import com.skillbridge.model.User;
import com.skillbridge.repository.MessageRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MessageController {

    public static class SendMessageRequest {
        private Long senderId;
        private Long receiverId;
        private String content;

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public Long getReceiverId() { return receiverId; }
        public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class ConversationPreview {
        private Long otherUserId;
        private String otherUserName;
        private String otherUserRole;
        private String lastMessage;
        private LocalDateTime lastTimestamp;
        private long unreadCount;

        public Long getOtherUserId() { return otherUserId; }
        public void setOtherUserId(Long otherUserId) { this.otherUserId = otherUserId; }
        public String getOtherUserName() { return otherUserName; }
        public void setOtherUserName(String otherUserName) { this.otherUserName = otherUserName; }
        public String getOtherUserRole() { return otherUserRole; }
        public void setOtherUserRole(String otherUserRole) { this.otherUserRole = otherUserRole; }
        public String getLastMessage() { return lastMessage; }
        public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
        public LocalDateTime getLastTimestamp() { return lastTimestamp; }
        public void setLastTimestamp(LocalDateTime lastTimestamp) { this.lastTimestamp = lastTimestamp; }
        public long getUnreadCount() { return unreadCount; }
        public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
    }

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    // Get all conversation previews for a user
    @GetMapping("/conversations/{userId}")
    public List<ConversationPreview> getConversations(@PathVariable Long userId) {
        List<Message> latestMessages = messageRepository.findLatestConversations(userId);

        return latestMessages.stream().map(msg -> {
            ConversationPreview preview = new ConversationPreview();
            boolean isSender = msg.getSender().getId().equals(userId);
            User otherUser = isSender ? msg.getReceiver() : msg.getSender();

            preview.setOtherUserId(otherUser.getId());
            preview.setOtherUserName(otherUser.getFullName() != null ? otherUser.getFullName() : otherUser.getUsername());
            preview.setOtherUserRole(otherUser.getRole());
            preview.setLastMessage(msg.getContent());
            preview.setLastTimestamp(msg.getTimestamp());

            // Count unread messages from the other user
            List<Message> convo = messageRepository.findConversation(userId, otherUser.getId());
            long unread = convo.stream()
                    .filter(m -> m.getReceiver().getId().equals(userId) && !m.isRead())
                    .count();
            preview.setUnreadCount(unread);

            return preview;
        }).collect(Collectors.toList());
    }

    // Get the message history between two users
    @GetMapping("/{userId}/{otherUserId}")
    public List<Message> getConversation(@PathVariable Long userId, @PathVariable Long otherUserId) {
        return messageRepository.findConversation(userId, otherUserId);
    }

    // Send a message
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request) {
        if (request.getSenderId() == null || request.getReceiverId() == null || request.getContent() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "senderId, receiverId and content are required"));
        }

        User sender = userRepository.findById(request.getSenderId()).orElse(null);
        User receiver = userRepository.findById(request.getReceiverId()).orElse(null);

        if (sender == null || receiver == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid sender or receiver"));
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());

        Message saved = messageRepository.save(message);

        // Send real-time notification via WebSocket if available
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend("/topic/messages/" + receiver.getId(), saved);
        }

        // Create notification
        notificationService.notifyNewMessage(receiver, sender);

        return ResponseEntity.ok(saved);
    }

    // Mark messages as read
    @PutMapping("/read/{senderId}/{receiverId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long senderId, @PathVariable Long receiverId) {
        messageRepository.markAsRead(senderId, receiverId);
        return ResponseEntity.ok(Map.of("message", "Messages marked as read"));
    }

    // Get unread message count
    @GetMapping("/unread-count/{userId}")
    public Map<String, Long> getUnreadCount(@PathVariable Long userId) {
        return Map.of("count", messageRepository.countUnread(userId));
    }
}
