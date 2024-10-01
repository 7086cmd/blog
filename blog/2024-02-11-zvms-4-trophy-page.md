---
title: "ZVMS 4 Trophy Page"
date: "2024-02-11"
outline: deep
description: Nothing.
authors:
  - 7086cmd
---

<AppBlogPostHeader />

Tags: <Badge text="JavaScript / TypeScript" type="warning" /><Badge text="Web Development" type="info" /><Badge text="Technical Writing" type="tip" /><Badge text="English" type="danger" />

The `Trophy | Award` page is set to organise rewards of prizes properly when administrating volunteer information.

## Aim

The aim of this page is to provide a clear and concise way to display the rewards of prizes for volunteers.

## Features

- Department Permission (and above) can create `Trophy`s, which includes the following information:
  - Name
  - Description
  - Level (e.g. District, City, Province, National, International)
  - Type (e.g. Academic, Sports, Art, etc.)
  - Time
  - Instructor (Leading Teacher)
  - Awards (Arrays of `name` and `duration`)
- Secretary Permission (and above) apply for `Trophy`s but needed to be approved by the Department Permission (and above).
- Students (plain) can register for `Trophy`s, and select the awards they have won (e.g. First Prize, Second Prize, Third Prize, etc. It is claimed when creating the `Trophy`).
- Students (plain) can view their own `Trophy`s and the awards they have won.
- After confirming the `Trophy` with the leading teacher, system can automatically generate a special activity to record awards of prizes (volunteer hours).
- Students can decide which mode (`on-campus` or `off-campus`) to record the volunteer hours.

## API Scope

The `ZVMS` (4) prefix is `/api`, and the `Trophy` is `/trophy`.

The api of `ZVMS` (4) is following the RESTful API design. That means, there is no verbs in the ending. For example, the `GET` method of `Trophy` is `/api/trophy`, and the `POST` method of `Trophy` is `/api/trophy`. You need to specify the `id` with `:id` in the URL to get a specific `Trophy`. (e.g. `/api/trophy/:id`). The `PUT` method of `Trophy` is `/api/trophy/:id`, and the `DELETE` method of `Trophy` is `/api/trophy/:id`.

If you need to register for a member in a specific `Trophy`, you can use the `POST` method of `Trophy` with the `id` of the `Trophy` in the URL. (e.g. `/api/trophy/:id/member`).

The same as `activity` apis.

## Database Design

You can go to the `@zvms/zvms4-types` repo. We use `MongoDB` as the database. The `Trophy` schema is defined in the `Trophy` model. (In TypeScript, it is claimed as `Trophy` interface.)

## Frontend Design

It is a card-like page. If you are secretary or above, you can see a green (`text`, `circle`, and `bg` attributes in Element Plus) button on the right above corner.

You are able to register, view in each card. The card is flexible and can be adjusted to the screen size.

## Logics

The `Trophy | Award` is contained by `activity` page in the frontend. However, the `Trophy` is a separate model in the backend.

So the breadcrumb of `Create Trophy` is `View` -> `Trophy` -> `Create Trophy`.
