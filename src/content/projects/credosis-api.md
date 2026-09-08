---
title: "CredosisApi - Meeting Booking & Business Operations Backend"
summary: "A .NET backend that runs a Calendly-style meeting scheduler and the admin console behind it: safe booking under load, Google Calendar + Meet sync, and email that actually gets delivered."
timeframe: "2026"
tech:
    - ".NET 8"
    - "ASP.NET Core"
    - "EF Core"
    - "PostgreSQL"
    - "Google Calendar API"
    - "Docker"
    - "JWT"
links:
    - label: "Website"
      url: "https://credosis.com/contact#book"
order: 1
featured: true
draft: false
---

## What it is

CredosisApi is the in-house booking and business-operations backend I design and
build at [Credosis](https://credosis.com). It powers a Calendly-style meeting
scheduler and the admin console that sits behind it — from booking and
scheduling through to operational workflows.

## What it does

- **Safe booking under load** — availability is modelled so two clients can't
  claim the same slot, even when the calendar is busy.
- **Calendar + Meet sync** — bookings create events and video-conference links
  through the Google Calendar API.
- **Reliable transactional email** — mail around bookings and operations is
  wired so it actually lands in the inbox.

## How it's built

ASP.NET Core Web API with Entity Framework Core over PostgreSQL, JWT
authentication, Docker for local/CI parity, and the Google Calendar API for the
scheduling side. The frontend that consumes these endpoints is a Next.js and
TypeScript app.
