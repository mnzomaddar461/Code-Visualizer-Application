import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SortingVisualizer from './components/visualizer';
import LeetCode from './components/leedcode';
import Roadmap from './components/Roadmap';
import Compiler from './components/Compiler';
import { C_CHAPTERS, C_RESOURCES } from './components/cRoadmap';
import { CPP_CHAPTERS, CPP_RESOURCES } from './components/cppRoadmap';
import DocumentPage from './components/DocumentPage';

// ✅ OnboardingTour এখান থেকে সরানো হয়েছে — Layout.jsx এ নিয়ে যাওয়া হয়েছে

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SortingVisualizer />} />
          <Route path="leetcode-150" element={<LeetCode />} />
          <Route path="compiler" element={<Compiler />} />
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
        <Route path="documentation" element={<DocumentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;