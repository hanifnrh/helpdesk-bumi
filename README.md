# HELPDESK PROJECT

## Project info
Helpdesk for Enterprise (Ticketing System) about create ticket, approval, and user management with two roles, admin and user

## Requirement Backend and Database
### Create Ticket
ticket form:
- uuid (auto generated)
- branch (dropdown string)
- category (dropdown string)
- services (dropdown string)
- sub category (dropdown string)
- network (dropdown string)
- subjek (type string)
- description (fill string)
- attachment (can have many file, each file size max 10mb)
- priority (dropdown string)
- tags (type string, many)
- timestamp (time, now())
- profile (name, email, phone +62, department)

### Ticket Management
- status (dropdown string; open, in progress, resolve, closed) (default open)
- assignee (dropdown string, default unassigned)

### Profile
- name
- email
- phone +62
- department
- password
- role (admin, user)

### User Management (Only Admin)
- add user
- remove user
- reset password (default 'kerjaibadah')

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
