import React, { Component } from 'react';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon, List, Avatar, Button } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const {
  Content, Footer, Sider
} = Layout

const ButtonGroup = Button.Group;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.onCollapse = this.onCollapse.bind(this);
  }

  onCollapse(collapsed) {
    this.setState({ collapsed });
  }

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Link to="/file"> <Icon type="file" />檔案管理</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/connection"> <Icon type="plus" />連線管理</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/wifi"><Icon type="wifi" />Wi-Fi 管理</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/other"><Icon type="thunderbolt" />其他</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Route exact path="/" component={FileControl}></Route>
          <Route path="/file" component={FileControl}></Route>
          <Route path="/connection" component={ConnectionControl}></Route>
          <Route path="/wifi" component={WifiControl}></Route>
          <Route path="/other" component={Other}></Route>
        </Layout>
      </Router>
    );
  }
}

function FileControl() {
  return (
    <Layout>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: '#fff', minHeight: 440 }}>
          <List>
            <List.Item>
              <List.Item.Meta
                description="計算機"
                avatar={<Avatar size="small" icon="folder" />}>
              </List.Item.Meta>
            </List.Item>
            <List.Item>
              <List.Item.Meta
                description="多情劍客無情劍.pdf">
              </List.Item.Meta>
            </List.Item>
            <List.Item>
              <List.Item.Meta description="活着.pdf">
              </List.Item.Meta>
            </List.Item>
            <List.Item>
              <List.Item.Meta description="將軍底頭.pdf">
              </List.Item.Meta>
            </List.Item>
          </List>
        </div>
      </Content>
      <Footer>
        <ButtonGroup>
          <Button>
            <Icon type="folder-add" />
            <span>新增資料夾</span>
          </Button>
          <Button>
            <Icon type="upload" />
            <span>上傳</span>
          </Button>
          <Button>
            <Icon type="delete" />
            <span>刪除</span>
          </Button>
          <Button>
            <Icon type="edit" />
            <span>重新命名</span>
          </Button>
        </ButtonGroup>
      </Footer>
    </Layout>
  );
}

function ConnectionControl() {
  return (
    <Layout>
      <div>連線管理</div>
    </Layout>
  );
}

function WifiControl() {
  return (
    <Layout>
      <div>Wi-fi 管理</div>
    </Layout>
  );
}

function Other() {
  return (
    <Layout>
      <div>其他</div>
    </Layout>
  );
}

export default App;
