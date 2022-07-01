# DevCamper

> Backend API for DevCamper application, which is a bootcamp directory website. Followed from Brad Traversey API masterclass.

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "./data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Demo

Extensive documentation with examples [here](https://documenter.getpostman.com/view/8923145/SVtVVTzd?version=latest)

BASE URL: "[http://localhost:7000/"](http://localhost:7000/)

## Endpoints

- [Bootcamps](#bootcamps)
  1. [Create new bootcamp](#1-create-new-bootcamp)
  1. [Get all bootcamps](#2-get-all-bootcamps)
  1. [Get single bootcamp](#3-get-single-bootcamp)
  1. [Get bootcamp within radius](#4-get-bootcamp-within-radius)
  1. [Update bootcamp](#5-update-bootcamp)
  1. [Bootcamp photo upload](#6-bootcamp-photo-upload)
  1. [Delete bootcamp](#7-delete-bootcamp)
- [Courses](#courses)
  1. [Create new course](#1-create-new-course)
  1. [Get courses from bootcamps](#2-get-courses-from-bootcamps)
  1. [Get all courses](#3-get-all-courses)
  1. [Get single course](#4-get-single-course)
  1. [Update course](#5-update-course)
  1. [Delete course](#6-delete-course)
- [Authentication](#authentication)
  1. [Register user](#1-register-user)
  1. [Login user](#2-login-user)
  1. [Forgot password](#3-forgot-password)
  1. [Get user](#4-get-user)
  1. [Logout user](#5-logout-user)
  1. [Reset password](#6-reset-password)
  1. [Update user](#7-update-user)
  1. [Update password](#8-update-password)
- [Admin](#admin)
  1. [Get all users](#1-get-all-users)
  1. [Get single user](#2-get-single-user)
  1. [Create user](#3-create-user)
  1. [Update user](#4-update-user)
  1. [Delete user](#5-delete-user)
- [Reviews](#reviews)
  1. [Get all reviews](#1-get-all-reviews)
  1. [Get reviews from bootcamp](#2-get-reviews-from-bootcamp)
  1. [Get single review](#3-get-single-review)
  1. [Create review](#4-create-review)
  1. [Update review](#5-update-review)
  1. [Delete review](#6-delete-review)

---

## Bootcamps

Bootcamps will be created and maintained by users with role "publisher".

To provide different courses publisher need to create bootcamp to store all the courses of same domain under one bootcamp.

Each bootcamp can have multiple courses but one publisher can have only one bootcamp

### 1. Create new bootcamp

Create a bootcamp

**Access**: Private

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/bootcamps
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
	{
		"name": "Devcentral Bootcamp",
		"description": "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
		"website": "https://devcentral.com",
		"phone": "(444) 444-4444",
		"email": "enroll@devcentral.com",
		"address": "45 Upper College Rd Kingston RI 02881",
		"careers": [
			"Mobile Development",
			"Web Development",
			"Data Science",
			"Business"
		],
		"housing": false,
		"jobAssistance": true,
		"jobGuarantee": true,
		"acceptGi": true
	}
```

### 2. Get all bootcamps

Get all bootcamps

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/bootcamps
```

### 3. Get single bootcamp

Get single bootcamp. Provide bootcamp id as param.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/bootcamps/:bootcampId
```

### 4. Get bootcamp within radius

Find bootcamp within radius of the pincode. Provide distance in meter.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/bootcamps/:pincode/:distance
```

### 5. Update bootcamp

Update details of the bootcamp. Only publisher published bootcamp and admin will have access to this route.

**Access**: Private

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/bootcamps/:bootcampId
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{ "name": "New Devworks Bootcamp"}
```

### 6. Bootcamp photo upload

Upload bootcamp cover photo. Only publisher published bootcamp and admin will have access to this route. Only PNG, JPG, JPEG, SVG files with size less than 1MB will be accepted.

**Access**: Private

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/bootcamps/:bootcampId/photo
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

| Key  | Value    | Description |
| ---- | -------- | ----------- |
| file | temp.png |             |

### 7. Delete bootcamp

Delete bootcamp. Only publisher published bootcamp and admin will have access to this route.

**Access**: Private

**_Endpoint:_**

```bash
Method: DELETE
URL: {{URL}}/api/v1/bootcamps/:bootcampId
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

## Courses

Courses belongs to bootcamps. One bootcamp can have multiple courses but each course must belong to a single bootcamp.

### 1. Create new course

Create new course

**Access**: Private

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/bootcamps/:bootcampId/courses
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
		"title": "Front End Web Development",
		"description": "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
		"weeks": 8,
		"tuition": 8000,
		"minimumSkill": "beginner",
		"scholarhipsAvailable": true
	}
```

### 2. Get courses from bootcamps

Get courses from individual bootcamps.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/bootcamps/:bootcampId/courses
```

### 3. Get all courses

Get all courses from all bootcamps

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/courses
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

### 4. Get single course

Get a single course with given id.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/courses/:id
```

### 5. Update course

Update course details. Only publisher published bootcamp and admin will have access to this route.

**Access**: Private

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/courses/:id
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "tuition": 11000
}
```

### 6. Delete course

Delete course with id. Only publisher published bootcamp and admin will have access to this route.

**Access**: Private

**_Endpoint:_**

```bash
Method: DELETE
URL: {{URL}}/api/v1/courses/:id
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{"minimumSkill": "beginner"}
```

## Authentication

Concerned with register, login, update password, reset password routes.

### 1. Register user

Register user. JWT token is generated.

**Access**: Public

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/auth/register
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "name": "Teset account",
    "email":"test@mail.com",
    "password":"1234",
    "role": "user"
}
```

### 2. Login user

Login user. JWT token is generated.

**Access**: Public

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/auth/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "name": "Publisher Account",
    "email": "publisher@gmail.com",
    "role": "publisher",
    "password": "123456"
}
```

### 3. Forgot password

Forgot password for generating reset password token and sending emails with reset token URL.

**Access**: Public

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/auth/forgot-password
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "email": "publisher@gmail.com"
}
```

### 4. Get user

Get logged in user.

**Access**: Private

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/auth/me
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

### 5. Logout user

Logout user.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/auth/logout
```

### 6. Reset password

Reset password.

**Access**: Public

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/auth/reset-password/:resetToken
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "password": "12345"
}
```

### 7. Update user

Update user details.

**Access**: Private

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/auth/update-user
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "name": "Publisher 2"
}
```

### 8. Update password

Update password if user logged in.

**Access**: Private

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/auth/update-password
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "currentPassword": "12345",
    "newPassword": "123456"
}
```

## Admin

Admin routes for CURD operations on users. Admin is super user and have access to all the routes and controls.

For creating admin user, follow these steps:

- Create user with any role
- Change role manually in database to "admin"

### 1. Get all users

Get all registered users.

**Access**: Private/Admin

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/auth/admin
```

### 2. Get single user

Get single user with id.

**Access**: Private/Admin

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/auth/admin/:id
```

### 3. Create user

Create user with admin access

**Access**: Private/Admin

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/auth/admin
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "name": "Test Account",
    "email": "test@mail.com",
    "password": "123456"
}
```

### 4. Update user

Update user details.

**Access**: Private/Admin

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/auth/admin/:id
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "role": "publisher"
}
```

### 5. Delete user

Delete user.

**Access**: Private/Admin

**_Endpoint:_**

```bash
Method: DELETE
URL: {{URL}}/api/v1/auth/admin/:id
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "role": "publisher"
}
```

## Reviews

Reviews can be published by users with role "user" and "admin". One user can only published single review on each bootcamp.

### 1. Get all reviews

Get all reviews from all bootcamps.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/reviews
```

### 2. Get reviews from bootcamp

Get reviews from individual bootcamps.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/bootcamps/:bootcampId/reviews
```

### 3. Get single review

Get single reviews.

**Access**: Public

**_Endpoint:_**

```bash
Method: GET
URL: {{URL}}/api/v1/reviews/:id
```

### 4. Create review

Post review on individual bootcamp.

**Access**: Private

**_Endpoint:_**

```bash
Method: POST
URL: {{URL}}/api/v1/bootcamps/:bootcampId/reviews
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
		"title": "Great Experience",
		"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra feugiat mauris id viverra. Duis luctus ex sed facilisis ultrices. Curabitur scelerisque bibendum ligula, quis condimentum libero fermentum in. Aenean erat erat, aliquam in purus a, rhoncus hendrerit tellus. Donec accumsan justo in felis consequat sollicitudin. Fusce luctus mattis nunc vitae maximus. Curabitur semper felis eu magna laoreet scelerisque",
		"rating": "8"
	}
```

### 5. Update review

Update reviews.

**Access**: Private

**_Endpoint:_**

```bash
Method: PUT
URL: {{URL}}/api/v1/reviews/:id
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

**_Body:_**

```js
{
    "title": "Splendid Experience",
    "rating": "10"
}
```

### 6. Delete review

Delete a review.

**Access**: Private

**_Endpoint:_**

```bash
Method: DELETE
URL: {{URL}}/api/v1/reviews/:id
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json |             |

---

[Back to top](#devcamper)
