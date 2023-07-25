import logo from './logo.svg';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LogIn from './components/login';
import "../src/styles/style.css"
import UserMain from './components/UserMain';
import Test from './components/Test';

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
    },
    {
      path: '/test',
      element: <Test/>
    }])

  return (
    <>
        <RouterProvider router={router}/>
    </>
  );
}

export default App;
