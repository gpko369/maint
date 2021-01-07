import React from "react";
import { Switch, Route } from "react-router-dom";

export default (
  <Switch>
    <Route path="/" />
    <Route path="/login" />
    <Route path="/project/:id" />
    <Route path="/event/:id" />
  </Switch>
);
