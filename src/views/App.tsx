import React from 'react';
import { Link, Switch, HashRouter, Route } from 'react-router-dom';


// Our components
import Workspace from './Workspace';
import FormikDemo from './FormikDemo';
import GraphView from './GraphView';
import AntdComponentDemo from './AntdComponentDemo';
import KeplerView from './KeplerView';
import {
    Layout, Menu, Breadcrumb,
} from 'antd';

const { Header, Content, Footer } = Layout;



function About() {
    return (
        <h1>About Lysander</h1>
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

const RouteMenuLink = ({ route, description }: any) => {
    return (
        <li key={route}><Link to={route}>Foo {description}</Link></li>
    );
};


function FooRouter() {
    // Munge the list items
    const listItems = Object.entries(routes).map(
        ([route, [component, description]]) => {
            return (
                <RouteMenuLink route={route} description={description} />
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
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}>
                        <Menu.Item key="1"><Link to="/about">About</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/home">Home</Link></Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <hr />
                        {listItems}
                        <Switch>
                            {switchItems}
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </HashRouter>
    );
}

export default FooRouter;


/* <ul>
                * {listItems}
                * </ul>*/
