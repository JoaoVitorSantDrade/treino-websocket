package com.example.demo;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(HelloMessage message) throws Exception {
        // Handle the incoming message and send a response
        return new Greeting(message.getName()).getContent();
    }

    @Scheduled(fixedRate = 5000) // Send a message every 5 seconds
    public void sendPeriodicMessage() {
        messagingTemplate.convertAndSend("/topic/greetings", new Greeting("Periodic message from the server"));
    }
}
