package com.hutech.backend.service;

import com.hutech.backend.entity.Message;
import com.hutech.backend.entity.Status;
import com.hutech.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getPublicMessages(){
        return messageRepository.findByStatus(Status.MESSAGE);
    }

    private final Path fileStorageLocation = Paths.get("media").toAbsolutePath().normalize();

    public List<Message> getPrivateMessages(String sender, String receiver){
        return messageRepository.findBySenderNameAndReceiverNameOrReceiverNameAndSenderName(sender, receiver, sender, receiver);
    }

    //Phần đánh dấu tin nhắn da doc



    public Message savePublicMessage(Message message) {
        LocalDateTime now  = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy--MM--dd HH:mm:ss");
        message.setDate(now.format(formatter));
        return messageRepository.save(message);
    }

    public Message savePrivateMessage(Message message) {
        LocalDateTime now  = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy--MM-dd HH:mm:ss");
        message.setDate(now.format(formatter));
        return messageRepository.save(message);
    }

    @Value("${upload.dir}")
    private String uploadDir;

    //Save lại file
    public String saveMedia(MultipartFile file) throws IOException {
        // Xây dựng đường dẫn tới thư mục lưu trữ file
        Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Tạo thư mục nếu nó không tồn tại
        if (!Files.exists(fileStorageLocation)) {
            Files.createDirectories(fileStorageLocation);
        }
        String fileName = file.getOriginalFilename();

        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Trả về đường dẫn tới file đã lưu
        return "message_image/" + fileName;

    }
}
