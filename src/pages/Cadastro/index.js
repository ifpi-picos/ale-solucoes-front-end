import React from 'react';
import './styles.css';
import axios from 'axios';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Select,
    Spin,
    message,
     Space
  } from 'antd';

  const { Option } = Select;

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

function Cadastro() {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
      messageApi.open({
        type: 'success',
        content: 'This is a success message',
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    };
  
    const error = () => {
      messageApi.open({
        type: 'error',
        content: 'This is an error message',
      });
    };
  
    const warning = () => {
      messageApi.open({
        type: 'warning',
        content: 'This is a warning message',
      });
    };
  


    async function onFinish(values) {
      setLoading(true);
    
      const result = await axios.post('http://localhost:3010/api/users/create', {
        name: 'teste',
        password: values.password,
        email: values.email,
        document: values.document,
        phone: values.phone,
        postal_code: values.cep,
        street_number: '123',
        is_company: false,
      }, { headers: { 'Content-Type': 'application/json'} }
      );
    
      if (result.status === 200) {
        success();
      } else {
        error();
      }
      setLoading(false);

      console.log(result);
      form.resetFields();
    }
    


    const prefixSelector = (
      <Form.Item name="prefix" noStyle>
        <Select
          style={{
            width: 70,
          }}
        >
          <Option value="89">+89</Option>
        </Select>
      </Form.Item>
    );

  return (
    <div className="cadastro">
      <div className="header">
        <div className="logo" onClick={() => window.location.href = "/"}></div>
        <div className="menu"> 
        <button className="btn-sign-up">Cadastro</button>
        </div> 
      </div>
      <div className="body">
        <div className="register-box">
            <h1 className="login-h1">Cadastro</h1>
          <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              loading={loading}
              initialValues={{
                  prefix: '89',
              }}
              style={{
                  maxWidth: 600,
                  width: 350,
                  marginTop: 35,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
              }}
              scrollToFirstError
              > 
              <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                  {
                      type: 'email',
                      message: 'por favor, informe um e-mail válido!',
                  },
                  {
                      required: true,
                      message: 'Por favor, informe seu e-mail!',
                  },
                  ]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  name="password"
                  label="Senha"
                  tooltip="A senha deve conter no mínimo 8 caracteres, com letras e números"
                  rules={[
                  {
                      required: true,
                      message: 'Por favor, informe sua senha!',
                  },
                  ]}
                  hasFeedback
              >
                  <Input.Password />
              </Form.Item>

              <Form.Item
                  name="confirm"
                  label="Confirmar Senha"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                  {
                      required: true,
                      message: 'Por favor, confirme sua senha!',
                  },
                  ({ getFieldValue }) => ({
                      validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                      }
                      return Promise.reject(new Error('The new password that you entered do not match!'));
                      },
                  }),
                  ]}
              >
                  <Input.Password />
              </Form.Item>

              <Form.Item
                  name="document"
                  label="Documento"
                  tooltip="CPF ou CNPJ, sem pontos e traços"
                  rules={[
                  {
                      required: true,
                      message: 'Por favor, informe seu documento!',
                      whitespace: true,
                  },
                  ]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  name="phone"
                  label="Telefone"
                  rules={[
                  {
                      required: true,
                      message: 'Por favor, informe seu telefone!',
                  },
                  ]}
              >
                  <Input
                  addonBefore={prefixSelector}
                  style={{
                      width: '100%',
                  }}
                  />
              </Form.Item>

              <Form.Item
                  name="cep"
                  label="CEP"
                  tooltip="CEP, sem pontos e traços"
                  rules={[
                  {
                      required: true,
                      message: 'Por favor, informe seu CEP!',
                      whitespace: true,
                  },
                  ]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                  {
                      validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                  },
                  ]}
                  {...tailFormItemLayout}
              >
                  <Checkbox>
                  I have read the <a href="">agreement</a>
                  </Checkbox>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>  
                  {loading === false 
                    ?  
                    <Button type="primary" htmlType="submit" >
                    Register
                    </Button>
                    : 
                    <Spin />
                  }
              </Form.Item>
              </Form>
          </div>
      </div>
      <div className="footer">Desenvolvido por ALE Soluções | Copyright &copy; 2023</div>
    </div>
  );
}

export default Cadastro;
