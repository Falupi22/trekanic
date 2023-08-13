import logo from './logo.svg'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './components/Login'
import "../src/styles/style.css"
import Account from './components/Account'
import Test from './components/Test'

function App() {
  const router = createBrowserRouter([{
      path: '/',
      element: <Login/>
    },
    {
      path: '/home',
      element: <h1>Hi</h1>
    }, 
    {
      path: '/account',
      element: <Account/>
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
