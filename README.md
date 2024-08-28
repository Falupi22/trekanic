# Trekanic README

Welcome to Trekanic! This README provides all the necessary information about our online platform, which allows exclusive clients to schedule their appointments effortlessly using the internet.

# Screenshots

- Log in ![Alt text](/assets/screenshots/login.png "Log in page")
- Client ![Alt text](/assets/screenshots/client.png "Client page")
- Admin ![Alt text](/assets/screenshots/admin.png "Admin page")

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [User Guide](#user-guide)
- [License](#license)

## Introduction

Trekanic is a premium online scheduling platform designed for exclusive clients who seek convenience and efficiency in managing their appointments. Our mobile-friendly interface ensures that customers can book, modify, and cancel appointments directly from the internet, anytime and anywhere. 

## Features

- **Easy Scheduling:** Clients can book appointments with just a few taps.
- **Appointment Management:** Modify or cancel appointments easily.
- **Notifications:** Receive reminders and notifications about changes in your appointments.
- **Exclusive Access:** Only available to verified, exclusive customers.
- **User-Friendly Interface:** Intuitive and easy-to-navigate platform.

## Getting Started

### Prerequisites

Before you begin, ensure you meet the following requirements:

- Node v20.15.0

### Installation

1. Clone the repo
2. `` npm install `` (containing repo first, then client and server repos)
3. Create a .env for the server, then configure :

- SESSION_SECRET (for the sessions)
- DB_CONNECTION_STRING (your DB)
- PORT (of the server)
- EMAIL (email of the bot that sends notifications)
- PASSWORD (password of the bot that sends notifications)

4. Configure the DB with test.issues and test.issueCategories from ./assets/data
5. Run with the designated scripts in the corresponding package.json file of each subrepo, or run for both subrepos
   from the parent folder. For example:
   `` npm run build:all ``
   `` npm run start:all `` (Not for production)

## User Guide

### Booking an Appointment

1. **Log In:** Enter your exclusive client credentials to log in.
2. **Main page:** At the upper right corner of the appointment's list a plus button appears. Click it!
3. **Pick a Date and Time:** Set the values you wish.
4. **Confirm:** Review your appointment details and confirm the booking.

### Modifying an Appointment

1. **Log In:** Enter your exclusive client credentials to log in.
2. **Main page:** Any appointment has a hamburger-like button on the upper right. Hover on it and an edit button will appear. Click it!
3. **Edit:** Make the necessary changes.
4. **Save:** Save your changes.

### Cancelling an Appointment

1. **Log In:** Enter your exclusive client credentials to log in.
2. **Main page:** Any appointment has a hamburger-like button on the upper right. Hover on it and a bin button will appear. Click it!
3. **Cancel:** Select the appointment you wish to cancel and confirm the cancellation.

### Admin Tasks

1. **Log In:** Enter your exclusive client credentials to log in (admin credentials).
2. **Main page:** Use the scheduler to explore appointments. Click on one to edit or delete it.
3. **Edit/Delete:** Set your values, the click edit, or delete the appointment permanently.
4. **Auto Email:** An email will be sent to the email address of the customer regarding the change or cancellation of the appointment.

## License

Trekanic is licensed under the [Apache 2.0](LICENSE).

---

If you have any additional questions or need further assistance, please feel free to reach out to our support team.
trekanicmailbot@gmail.com

