// router.js
import React from "react";
import { Router, Route } from "react-router-dom";

const MyRouter = () => {
  const location = window.location;
  const navigator = window.navigator;

  return (
    <Router location={location} navigator={navigator}>
    </Router>
  );
};

export default MyRouter;
