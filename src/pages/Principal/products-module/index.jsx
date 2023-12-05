import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Tooltip, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import DrawerCreateProduct from './drawers/create-product-drawer';
import DrawerUpdateProduct from './drawers/update-product-drawer';


const ProductsModule = () => {
  const [data, setData] = useState([]); 
  const [openDrawerAddProduct, setOpenDrawerAddProduct] = useState(false);
  const [openDrawerUpdateProduct, setOpenDrawerUpdateProduct] = useState(false);

  const [form] = Form.useForm();

  async function onClickDeleteProduct(record) {
    const result = await axios.delete(`http://localhost:3010/api/products/delete/${record.code}`, {
      headers: {
        'Content-Type': 'application/json',
        }
        });

    if(result.status === 200) {
      message.success('Produto apagado com sucesso!');
      axios.get('http://localhost:3010/api/products/list-all')
      .then((response) => {
        const responseData = response.data;
        console.log(responseData)
        setData(responseData.data); 
      })
      .catch((error) => {
        console.error(error);
      });
    }
    else {
      message.error('Erro ao apagar produto!');
    }
  };

  async function onClickUpdateProduct(record) {
    form.setFieldsValue({
      product_name: record.product_name,
      code: record.code,
      value: record.value,
      unit_of_measurement: record.unit_of_measurement,
      category: record.category,
    });
    setOpenDrawerUpdateProduct(true);
  }


  const columns = [
    {
      title: 'Nome do Produto',
      width: 100,
      dataIndex: 'product_name',
      key: 'product_name',
      fixed: 'left',
    },
    {
      title: 'Código',
      width: 100,
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      width: 150,
    },
    {
      title: 'Unid. de Medida',
      dataIndex: 'unit_of_measurement',
      key: 'unit_of_measurement',
      width: 150,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Editar',
      key: 'operationEdit',
      fixed: 'right',
      width: 50,
      align: 'center',
      render: (record) => 
      <Tooltip title="Editar Produto">
        <Button type="primary" shape="circle" icon={<EditOutlined />} size='large' onClick={() => onClickUpdateProduct(record)} />
      </Tooltip>,
    },
    {
      title: 'Apagar',
      key: 'operationDelete',
      fixed: 'right',
      align: 'center',
      width: 50,
      render: (record) =>
      <Popconfirm
      title="Apagar Produto"
      description="Tem certeza que deseja apagar o produto?"
      okText="Sim"
      cancelText="Não"
      onConfirm={() => onClickDeleteProduct(record)}
      placement='left'
    >
      <Tooltip title="Apagar Produto">
        <Button 
          type="primary" 
          shape="circle" 
          icon={<DeleteOutlined/>} 
          size='large' danger 
        />
      </Tooltip>
    </Popconfirm>  
    },
  ];

  const handleOpenDrawerAddProduct = () => { 
    setOpenDrawerAddProduct(true); 
  };

  const handleCloseDrawerAddProduct = () => {
    form.resetFields();
    setOpenDrawerAddProduct(false); 
    axios.get('http://localhost:3010/api/products/list-all')
    .then((response) => {
      const responseData = response.data;
      console.log(responseData)
      setData(responseData.data); 
    })
    .catch((error) => {
      console.error(error);
    });
  };


  const handleCloseDrawerUpdateProduct = () => {
    form.resetFields();
    setOpenDrawerUpdateProduct(false); 
    axios.get('http://localhost:3010/api/products/list-all')
    .then((response) => {
      const responseData = response.data;
      console.log(responseData)
      setData(responseData.data); 
    })
    .catch((error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    axios.get('http://localhost:3010/api/products/list-all') 
      .then((response) => {
        const responseData = response.data;
        console.log(responseData)
        setData(responseData.data); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <DrawerCreateProduct open={openDrawerAddProduct} onClose={handleCloseDrawerAddProduct} form={form}/>
      <DrawerUpdateProduct open={openDrawerUpdateProduct} onClose={handleCloseDrawerUpdateProduct} form={form}/>
      <Tooltip title="Novo Produto">
        <Button
          type="primary"
          className="create-product-button"
          onClick={handleOpenDrawerAddProduct} 
          style={{
            marginBottom: 16,
          }}
          shape='circle'
          size={'large'}
        >
          <PlusOutlined />
        </Button>
      </Tooltip>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        scroll={{
          y: 400,
        }}
      />
    </div>
  );
};
export default ProductsModule;
