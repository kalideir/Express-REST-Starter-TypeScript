<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->




[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Express-TypeScript-Starter</h3>

  <p align="center">
    A ready-to-use Express and TypeScript REST API template based on MongoDB.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Althpugh there are many Express templates out there, most of them come lacking specific features like media file upload, schema validation, and no adoption of TypeScript, I built this probject as a template for my future Express projects since it contains the most imortant parts to get your hands on other parts of your code.


With this template you could benefit from:
* Getting up and running as fast as possible with your projects. No need to write the functionality for auth from scratch.
* Type-safe schemas and validation with Zod.
* API Documentation with Swagge
* Docker & Docker Compose integration.
* E-mail service with Nodemailer.
* Media & S3 upload and auto resize functinality with Sharp.
* Metrics Report using Promethious.
* Logging & rotation with Winston and Morgan.
* REST API location that can be simple extended to any language. 
* E-mail Templates
* Cookie-based & Google Oauth2 authentication.
* Multi-role authorization.

You might want to furtherly tailor this template for your needs, for example you might use a different emailing service like Sendgrid instead of nodemailer. The separation of concerns approach implemented in this project makes customizying it super easy.



### Built With

* Node.js
* MongoDB
* TypeScript
* Zod
* Bullmq
* Docker & Docker-Compose



<!-- GETTING STARTED -->
## Getting Started

Using this template in your new projects starts gives you the freedom to run it with a container tool like Docker, or you can use Node directly from the OS.

### Prerequisites

To get this project working, the first step is to create an environment-variables `.env` file that contains all required variables needed in the project.

### Installation

1. If you don't want to use Docker, make sure you have a recent Node version.
2. To use with Docker, have Docker installed on your computer from its website.
3. Clone the repo / Use the template.
4. Fill the values for the environment variables inside the `.env` file I have provided.
5. If you wish to continue with Docker, run `make build-up local` or `docker-compose --env-file .env.local up --build`. This command will do the installation and running steps for your. If you have correctly set your environment variables, the server will be ready to use.
6. Navigate to `api` folder.
7. Install NPM packages
   ```
    npm i
   ```
8. Execute the server entry `index.ts` using npm command `npm run dev`.
9. Visit `http://localhost:8000

## Roadmap

- [x] MVP API Starter
- [ ] Add Tests
- [ ] Improve the Swagger documentation
- [ ] Deployment to AWS guide

## Contributing

If you noticed anything that you could improve for the better/fix or recommend feel free to open an issue or make a pull request.


## License

Distributed under the MIT License.


## Contact

Ali H. Kudeir - [@kalideir](https://twitter.com/kalideir) - 



## Acknowledgments





[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/ali-h-kudeir
