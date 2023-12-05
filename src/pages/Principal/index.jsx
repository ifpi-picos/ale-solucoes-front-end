import React, { useState } from 'react';
import './styles.css';
import { UserOutlined, DiffOutlined, AppstoreAddOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme, Tooltip } from 'antd';
import ProductsModule from './products-module';
import BudgetsModule from './budgets-module';
import NewBudgetsModule from './budgets-module/newBudgets';
import MyBudgetsModule from './budgets-module/myBudgets';
import ProfileModule from './perfil-module';

const { Header, Content, Footer, Sider } = Layout;

const Principal = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('1'); // Set the initial selected item to '1'
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }


  const items = [
    getItem('Produtos', 'productsModule', <AppstoreAddOutlined />),
    getItem('Orçamentos', 'budgetsModule', <DiffOutlined />,[
      getItem('Novo Orçamento', 'newBudget'),
      getItem('Meus Orçamentos', 'myBudgets'),
    ]),
    getItem('Perfil', 'perfilModule', <UserOutlined />),
  ];


  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'productsModule':
        return (
          <div>
            <Header 
              style={
                {
                  background: '#fff',
                  textAlign: 'center',
                }
              }
            >
              <h1>Gestão de Produtos</h1>
            </Header>
            <ProductsModule />
          </div>
        );
      case 'bugetsModule':
        // Import and render the OrçamentosModule component here
        return (
          <div>
            <Header 
              style={
                {
                  background: '#fff',
                  textAlign: 'center',
                }
              }
            >
              <h1>Gestão de Orçamentos</h1>
            </Header>
            <BudgetsModule />
          </div>
        
        );
      case 'perfilModule':
        return (
          <div>
            <Header
              style={
                {
                  background: '#fff',
                  textAlign: 'center',
                }
              }
            >
              <h1>Perfil</h1>
            </Header>
            <ProfileModule />
          </div>
        );


      case 'newBudget':
        return(
          <div>
            <Header 
              style={
                {
                  background: '#fff',
                  textAlign: 'center',
                  fontSize: '35px',
                  fontWeight: 'bold',
                  color: '#1475a2',
                  marginBottom: '25px',
                }
              }
            >
              Novo Orçamento
            </Header>
            <NewBudgetsModule />
          </div>
        );
      
        case 'myBudgets':
          return(
            <div>
              <Header 
                style={
                  {
                    background: '#fff',
                    textAlign: 'center',
                    fontSize: '35px',
                    fontWeight: 'bold',
                    color: '#1475a2',
                    marginBottom: '25px',
                  }
                }
              >
                Meus Orçamentos
              </Header>
              <MyBudgetsModule />
            </div>
          );
    
      default:
        return (
          <div>
          <Header 
            style={
              {
                background: '#fff',
                textAlign: 'center',
                fontSize: '35px',
                fontWeight: 'bold',
                color: '#1475a2',
                marginBottom: '25px',
              }
            }
          >
            Novo Orçamento
          </Header>
          <NewBudgetsModule />
        </div>
        );
    }
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          onSelect={(selectedItem) => setSelectedMenuItem(selectedItem.key)}
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="header" style={{ padding: 0, background: colorBgContainer }}>
          <div className="logo" onClick={() => (window.location.href = "/principal")}></div>
          <Tooltip title="Sair">
            <Button 
              onClick={() => (window.location.href = "/")}
              className='btn-log-out'
              size='large'
              style={{
                border: 'none',
                marginRight: '20px',
              }}
            >
              <LogoutOutlined />
            </Button>
          </Tooltip>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 592, background: colorBgContainer }}>
            {renderContent()}
          </div>
        </Content>
        <Footer
          style={{
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            bottom: 0,
          }}
        >
          Desenvolvido por ALE Soluções | Copyright &copy; 2023
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Principal;