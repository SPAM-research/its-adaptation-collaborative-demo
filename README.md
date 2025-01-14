# ITS-Adaptation-Collaborative-Demo

This repository contains the code for the demonstration application presented in the paper titled *"A Framework for Adapting Conversational Intelligent Tutoring Systems to Enable Collaborative Learning"* by Pablo Arnau-González, Sergi Solera-Monforte, Yuyan Wu, and Miguel Arevalillo-Herráez.

The demonstration illustrates the final result of adapting an Intelligent Tutoring System (ITS) for use in a collaborative learning environment, in accordance with the recommendations outlined in our paper.

**Note:** This demonstration serves purely for illustrative purposes and is not linked to the HINTS system described in the paper. It does not constitute a fully operational ITS, and the code does not strictly adhere to the guidelines detailed in the paper. The goal is to showcase how a collaborative group-based session would function within such a system.

## Requirements

Before running the application, ensure that you have Docker installed on your system. Docker is required to build and deploy the application in a containerized environment.

- **Docker:** Make sure Docker is installed. If it is not installed, follow the instructions on the [official Docker website](https://www.docker.com/get-started).

## How to Access the Application

The demonstration can be accessed via the following URL:
- **URL:** `example.com/hints/`

To use the application:
1. You can log in with any username. No registration or password is required.
2. To test the application with multiple users, open the demo in different browsers or in incognito mode to ensure that the session is not affected by shared cookies.
3. Once logged in, both users can join the first problem together.
4. Users can communicate via a chat feature. Additionally, the application simulates responses from an ITS. 
    - If you type a message prefixed with `!`, it will be sent only to the specific user and will not be processed by the ITS.

## How to Run the Application Locally

To run the application locally, follow these steps:

1. Clone the repository or download the project as a ZIP file:
   ```bash
   git clone https://github.com/SPAM-research/its-adaptation-collaborative-demo
   ```
2. Navigate to the root directory of the cloned or extracted project folder using a terminal.
3. Run the following Docker command to build and start the application:
   ```bash
   docker compose up -d --build
   ```

This command will set up the necessary Docker containers and launch the application.

## Conclusion

This demo application provides a simplified visualization of how a collaborative learning environment can be integrated with an Intelligent Tutoring System, as described in our paper. Please note that this demo is a proof of concept and should not be considered a fully functional implementation of an ITS.