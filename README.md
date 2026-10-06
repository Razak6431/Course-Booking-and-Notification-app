# Course Booking and Notification App

## 📌 Overview
A Spring Boot microservice application for managing course bookings and sending notifications.  
It demonstrates **event-driven architecture** using **Kafka**, **email notifications** with JavaMailSender, and **containerization** with Docker.

---

## 🏗️ Architecture
- **Spring Boot** REST API for course booking
- **Kafka Producer** publishes booking events
- **Kafka Consumer** listens for events and triggers notifications
- **MySQL** database for persistence
- **Docker Compose** for containerized deployment

---

## ⚙️ Tech Stack
- Java 17
- Spring Boot
- Spring Data JPA
- Kafka
- MySQL
- Docker / Docker Compose

---

## 🚀 Features
- Book courses via REST API
- Event-driven notifications (email)
- Configurable Kafka topics
- Containerized deployment with Docker
- Scalable consumer groups for handling high load
