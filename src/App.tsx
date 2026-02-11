import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { UserDetail } from './pages/UserDetail';
import { RuleEditor } from './pages/RuleEditor';
import { PlaybookEditor } from './pages/PlaybookEditor';
import { ThreatsPage } from './pages/ThreatsPage';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { SearchResults } from './pages/SearchResults';
import { Notifications } from './pages/Notifications';
import { VdiRequest } from './pages/VdiRequest';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/rules" element={<RuleEditor />} />
                <Route path="/automation" element={<PlaybookEditor />} />
                <Route path="/threats" element={<ThreatsPage />} />
                <Route path="/vdi-request" element={<VdiRequest />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
