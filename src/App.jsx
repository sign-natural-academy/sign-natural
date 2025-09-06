import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/layout/Loader";
import ScrollToTop from "./components/layout/ScrollToTop";

/* Lazy load pages for performance */
const Homepage = lazy(() => import("./components/pages/Homepage"));
const LearnPage = lazy(() => import("./components/pages/LearnPage"));
const ExperientialWorkshopPage = lazy(() => import("./components/pages/ExperientialWorkshopPage"));
const SuccessStoriesPage = lazy(() => import("./components/pages/SuccessStoriesPaage"));
const Login = lazy(() => import("./components/pages/Login"));
const SignUp = lazy(() => import("./components/pages/SignUp"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./components/pages/RefundPolicy"));
const TermsAndConditions = lazy(() => import("./components/pages/TermsAndConditions"));
const UserDashboard = lazy(() => import("./components/pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./components/pages/AdminDashboard"));
const AboutPage = lazy(() => import("./components/pages/AboutPage"));
const NotFound = lazy(() => import("./components/pages/NotFound"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/workshop" element={<ExperientialWorkshopPage />} />
          <Route path="/stories" element={<SuccessStoriesPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
