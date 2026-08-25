package com.cfs.PaymentService.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Razorpay razorpay=new Razorpay();
    private final Kafka kafka=new Kafka();
    private final Cors cors=new Cors();

   public Razorpay getRazorpay(){
       return razorpay;
   }

   public Kafka getKafka(){
       return kafka;
   }

   public Cors getCors(){
       return cors;
   }



    public static class Razorpay{
   private String keyId;
   private String keySecret;

        public String getKeyId() {
            return keyId;
        }

        public void setKeyId(String keyId) {
            this.keyId = keyId;
        }

        public String getKeySecret() {
            return keySecret;
        }

        public void setKeySecret(String keySecret) {
            this.keySecret = keySecret;
        }
    }



    public static class Kafka{
        private String topic;

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }
    }


    public static class Cors{
        private String allowedOrigin;

        public String getAllowedOrigin() {
            return allowedOrigin;
        }

        public void setAllowedOrigin(String allowedOrigin) {
            this.allowedOrigin = allowedOrigin;
        }
    }

}
