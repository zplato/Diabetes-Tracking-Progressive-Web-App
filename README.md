# Project - Diabetes Tracking Progressive Web App

## Introduction
This is a graduate group project for the Georgia Institute of Technology (GaTech) Online Masters of Science Computer Science (OMSCS).  
**Semester**: Fall 2024  
**Class**: Health Informatics, CS6440  
**Team**: 62  


### Team Members
- **Mentor**: Ross Raiff
- Zachary Plato
- Anjeline Sayoc
- Ndubuisi Stanislaus Onyemenam
- Madison Hicks
- Adam Moore

## Description 
The Diabetes Tracking Progressive Web App (PWA).

## Frontend 
_Insert high lvl description here_

## Backend
_Insert high lvl description here_

## Deployment
The deployment of the “MAZNA Tech - Diabetes App for Kids!” is done through a Platform-as-a-Service (PaaS) provider called [Render](https://render.com/about).  Render is a cloud platform designed to provide an easy, scalable solution for deploying and managing modern web applications. The front-end is deployed as a static site, and the backend is deployed as a web-service. Both the frontend and backend can be reached through the following URLs: 

**Note** – _Both the frontend and backend are hosted separately under a “free” instance of render which will spin down deployments when not in use, so you may need to wait 1-2 minutes after clicking the link(s) for the application to redeploy._  

- Frontend -  https://cs6440groupproj-frontend-856p.onrender.com/login
- Backend - https://cs6440groupproj.onrender.com

The Frontend URL will take you to the login page for the application, and the Backend URL will take you to the default home endpoint (“/”), where it will display the string “CS6440 Team 62 Group Project! Fall 2024.” 

### Frontend Example User Login 
For testing the Frontend URL, use the username “Annatar” and the password “IAmSauron” (without the quotation marks). Alternatively, you can create a new user account to proceed.

### Infrastructure as Code (IaC) deployment files:
The following files define **Blueprints** in Render. A **Blueprint** is a YAML file that defines the infrastructure for your application. It's a declarative way to describe the services, databases (unused), and environment variables needed to deploy and manage your application.
- Deployment/frontend_render.yaml 
- Deployment/backend_render.yaml 




