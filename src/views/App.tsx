import React from 'react';
import { 
    Link, Switch, HashRouter, Route, withRouter, RouteComponentProps 
} from 'react-router-dom';


// Our components
import Workspace from './Workspace';
import GraphView from './GraphView';
import KeplerView from './KeplerView';
import AdvancedView from './AdvancedView';
import AboutView from './AboutView';

//import FormikDemo from './FormikDemo';
//import FormikAntdView from './FormikAntdView';
//import AntdComponentDemo from './AntdComponentDemo';

import {
    Layout, Menu, Breadcrumb,
} from 'antd';

const { Header, Content, Footer } = Layout;

const routes = {
    "/": [KeplerView, "Map View"],
    "/graph-view": [GraphView, "Graph View"],
    "/about": [AboutView, "About"],
    "/advanced": [AdvancedView, "Advanced"],
    "/workspace": [Workspace, "Workspace"]
    //    "/formik-demo": [FormikDemo, "Formik Demo"],
    //    "/formik-antd": [FormikAntdView, "Formik Antd Demo"],
    //    "/antd-component-demo": [AntdComponentDemo, "Antd Component Demo"]
};

const ABOUT_TEXT = "Lysander Project, 2019-2020";


class FooRouter extends React.Component<RouteComponentProps> {
    render() {
        // Munge the list items
        const listItems = Object.entries(routes).map(
            ([route, [component, description]], index) => {
                return (
                    <Menu.Item key={route}><Link to={route}>{description}</Link></Menu.Item>

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
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
                        {listItems}
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <hr />
                        <Switch>
                            {switchItems}
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>{ABOUT_TEXT}</Footer>
            </Layout>
        );
    }
}

export default withRouter(FooRouter);
