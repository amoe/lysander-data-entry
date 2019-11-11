import React from 'react';

import { Link, Switch, HashRouter, Route } from 'react-router-dom';


// Our components
import Workspace from './Workspace';
import FormikDemo from './FormikDemo';
import GraphView from './GraphView';
import AntdComponentDemo from './AntdComponentDemo';
import KeplerView from './KeplerView';


function About() {
    return (
        <h1>About</h1>
    );
}


const routes = {
    "/": [Workspace, "Workspace"],
    "/about": [About, "About"],
    "/kepler-view": [KeplerView, "Kepler View"],
    "/graph-view": [GraphView, "Graph View"],
    "/formik-demo": [FormikDemo, "Formik Demo"],
    "/antd-component-demo": [AntdComponentDemo, "Antd Component Demo"]
};

function FooRouter() {
    // Munge the list items
    const listItems = Object.entries(routes).map(
        ([route, [component, description]]) => {
            return (
                <li key={route}><Link to={route}>{description}</Link></li>
            );
        }
    );

    const switchItems = Object.entries(routes).map(
        ([route, [component, description]]) => {

            // The route needs to have the 'exact' prop otherwise it's going 
            // to override everything else!
            const optionalProps: any = {};
            if (route === '/') {
                optionalProps.exact = true;
            }

            const TheTargetComponent = component;
            return (
                <Route key={route} path={route} {...optionalProps}><TheTargetComponent /></Route>
            );
        }
    );


    return (
        <HashRouter>
            <div>
                <ul>
                    {listItems}
                </ul>
                <hr />
                <Switch>
                    {switchItems}
                </Switch>
            </div>
        </HashRouter>
    );
}

export default FooRouter;
