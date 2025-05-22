import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import './App.css';
import Loader from './components/Loader'; // ✅ import animated loader




// Lazy loaded pages
const Homepage = lazy(() => import('./components/Homepage'));
const Login = lazy(() => import('./components/pages/Login'));
const Signup = lazy(() => import('./components/pages/SignUp'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));
const RefundPolicy = lazy(() => import('./components/RefundPolicy'));
const AdminDashboard = lazy(() => import('./components/pages/AdminDashboard'));
const UserDashboard = lazy(() => import('./components/pages/UserDashboard'));
const LearnPage = lazy(() => import('./components/pages/LearnPage'));
const ExperientialWorkshopPage = lazy(() => import('./components/pages/ExperientialWorkshopPage'));
const SuccessStoriesPage = lazy(() => import('./components/pages/SuccessStoriesPaage'));
const NotFound = lazy(() => import('./components/pages/NotFound'));
import ScrollToTop from './components/ScrollToTop';
import AboutPage from './components/pages/AboutPage';



function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/workshop" element={<ExperientialWorkshopPage />} />
          <Route path="/stories" element={<SuccessStoriesPage />} />
          <Route path="/About us" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
