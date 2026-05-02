import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SortingVisualizer from './components/visualizer';
import LeetCode from './components/leedcode';
import Roadmap from './components/Roadmap';
// import { C_CHAPTERS } from './components/cRoadmap';
// import { CPP_CHAPTERS } from './components/cppRoadmap';
import { C_CHAPTERS, C_RESOURCES } from './components/cRoadmap';
import { CPP_CHAPTERS, CPP_RESOURCES } from './components/cppRoadmap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all routes - shows Header & Footer on every page */}
        <Route path="/" element={<Layout />}>
          
          {/* Main Visualizer Page */}
          <Route index element={<SortingVisualizer />} />

          {/* LeetCode Problems Page */}
          <Route path="leetcode-150" element={<LeetCode />} />

          {/* C Programming Roadmap */}
          <Route 
            path="c-roadmap" 
            element={
              <Roadmap 
                chapters={C_CHAPTERS}
                accentColor="blue"
                title="C Programming"
                subtitle="Master C from basics to advanced concepts — the foundation of all programming."
                icon="📘"
                resources={C_RESOURCES}
              />
            } 
          />

          {/* C++ Programming Roadmap */}
          <Route 
            path="cpp-roadmap" 
            element={
              <Roadmap 
                chapters={CPP_CHAPTERS}
                accentColor="purple"
                title="C++"
                subtitle="Learn C++ with OOP, STL, and modern C++ features — from beginner to expert."
                icon="⚡"
                resources={CPP_RESOURCES}
              />
            } 
          />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;