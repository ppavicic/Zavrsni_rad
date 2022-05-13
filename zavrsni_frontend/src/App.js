import Welcome from './components/Welcome'
import LoginTeacher from './components/LoginTeacher';
import TeacherProfile from './components/TeacherProfile';
import AddStudent from './components/AddStudent';
import AddTask from './components/AddTask';
import AddExercise from './components/AddExercise';
import Edit from './components/Edit';
import LoginStudent from './components/LoginStudent';
import Exercise from './components/Exercise';
import Statistics from './components/Statistics';
import ExerciseStatistic from './components/ExerciseStatistic';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" exact element={<Welcome />} />
          <Route path="/loginTeacher" exact element={<LoginTeacher />} />
          <Route path="/teacherProfile" exact element={<TeacherProfile />} />
          <Route path="/teacherProfile/addStudent" exact element={<AddStudent />}/>
          <Route path="/teacherProfile/addTask" exact element={<AddTask />}/>
          <Route path="/teacherProfile/addExercise" exact element={<AddExercise />}/>
          <Route path="/teacherProfile/edit" exact element={<Edit />}/>
          <Route path="/teacherProfile/statistics" exact element={<Statistics />}/>
          <Route path="/teacherProfile/statistics/exercise" exact element={<ExerciseStatistic />}/>
          <Route path="/loginStudent" exact element={<LoginStudent />} />
          <Route path="/exercise" exact element={<Exercise />} />
        </Routes>
    </Router>
  );
}

export default App;
