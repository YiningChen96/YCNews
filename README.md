# YCNews
This is a full-stack news web application independently developed by Yining Chen over the course of one and a half weeks.

🔧 Tech Stack
Frontend: Angular

Backend: Spring Boot

Database: MySQL

Static File Storage: External directory 

🌟 Key Features
Multi-level administrator roles (Super Admin & Admin)

JWT-based secure authentication

Article management with optional image-based featured news

Clean UI and responsive layout for easy interaction

Designed for smooth operation and maintenance by non-technical staff

This project provides a lightweight yet powerful content management solution tailored for news platforms.

***Setup and Run Instructions***
1. MySQL Setup
First, open the MySQL command line interface and execute the following commands to set up the database and user:
CREATE DATABASE News;
CREATE USER 'News_admin'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON News.* TO 'News_admin'@'localhost';
FLUSH PRIVILEGES;

2. Running the Application for Testing
To test the application in development mode, follow these steps:

For the Angular frontend:
Navigate to the news_angular directory.
Run the following command to start the Angular development server:
npm install
ng serve

For the Spring Boot backend:
Navigate to the news_spring directory.
Run the following command to start the Spring Boot application:
mvn spring-boot:run
After running these commands, the frontend will be available at http://localhost:4200

3. Building for Deployment
If you want to build and deploy the application, follow these steps:
Build the Angular frontend:
Navigate to the news_angular directory.
Run the following command to build the Angular application:
ng build
This will generate a dist folder containing the build files.
Copy the build files to the Spring Boot project:
Copy the contents of the dist folder from the news_angular directory into the src/main/resources/static folder of the news_spring project.
Build the Spring Boot application:
Navigate to the news_spring directory.
Run the following command to package the application:
mvn clean package
This will create a .jar file in the target folder.

4. Run the packaged application
Once the .jar file is generated in the target folder, you can run it using the following command:
java -jar target/<your-jar-file-name>.jar
or just click it if you have installed java compiler on your device.
