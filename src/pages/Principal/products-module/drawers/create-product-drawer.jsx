import React, { useState} from 'react';
import { Button, Drawer, Space, Row, Col, Form, Input, Spin, message } from 'antd';
import axios from 'axios';
const DrawerCreateProduct = ({
open,
onClose, 
form, 
}) => {
  
  const [loading, setLoading] = useState(false);

  async function onChangeFormatPrice(value) {
    const formattedPrice = value.target.value.replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2").replace(/(?=(\d{3})+(\D))\B/g, ".");
      form.setFieldsValue({
        value: formattedPrice
      });
  };

  async function onFinish(values) {
    setLoading(true);
    values.value = parseFloat(values.value)
    const result = await axios.post('http://localhost:3010/api/products/create', {
      product_name: values.product_name,
      code: values.code,
      value: values.value,
      unit_of_measurement: values.unit_of_measurement,
      category: values.category,
      created_by: 1,
    });
    
    setLoading(false);
    form.resetFields();
    onClose();

    if(result.status === 200) {
      message.success('Produto criado com sucesso!');

      return true;
    } else {
      message.error('Erro ao criar produto!');
    } 
  }

  return (
    <>
      <Drawer
        title="Novo Produto"
        placement={'right'}
        width={500}
        onClose={onClose}
        open={open}
      >
        <Form 
          layout="vertical" 
          name='create_product'
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="product_name"
                label="Nome do Produto"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o nome do produto',
                  },
                ]}
              >
                <Input/>
              </Form.Item>  
            <Form.Item
                name="code"
                label="Código do Produto"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o código do produto',
                  },
                ]}
              >
                <Input/>
              </Form.Item>
              <Form.Item
                name="value"
                label="Preço do Produto"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira o preço do produto',
                  },
                ]}
              >
            <Input
              style={{ width: "100%" }}
              prefix="R$"
              onChange={onChangeFormatPrice}
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o preço do produto',
                },
              ]}
            />
              </Form.Item> 

              <Form.Item
                name="unit_of_measurement"
                label="Unidade de Medida"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira a unidade de medida do produto',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="category"
                label="Categoria do Produto" 
                rules={[
                  {
                    required: true,
                    message: 'Por favor, insira a categoria do produto',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <br />
          <br />
            <Row gutter={16} style={{
              display: 'flex',
              justifyContent: 'flex-end', 
              padding: '0px 10px 0px 10px',          
            }}>
              <Col span={6}>
              <Button danger type='primary' onClick={onClose} size='large'>Cancelar</Button>
              </Col>
              <Form.Item>
                {loading === false 
                  ?  
                  <Button type="primary" htmlType="submit" size='large' onFinish={onFinish}>
                  Registrar
                  </Button>
                  : 
                  <Spin />
                }
              </Form.Item>
            </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default DrawerCreateProduct;