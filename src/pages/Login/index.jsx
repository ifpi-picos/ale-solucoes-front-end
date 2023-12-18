import React from 'react';
import './styles.css';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';

const onFinish = async (values) => {
  const result = await axios.post('http://localhost:3010/api/users/login', {
    company_document: values.company_document,
    password: values.password,
  }).then((response) => {
    localStorage.setItem('user', response.data.data.id);
    localStorage.setItem('token', response.data.data.token);
    if(response.status === 200) {
      message.success('Login realizado com sucesso!');
      window.location.href = "/principal";
    } else {
      message.error('Erro ao fazer login!');
    }
  }
  ).catch((error) => {
    message.error('Erro ao fazer login!');
  });

  return result;
};
const onFinishFailed = (errorInfo) => {
  message.error('Erro ao fazer login!');
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
              label="CNPJ"
              name="company_document"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira seu CNPJ!',
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
