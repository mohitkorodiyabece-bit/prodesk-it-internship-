Redis Caching Architecture for Property Listings

Architecture planning deliverable for ticket ENG-134560 under the Core Infrastructure Overhaul epic.

Project Information

Field

Value

Ticket ID

ENG-134560

Priority

P1 High

Story Points

5

Assignee

Mohit Karodiya

Reporter

Amit Sharma

Module Lead

Neha Gupta

Current Phase

Database Schema / Architecture Planning

Project Scope

This project defines the architecture for a property-listings platform that will use Redis caching to improve response times.

This phase includes:

Definitive database schema

Entity Relationship Diagram

REST API contracts

Redis key strategy

Cache expiration strategy

Cache invalidation rules

Redis failure fallback

Validation and sanitization planning

Accessibility requirements

Edge-case handling

Telemetry simulation

This phase does not include the final MongoDB, Express, Redis, or authentication implementation.

Architecture Overview

MongoDB will remain the permanent source of truth.

Redis will store temporary copies of frequently requested property data.

Client
  |
  v
REST API
  |
  v
Redis Cache
  |
  | Cache miss or Redis unavailable
  v
MongoDB

Cache-Aside Pattern

The client requests property data.

The server checks Redis.

When cached data exists, it is returned immediately.

When cached data does not exist, the server reads from MongoDB.

The returned database result is stored temporarily in Redis.

The response is returned to the client.

If Redis is unavailable, the request continues directly through MongoDB.

Redis is an optimization and is not the permanent database.

Database Schema

User

Field

Type

Rules

_id

ObjectId

Primary identifier

name

String

Required, sanitized

email

String

Required, unique

passwordHash

String

Required, never returned publicly

role

Enum

staff, manager, or admin

createdAt

Date

Automatically generated

updatedAt

Date

Automatically generated

Property

Field

Type

Rules

_id

ObjectId

Primary identifier

title

String

Required, sanitized

description

String

Required, sanitized

propertyType

String

Required

price

Number

Required, greater than or equal to zero

status

Enum

available, sold, rented, or inactive

address

Object

Structured address information

bedrooms

Number

Non-negative integer

bathrooms

Number

Non-negative number

area

Number

Positive number

images

String Array

Property image URLs

createdBy

ObjectId

References User._id

createdAt

Date

Automatically generated

updatedAt

Date

Automatically generated

Entity Relationship Diagram

erDiagram
    USER ||--o{ PROPERTY : creates

    USER {
        ObjectId _id
        string name
        string email
        string passwordHash
        string role
        date createdAt
        date updatedAt
    }

    PROPERTY {
        ObjectId _id
        string title
        string description
        string propertyType
        number price
        string status
        object address
        number bedrooms
        number bathrooms
        number area
        array images
        ObjectId createdBy
        date createdAt
        date updatedAt
    }

One user can create multiple property listings. Every property stores its creator in the createdBy field.

Planned API Contracts

Get all properties

GET /api/properties

Supported query parameters:

page
limit
search
city
status
propertyType
minPrice
maxPrice

Example success response:

{
  "success": true,
  "message": "Properties retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  },
  "cache": {
    "hit": false
  }
}

Empty response:

{
  "success": true,
  "message": "No data found",
  "data": []
}

Get one property

GET /api/properties/:id

Possible responses:

200 OK

400 Invalid property ID

404 Property not found

500 Internal server error

Create a property

POST /api/properties

Example request:

{
  "title": "Three Bedroom Apartment",
  "description": "Apartment located near the city centre.",
  "propertyType": "apartment",
  "price": 7500000,
  "status": "available",
  "address": {
    "city": "New Delhi",
    "state": "Delhi",
    "postalCode": "110001"
  },
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 1450
}

Possible responses:

201 Property created

400 Validation failed

401 Unauthorized

500 Internal server error

Update a property

PUT /api/properties/:id

After a successful update:

Update the MongoDB document.

Delete the matching property cache.

Invalidate affected property-list caches.

Return the updated property.

Delete a property

DELETE /api/properties/:id

After deletion, all related Redis cache entries must be removed.

Clear property cache

DELETE /api/cache/properties

This endpoint should be restricted to managers and administrators.

Standard Error Response

{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "price": "Price must be a positive number"
  }
}

Redis Key Strategy

Redis Key

Cached Content

TTL

property:{propertyId}

Individual property details

300 seconds

properties:list:{page}:{limit}

Paginated property listings

120 seconds

properties:search:{query}

Sanitized search results

120 seconds

properties:city:{city}

Properties filtered by city

180 seconds

properties:status:{status}

Properties filtered by status

180 seconds

Cache Invalidation

Cache entries must be invalidated when property data changes.

Property creation

Clear cached property lists

Clear affected city and status filters

Property update

Delete property:{propertyId}

Clear affected list, city, search, and status caches

Property deletion

Delete property:{propertyId}

Clear all affected list and filter caches

Redis Failure Handling

Redis failure must not crash the application.

Expected fallback:

Attempt Redis operation
        |
        v
Redis unavailable
        |
        v
Log cache failure
        |
        v
Read directly from MongoDB
        |
        v
Return normal API response

Edge-Case Handling

Empty states

When no property records match a request:

No data found

A blank screen must never be displayed.

Slow connectivity

The future interface must:

Show a visible loading indicator

Use an accessible live status message

Disable repeated submissions while processing

Display a retry option when appropriate

Invalid inputs

The future form must:

Prevent invalid submissions

Highlight invalid fields

Display field-specific messages

Associate messages with inputs using ARIA attributes

Duplicate actions

Buttons must be disabled while an asynchronous operation is already running.

Security Planning

All text inputs must be validated and sanitized before storage.

Planned protections include:

Server-side validation

XSS sanitization

Secure HTTP headers

Role-based authorization

Rate limiting

Environment variables for secrets

Password hashing

Safe error responses

No sensitive information in logs

Example environment variables:

MONGODB_URI=
REDIS_URL=
JWT_SECRET=

No real credentials should be committed to GitHub.

Accessibility

The interface is designed to support:

Semantic HTML

Keyboard navigation

Visible focus indicators

Skip navigation

Accessible buttons

Descriptive ARIA labels

Proper heading hierarchy

Table captions and column headers

Sufficient text contrast

Reduced-motion preferences

Screen-reader status announcements

Target: 100% Lighthouse accessibility score.

Telemetry Simulation

A simulated analytics event is logged when a primary interaction is completed:

console.log("[Analytics] User interacted with Redis Caching");

Design System

The interface follows a monochromatic corporate design system.

Design rules:

Reusable CSS variables

Consistent neutral colours

No random inline colour values

Consistent 8px, 16px, and 32px spacing steps

Clear typography hierarchy

Responsive desktop and mobile layouts

Technology

React

Vite

JavaScript

CSS

ESLint

HTML5

Run Locally

npm install
npm run dev

Open:

http://localhost:5173

Quality Checks

Run linting:

npm run lint

Create a production build:

npm run build

Preview the production build:

npm run preview

Definition of Done

Application runs without fatal errors

Production build completes successfully

ESLint passes with zero warnings

Database schema documented

ERD documented

API contracts documented

Redis key and TTL strategy documented

Empty-state behaviour documented

Slow-connectivity handling documented

Invalid-input handling documented

Redis failure fallback documented

Security and XSS protection documented

Accessibility requirements documented

Telemetry simulation included

No credentials or sensitive PII hardcoded

Author

Mohit Karodiya