import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { SideBar } from './components/SideBar';
import { TimeTracker } from './components/TimeTracker';
import { RootState } from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const {isModalOpen} = useSelector((state: RootState) => state.clockify)
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(true)

  function toggleSidebar(){
    setIsSidebarShrunk(!isSidebarShrunk)
  }
  return (
    <Router  basename='/'> 
        <div className='container'>
          <div className={isModalOpen ? 'row header' : 'row header zIndex'}>
            <Header
              toggleSidebar={toggleSidebar}
            />
          </div>
          <div className='row'>
            <div className={`sidebar ${isSidebarShrunk ? 'shrink col-4' : 'col-4 col-lg-1'}`}>
              <SideBar
                isSidebarShrunk={isSidebarShrunk}
              />
            </div>
            <div className= {isSidebarShrunk ? 'col-11 width-expand' : 'col-11 col-width'}>
              <Routes>
                <Route path='/tracker' element={<TimeTracker/>}></Route>
              </Routes>
            </div>
          </div>
        </div> 
    </Router>
  );
}

export default App;
