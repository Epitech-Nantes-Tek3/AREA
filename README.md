# **AREA**

![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)  ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

[![CI](https://github.com/Epitech-Nantes-Tek3/AREA/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/Epitech-Nantes-Tek3/AREA/actions/workflows/CI.yml)

***

## **Table of Contents**

- [**Subject Description**](#subject-description)
- [**Build the Project**](#build-the-project)
- [**Launch Services**](#launch-services)
- [**Launch Tests**](#launch-tests)
- [**Thanks for Reading**](#thanks-for-reading)
- [**Authors**](#authors)

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

## **Launch Services**
To launch our services (described below), you may run the command :
```bash
docker-compose up
```
Our Services :
- The server service will be launched on  port 8080
- The client_web service will be launched on port 8081
- The client_mobile will build the mobile client of the project

The http://localhost:8081/client.apk root should provide an APK, an Android version of the mobile client.

The http://localhost:8080/about.json root should answer with the server service.

## **Launch Tests**

Please read the following [**ReadMe**](./Application//README.md), it contains every explanations you will need.

## **Thanks for reading**

Feel free to read the `CONTRIBUTING.md`.

Do not hesitate to contact any member for any questions or remarks. You can click on each following name.


## **Authors**

<table>
    <tbody>
        <tr>
            <td align="center"><a href="https://github.com/osvegn/"><img src="https://avatars.githubusercontent.com/u/72011124?v=4" width="100px;" alt="osvegn"/><br/><sub><b>Thomas Prud'homme</b></sub></a><br/></td>
            <td align="center"><a href="https://github.com/31Nathan/"><img src="https://avatars.githubusercontent.com/u/72010794?v=4" width="100px;" alt="31Nathan"/><br/><sub><b>Nathan Rousseau</b></sub></a><br/></td>
            <td align="center"><a href="https://github.com/JohanCDev"><img src="https://avatars.githubusercontent.com/u/25590592?v=4" width="100px;" alt="JohanCDev"/><br/><sub><b>Johan Chrillesen</b></sub></a><br/></td>
            <td align="center"><a href="https://github.com/STom6"><img src="https://avatars.githubusercontent.com/u/72015208?v=4" width="100px;" alt="STom6"/><br/><sub><b>Tom Sarrazin</b></sub></a><br/></td>
            <td align="center"><a href="https://github.com/CedricCORGE"><img src="https://avatars.githubusercontent.com/u/64684672?v=4" width="100px;" alt="CedricCORGE"/><br/><sub><b>Cédric Corge</b></sub></a><br/></td>
        <tr>
    </tbody>
</table>