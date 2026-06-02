import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FamilyTreeCanvas from './FamilyTreeCanvas';
import PersonalProfile from './PersonalProfile';

const DemoTreeWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<FamilyTreeCanvas />} />
      <Route path="/profile/:id" element={<PersonalProfile />} />
    </Routes>
  );
};

export default DemoTreeWrapper;
