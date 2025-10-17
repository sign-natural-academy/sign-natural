# Sign Natural – Frontend

This is the frontend for the **Sign Natural** .  
The platform is designed to support **learners** and **instructors (admins)** by providing an accessible environment for learning, booking workshops/courses, and sharing experiences.

---

## 📌 Project Scope (Frontend)

The frontend captures the scope of the project by providing **role-based dashboards**:

### User Dashboard (Learners)
- **View Tutorials** – Browse and learn from available resources.
- **My Bookings** – Track booked workshops or courses.
- **Upload Story/Testimonial** – Share personal stories or experiences.
- **Profile** – Manage user information.
- **Logout**

### Admin Dashboard (Instructors)
- **Dashboard Overview** – High-level system stats.
- **Manage Courses & Workshops** – Add, edit, or remove courses/workshops.
- **Approve/Reject Testimonials** – Moderate learner stories/testimonials.
- **Manage Bookings** – View and confirm/cancel learner bookings.
- **Manage Users** – Oversee registered learners.
- **Settings** – Admin configuration.
- **Logout**

Both dashboards are fully **decoupled**:
- `DashboardLayout` → Learner-facing only (uses `Sidebar`).
- `AdminDashboardLayout` → Admin-facing only (uses `AdminSidebar`).

---

## 🛠️ Tech Stack

- **React** – Component-based UI.
- **React Router DOM** – Client-side routing.
- **TailwindCSS** – Styling.
- **Shadcn/UI** – Pre-built UI components.
- **Lucide Icons** – Icons.
- **Framer Motion** – Animations.

---

## 📂 Final Project Structure (Frontend)

```bash
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/                # Images, icons, static files
│   ├── components/
│   │   ├── AdminSidebar.jsx   # Sidebar for Admin only
│   │   ├── Sidebar.jsx        # Sidebar for User only
│   │   ├── Topbar.jsx         # Shared top navigation
│   │   └── common/            # Shared small components
│   ├── layouts/
│   │   ├── AdminDashboardLayout.jsx  # Layout for admin dashboard
│   │   └── DashboardLayout.jsx       # Layout for user dashboard
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageCourses.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── ApproveTestimonials.jsx
│   │   │   └── Settings.jsx
│   │   ├── User/
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── Tutorials.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── UploadStory.jsx
│   │   │   └── Profile.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Home.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx             # All app routes
├── .env.example               # Example environment config
├── .gitignore
├── package.json
└── README.md



Run Locally

Clone the project:

git clone https://github.com/your-username/sign-natural-frontend.git
cd sign-natural-frontend


Install dependencies:

npm install


Start the development server:

npm run dev

🌍 Deployment

Build the project:

npm run build


Preview production build locally:

npm run preview