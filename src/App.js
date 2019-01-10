import React, { Component } from 'react';
import './App.css';
import { Layout, Menu, Breadcrumb, Icon, List, Avatar } from 'antd';

const {
  Content, Footer, Sider,
} = Layout


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.onCollapse = this.onCollapse.bind(this);
  }

  onCollapse(collapsed) {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="file" />
              <span>檔案管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="plus" />
              <span>註冊</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="wifi" />
              <span>wi-fi 管理</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="thunderbolt" />
              <span>其他</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 460 }}>
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
            <Menu mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Icon type="folder-add" />
                <span>新增資料夾</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="upload" />
                <span>上傳</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="delete" />
                <span>刪除</span>
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="edit" />
                <span>重新命名</span>
              </Menu.Item>
            </Menu>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
