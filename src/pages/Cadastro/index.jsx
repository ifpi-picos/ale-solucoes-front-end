  import React, {useState} from 'react';
import './styles.css';
import axios from 'axios';
import {
    Button,
    Form,
    Input,
    Select,
    Spin,
    message,
    Row,
    Col,
    DatePicker,
    InputNumber,
    Alert,
  } from 'antd';
import { validateCNPJ } from '../../utils/validateCnpj';
import { validateCPF } from '../../utils/validateCpf';

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
    const [validadeStatusCep, setValidadeStatusCep] = useState('primary');
    const [validadeStatusCnpj, setValidadeStatusCnpj] = useState('primary');
    const [validadeStatusCpf, setValidadeStatusCpf] = useState('primary');
    const [validadeStatusPhone, setValidadeStatusPhone] = useState('primary');
    const [valueEndereco, setValueEndereco] = useState({});
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

    const dateFormatList = ['DD/MM/YYYY'];

    async function onFinish(values) {
      setLoading(true);
      values.birthday_date = values.birthday_date.format('DD/MM/YYYY');
      values.company_document = values.company_document.replace(/\D/g, '');
      values.responsible_document = values.responsible_document.replace(/\D/g, '');
      values.phone = values.prefix + values.phone.replace(/\D/g, '');
      console.log(values);
      const result = await axios.post('http://localhost:3010/api/users/create', {
          company_name: values.company_name,
          email: values.email,
          password: values.password,
          company_document: values.company_document,
          responsible_name: values.responsible_name,
          responsible_document: values.responsible_document,
          birthday_date: values.birthday_date,
          street_name: values.street_name,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
          street_number: values.street_number,
          phone: values.phone,
          postal_code: values.postal_code,        
      }, { headers: { 'Content-Type': 'application/json'} }
      );
      console.log(result)
      if (result.status === 200) {
        success();
      } else {
        error();
      }
      setLoading(false);

      console.log(result);
      form.resetFields();
    }
    async function onChangeCep(cep) {
      if(cep.target.value.length !== 8){
        setValidadeStatusCep('warning')
        return;
      }

      const result = await axios.get(`https://viacep.com.br/ws/${cep.target.value}/json/`);
      if(result.data.erro === true) {
        setValidadeStatusCep('error')
        return;
      }
      setValidadeStatusCep('success')
      setValueEndereco(result.data);
      form.setFieldsValue({
        street_name: result.data.logradouro,
        neighborhood: result.data.bairro,
        city: result.data.localidade,
        state: result.data.uf,
      });
    }	

    async function onChangeFormatCnpj(cnpj) {     
      if(cnpj.target.value.length !== 14){
        setValidadeStatusCnpj('warning')
        return;
      }
      else {
        const validateCnpj = validateCNPJ(cnpj.target.value);
        if(validateCnpj === false) {
          setValidadeStatusCnpj('error')
          return;
        }

        setValidadeStatusCnpj('success')
        form.setFieldsValue({
        company_document: cnpj.target.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
      });
      }
    }

    async function onChangeFormatCpf(cpf) {
      if(cpf.target.value.length !== 11){
        setValidadeStatusCpf('warning')
        return;
      }
      else {
        const validateCpf = validateCPF(cpf.target.value);
        if(validateCpf === false) {
          setValidadeStatusCpf('error')         
          return;
        }

        setValidadeStatusCpf('success')
        form.setFieldsValue({
        responsible_document: cpf.target.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
      });
      }
    }

    async function onChangeFormatPhone(phone) {
      if(phone.target.value.length !== 11){
        setValidadeStatusPhone('warning')
        return;
      }
      else {
        setValidadeStatusPhone('success')
        form.setFieldsValue({
        phone: phone.target.value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
      });
      }
    }
    
    const prefixSelector = (
      <Form.Item name="prefix" noStyle>
        <Select
          style={{
            width: 70,
          }}
        >
          <Option value="55">+55</Option>
        </Select>
      </Form.Item>
    );

  return (
    <div className="cadastro">
      <div className="header">
        <div className="logo" onClick={() => window.location.href = "/"}></div>
        <div className="menu"> 
        <button className="btn-sign-in" onClick={() => window.location.href = "/login"}>Login</button>
        </div> 
      </div>
      <div className="body">
        <div className="register-box">
          <h1 className="register-h1">Cadastro</h1>
          <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              loading={loading}
              initialValues={{
                  prefix: '+55',
              }}
              style={{                    
                  marginTop: 20,
                  marginLeft: 20, 
                  marginRight: 20,                                                 
              }}
              scrollToFirstError
              > 
              <Row gutter={[48, 16]}>
                <Col span={12}>
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
                          min: 8,
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
                      name="company_document"
                      label="CNPJ da Empresa"
                      tooltip="CNPJ, sem pontos e traços"
                      hasFeedback validateStatus={validadeStatusCnpj}
                      rules={[
                      {
                          required: true,
                          formatter: value => value.replace(/\D/g, ''),
                          message: 'Por favor, informe seu CNPJ!',
                      },
                      ]}
                  >
                      <Input status={validadeStatusCnpj} onChange={onChangeFormatCnpj}/>
                  </Form.Item>

                  <Form.Item
                      name="phone"
                      label="Telefone"
                      tooltip="Telefone, sem pontos e traços"
                      hasFeedback validateStatus={validadeStatusPhone}
                      rules={[
                      {
                          required: true,
                          message: 'Por favor, informe seu telefone!',
                      },
                      ]}
                  >
                      <Input
                      status={validadeStatusPhone}
                      onChange={onChangeFormatPhone}
                      addonBefore={prefixSelector}
                      style={{
                          width: '100%',
                      }}
                      />
                  </Form.Item>

                  <Form.Item
                      name="postal_code"
                      label="CEP"
                      tooltip="CEP, sem pontos e traços"
                      hasFeedback validateStatus={validadeStatusCep}
                      rules={[
                      {
                          required: true,
                          message: 'Por favor, informe seu CEP!',
                      },
                      ]}
                  >
                      <Input status={validadeStatusCep} onChange={onChangeCep}/>
                </Form.Item>
                  <Form.Item
                      name="birthday_date"
                      label="Data de criação"
                      rules={[
                      {
                          required: true,
                          message: 'Por favor, informe a data de criação da empresa!',
                      },
                      ]}
                  >
                    <DatePicker format={dateFormatList}/>
                  </Form.Item> 
                </Col>
                <Col span={12}>               
                  <Form.Item
                        name="responsible_name"
                        label="Nome do Responsável"
                        tooltip="Responsável pela empresa"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe o nome do responsável!',

                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="responsible_document"
                        label="Documento do Responsável"
                        tooltip="CPF, sem pontos e traços"
                        hasFeedback validateStatus={validadeStatusCpf}
                        rules={[
                        { 
                            required: true,
                            message: 'Por favor, informe o CPF do responsável!',
                        },
                        ]}
                    >
                        <Input status={validadeStatusCpf} onChange={onChangeFormatCpf}/>
                    </Form.Item>
                    <Form.Item
                        name="street_name"
                        label="Rua"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe o nome da rua!',

                        },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="neighborhood"
                        label="Bairro"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe o bairro!',

                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>   
                    <Form.Item
                        name="city"
                        label="Cidade"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe sua cidade!',

                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>    
                    <Form.Item
                        name="state"
                        label="Estado"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe seu estado!',

                        },
                        ]}
                    >
                      <Input/>
                    </Form.Item>   
                    <Form.Item
                        name="street_number"
                        label="Número"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe o número do endereço!',
                        },
                        ]}
                    >
                      <InputNumber min={1}/>
                    </Form.Item>        
                </Col>          
            </Row>
            <Row gutter={[48, 16]}>
              <Col span={12}>
                <Form.Item
                        name="company_name"
                        label="Nome da Empresa"
                        rules={[
                        {
                            required: true,
                            message: 'Por favor, informe o nome da empresa!',

                        },
                        ]}
                    >
                      <Input />
                </Form.Item>   
              </Col>
              <Col span={12} style={{textAlign: 'right'
              }}>   
                <Form.Item {...tailFormItemLayout}>  
                    {loading === false 
                      ?  
                      <Button type="primary" htmlType="submit" size='large'>
                      Register
                      </Button>
                      : 
                      <Spin />
                    }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="footer">Desenvolvido por ALE Soluções | Copyright &copy; 2023</div>
    </div>
  );
}

export default Cadastro;
