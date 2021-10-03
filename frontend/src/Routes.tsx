import React from "react";
import { Switch, Route } from "react-router-dom";
import NewMoney from "./views/NewMoney/NewMoney";
import ViewMoney from "./views/ViewMoney/ViewMoney";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/newmoney" component={NewMoney} />
      <Route exact path="/viewmoney" component={ViewMoney} />
    </Switch>
  );
};

export default Routes;
