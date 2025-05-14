

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import  {Footer}  from './components/Footer';
import Login  from './components/pages/Login';
import Signup from './components/pages/SignUp';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import RefundPolicy from './components/RefundPolicy';
import AdminDashboard from './components/pages/AdminDashboard';
import UserDashboard from './components/pages/UserDashboard';
import LearnPage from './components/pages/LearnPage';
import ExperientialWorkshopPage from './components/pages/ExperientialWorkshopPage';
import SuccessStoriesPage from './components/pages/SuccessStoriesPaage';
import NotFound from './components/pages/NotFound';

function App() {
  return (
    <Router>
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
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;

