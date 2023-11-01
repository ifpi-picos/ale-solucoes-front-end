import React from 'react';
import './styles.css';
import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function login() {
  return (
    <div className="login">
      <div className="header">
        <div className="logo" onClick={() => window.location.href = "/"}></div>
        <div className="menu"> 
        <button className="btn-sign-up" onClick={() => window.location.href = "/cadastro"}>Cadastro</button>
        </div> 
      </div>
      <div className="body">
        <div className="login-box">
          <h1 className="login-h1">Login</h1>
          <Form
            layout="vertical"
            name="basic"
            labelCol={{
              offset: 4,
              span: 16,
            }}
            wrapperCol={{
              offset: 4,
              span: 16,
              
            }}
            style={{
              maxWidth: 600,
              width: 350,
              marginTop: 25,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
            <Form.Item
              label="CPF ou CNPJ"
              name="CPF ou CNPJ"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira seu CPF ou CNPJ!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira sua senha!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 4,
                span: 16,
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 10,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" size='large'>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="footer">Desenvolvido por ALE Soluções | Copyright &copy; 2023</div>
    </div>
  );
}

export default login;
