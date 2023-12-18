import React, { useState} from 'react';
import { Button, Drawer, Row, Col, Form, Input, Spin, message } from 'antd';
import axios from 'axios';
const DrawerUpdateProduct = ({
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
    const result = await axios.put(`http://localhost:3010/api/products/update/${values.code}`, {
      product_name: values.product_name,
      code: values.code,
      value: parseFloat(values.value),
      unit_of_measurement: values.unit_of_measurement,
      category: values.category,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
    }).then((response) => {
        form.resetFields();
        onClose();
    
        if(response.status === 200) {
          message.success('Produto atualizado com sucesso!');
    
          return true;
        }
        else {
          message.error('Erro ao atualizar produto!');
        }
      }
    ).catch((error) => {
      message.error('Erro ao atualizar produto!');
    }
    );
        

  }

  return (
    <>
      <Drawer
        title="Atualizar Produto"
        placement={'right'}
        width={500}
        onClose={onClose}
        open={open}
      >
        <Form 
          layout="vertical" 
          name='update_product'
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
export default DrawerUpdateProduct;