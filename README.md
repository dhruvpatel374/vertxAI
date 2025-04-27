## VertxAI Creator Dashboard

## Features

## User Features

## Authentication:

        Secure login and signup with JWT-based authentication.
        Password hashing using bcrypt for enhanced security.
        Logout functionality with cookie clearing.

## Social Media Feed:

        Paginated feed displaying posts from X and Reddit.
        Actions to save, share, or report posts.
        Infinite scroll for seamless post loading.
        Deduplication of posts using externalId to prevent repeats.

## User Dashboard:

        Displays current credits with a visually appealing card.
        Credit history table showing amount, reason, and date, with color-coded positive/negative amounts.
        Saved posts table listing content, source, and creation date.
        Recent activity list showing user actions (e.g., post saves, reports) with timestamps.

## Profile Management:

        Users can complete their profile with details like age and gender.
        Profile completion status displayed in the dashboard.
        credits for completing profile first time

## Admin Features

## Admin Dashboard:

        Overview card showing the total number of users (excluding admins).
        Reported posts table with content, report reason, source, and date for moderation.
        User management table listing name, email, credits, saved posts count, and profile completion status.
        Ability to update user credits with a reason, logged in the user's credit history.

## User Management:

        Fetch all user data (excluding passwords) with populated saved posts.
        Edit user credits via a modal with input validation and toast notifications.
        Real-time updates to the user list and Redux store when credits are modified.

## Instruction For Run Locally

        first install Node Modules Using npm install command for client and server both
        then in server folder root add .env i provided text file in email for env variables or you can use your own i provided formate below
        PORT=7777
        DB_CONNECTION_SECRET=""
        JWT_SECRET="VertxAI@307"
        TWITTER_API_KEY=""
        TWITTER_BEARER_TOKEN=""
        than open two terminal client and server and run npm run dev

## admin Credential

        email:vertxai@gmail.com
        password : Vertxai@123
