import logo from './logo.svg';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LogIn from './components/login';
import "../src/styles/style.css"
import UserMain from './components/UserMain';

function App() {
  const router = createBrowserRouter([{
      path: '/',
      element: <LogIn/>
    },
    {
      path: '/home',
      element: <h1>Hi</h1>
    }, 
    {
      path: '/user',
      element: <UserMain/>
    }])

  return (
    <>
        <RouterProvider router={router}/>
    </>
  );
}

export default App;
