# **AREA**

![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)  ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

***

## **Table of Contents**

- [**Subject Description**](#subject-description)
- [**Build the Project**](#build-the-project)
- [**Compile and Launch Services**](#compile-and-launch-services)

## **Subject Description**

The goal of this project is to discover, as a whole, the software platform that you have chosen through the creation of a business application.

To do this, you must implement a software suite that functions similar to that of IFTTT and/or Zapier.

This software suite will be broken into three parts :
- An application server 
- A web client to use the application from your browser by querying the application server
- A mobile client to use the application from your phone by querying the application server.


## **Build the Project**
To build the project, you may run the command :
```bash
docker-compose build
```

Also, do not forget to start the docker service with
```bash
systemctl start docker
```

## **Compile and Launch Services**
To launch our services (described below), you may run the command :
```bash
docker-compose up
```
Our Services :
- The server service should be launched on  port 8080
- The client_web service should be launched on port 8081
- The client_mobile should build the mobile client of the project.

The http://localhost:8081/client.apk root should provide an APK, an Android version of the mobile client.

The http://localhost:8080/about.json root should answer with the server service.



