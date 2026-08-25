package com.cfs.PaymentService.service;

import com.cfs.PaymentService.config.AppProperties;
import com.cfs.PaymentService.dto.CreateOrderRequest;
import com.cfs.PaymentService.dto.CreateOrderResponse;
import com.cfs.PaymentService.dto.PaymentVerificationRequest;
import com.cfs.PaymentService.model.Course;
import com.cfs.PaymentService.model.EnrollmentNotification;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class PaymentService {

  private final RazorpayClient razorpayClient;
  private final CourseCatalogService courseCatalogService;

  private final KafkaTemplate<String, EnrollmentNotification> kafkaTemplate;

  private final AppProperties properties;

  @Value("${app.razorpay.api.key-id}")
  public String key;

  @Value("${app.razorpay.api.key-secret}")
  public String secret;

    public PaymentService(RazorpayClient razorpayClient, CourseCatalogService courseCatalogService, KafkaTemplate<String, EnrollmentNotification> kafkaTemplate, AppProperties properties) {
        this.razorpayClient = razorpayClient;
        this.courseCatalogService = courseCatalogService;
        this.kafkaTemplate = kafkaTemplate;
        this.properties = properties;
    }

    public CreateOrderResponse createOrder(CreateOrderRequest request)throws RazorpayException{


            Course course = courseCatalogService.findById(request.courseId());

            JSONObject notes = new JSONObject();
            notes.put("courseId", course.id());
            notes.put("email", request.email());

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", course.amountInPaise());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "course_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            orderRequest.put("notes", notes);


            Order order = razorpayClient.orders.create(orderRequest);

//            EnrollmentNotification notification=new EnrollmentNotification(
//                    request.studentName(),
//                    request.email(),
//                    course.id(),
//                    course.title(),
//                    course.amountInPaise(),
//                    "owueuwuoeu2321",
//                    "test123",
//
//                    Instant.now()
//            );
//
//           KafkaTemplate.send(kafkaTopic,request.email(),notification);


            return new CreateOrderResponse(
                    key,             //properties.getRazorpay().getKeyId()
                    order.get("id"),
                    course.amountInPaise(),
                    "INR",
                    course.id(),
                    course.title(),
                    request.studentName(),
                    request.email()
            );







    }

    public void verifyAndNotify(PaymentVerificationRequest request){

        if(!isValidSignature(request)){
            throw new IllegalArgumentException("payment signature verification failed");
        }

        Course course=courseCatalogService.findById(request.courseId());

        EnrollmentNotification notification=new EnrollmentNotification(
                request.studentName(),
                request.email(),
                course.id(),
                course.title(),
                course.amountInPaise(),
                request.razorpayOrderId(),
                request.razorpayPaymentId(),
                Instant.now()
        );

        kafkaTemplate.send(properties.getKafka().getTopic(),request.email(),notification);


    }

    public boolean isValidSignature(PaymentVerificationRequest request){

     String payload=request.razorpayOrderId()+"|"+request.razorpayPaymentId();
     String expectedSignature=hmacSha256(payload,secret);  //properties.getRazorpay().getKeySecret()

     return expectedSignature.equals(request.razorpaySignature());

    }


    private String hmacSha256(String payload,String secret){

        try{
            Mac mac=Mac.getInstance("HmacSHA256");
            SecretKeySpec key=new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),"HmacSHA256");
            mac.init(key);
            String signature= HexFormat.of().formatHex(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
            System.out.println("Signature: " + signature);
            return signature;
        }catch (NoSuchAlgorithmException | InvalidKeyException ex){
            throw new IllegalStateException("Unable to verify Razorpay signature",ex);
        }



    }





}
