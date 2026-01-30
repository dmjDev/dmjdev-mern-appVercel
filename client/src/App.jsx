import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/auth/AuthProvider'
import { TasksProvider } from './context/tasks/TasksProvider'

import { Navbar } from './components/Navbar'

import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/auth/ProfilePage'

import TasksPage from './pages/tasks/TasksPage'
import TaskFormPage from './pages/tasks/TaskFormPage'

const App = () => {
  return (
    <AuthProvider>
      <TasksProvider>
        <BrowserRouter>
          <main className='container mx-auto px-5' style={{ minWidth: '550px' }}>
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='*' element={<HomePage />} />

              <Route path='/login' element={<LoginPage />} />
              <Route path='/login/:failCode' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route element={<ProtectedRoute rol="1" />}>
                <Route path='/profile/:id' element={<ProfilePage />} />
              </Route>

              <Route element={<ProtectedRoute rol="1" />}>
                <Route path='/tasks' element={<TasksPage />} />
                <Route path='/tasks/new' element={<TaskFormPage />} />
                <Route path='/tasks/:id' element={<TaskFormPage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TasksProvider>
    </AuthProvider>
  )
}

export default App
