import React from 'react';
import './App.css';
import { Layout, Menu, Icon } from 'antd';
import { HashRouter, Link, Switch, Route, Redirect } from 'react-router-dom';
import Article from './pages/ArticleManage';
import Category from './pages/CategoryManage';
const { Header, Sider, Content } = Layout;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render() {
    return (
      <div>
        <HashRouter>
          <Layout style={{ minHeight: '100vh' }} id="layout">
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Link to="/category">
                    <Icon type="read" />
                    <span>首页</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/article">
                    <Icon type="slack" />
                    <span>文章管理</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Header>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  background: '#fff',
                  minHeight: 280,
                }}
              >
                <Switch>
                  {/* 重定向 */}
                  <Redirect exact from="/" to="/category"></Redirect>
                  <Route exact path='/article' component={Article} />
                  <Route exact path='/category' component={Category} />
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </HashRouter>
      </div>
    )
  };
}

export default App;
