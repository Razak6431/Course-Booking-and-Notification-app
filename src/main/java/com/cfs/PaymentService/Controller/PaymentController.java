package com.cfs.PaymentService.Controller;

import com.cfs.PaymentService.config.AppProperties;
import com.cfs.PaymentService.dto.CreateOrderRequest;
import com.cfs.PaymentService.dto.CreateOrderResponse;
import com.cfs.PaymentService.dto.PaymentVerificationRequest;
import com.cfs.PaymentService.dto.PaymentVerificationResponse;
import com.cfs.PaymentService.model.Course;
import com.cfs.PaymentService.service.CourseCatalogService;
import com.cfs.PaymentService.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RestController
@RequestMapping("/api")
public class PaymentController {

    private final CourseCatalogService courseCatalogService;
    private final PaymentService paymentService;
    private final AppProperties properties;


    public PaymentController(CourseCatalogService courseCatalogService, PaymentService paymentService, AppProperties properties) {
        this.courseCatalogService = courseCatalogService;
        this.paymentService = paymentService;
        this.properties = properties;
    }
    @Value("${app.razorpay.api.key-id}")
    public String razorpayKeyId;

    @GetMapping("/courses")
    public List<Course>courses(){
      return courseCatalogService.findAll() ;
    }
    @GetMapping("/config")
    public Map<String,String>config(){
        return Map.of("razorpayKeyId",razorpayKeyId);
    }

     @PostMapping("/payments/orders")
    public CreateOrderResponse createOrder(@RequestBody CreateOrderRequest request) throws RazorpayException {
      return paymentService.createOrder(request);
    }

    @PostMapping("/payments/verify")
    public PaymentVerificationResponse verify(@RequestBody PaymentVerificationRequest request){
       paymentService.verifyAndNotify(request);
       return new PaymentVerificationResponse(true,"Payment verified,Notification sent");


    }
    @ExceptionHandler({IllegalArgumentException.class,RazorpayException.class})
    public ResponseEntity<Map<String,String>>handleBadReq(Exception ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",ex.getMessage()));
    }








}
