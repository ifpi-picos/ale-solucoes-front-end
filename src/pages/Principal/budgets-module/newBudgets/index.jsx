import React, {useState, useEffect} from 'react';
import { Form, Input, Button, Select} from 'antd';
import { validateCPF } from '../../../../utils/validateCpf';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
const { Option } = Select

const NewBudgetsModule = () => {
    const [validadeStatusCpf, setValidadeStatusCpf] = useState('primary');
    const [products, setProducts] = useState([]);
    const [form] = Form.useForm();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedProductsArray, setSelectedProductsArray] = useState([]);	
    const [discount, setDiscount] = useState(0);
    const [pdfBase64, setPdfBase64] = useState('');
    const [rows, setRows] = useState([]);
    
    function downloadPDF(pdf) {
      const linkSource = `data:application/pdf;base64,${pdf}`;
      const downloadLink = document.createElement("a");
      
      const fileName = "orçamento.pdf";
  
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      

      }

    const onFinish = async (values) => {
      const products = [];
      for (let i = 0; i < values.products.length; i++) {
        for (let j = 0; j < selectedProductsArray.length; j++) {
          if (values.products[i] === selectedProductsArray[j].product_name) {
            if (!products.includes(selectedProductsArray[j])) {
              products.push(selectedProductsArray[j]);
            }
          }
        }
      }
    
      for (let i = 0; i < products.length; i++) {
        if (products[i].quantity === undefined) {
          products[i].quantity = 1;
        }
      }
    
      const companyInfo = await axios.get('http://localhost:3010/api/users/list-one/5');
      const company = companyInfo.data.data;
      const data = {
        budget_name: `${values.client_name} - ${new Date().toLocaleDateString()}`,
        created_by: 5,
        client_name: values.client_name,
        client_document: values.client_document,
        payment_method: values.payment_method,
        products: products,
        value_discount: discount,
        value_total: invoiceSubtotal,
        value_with_discount: invoiceTotal,
        company_name: company.company_name,
        company_document: company.company_document,
        company_street: company.street_name,
        company_number: company.street_number,
        company_city: company.city,
        company_neiborhood: company.neighborhood,
        company_state: company.state,
        company_postal_code: company.postal_code,
      };
    
      const result = await axios.post('http://localhost:3010/api/budgets/create', data);
      const resultPdfBase64 = result.data.data;

      setPdfBase64(resultPdfBase64);

      downloadPDF(resultPdfBase64);
      
      // Reset form and state variables
      form.resetFields();
      setRows([]);
      setSelectedProducts([]);
      setSelectedProductsArray([]);
      setDiscount(0);
      setValidadeStatusCpf('primary');
    };
    
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
          client_document: cpf.target.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
        });
        }
      }
      
    const getAllProducts = async () => {
        const response = await fetch('http://localhost:3010/api/products/list-all');
        const data = await response.json();

        setProducts(data.data)

        return data;
    }

    const renderProducts = () => {
        return products.map((product) => {
            return (
                <Option data={product} key={product.id} value={product.product_name}>{product.product_name}</Option>
            )
        })
    }

    const getSelectedProducts = (value) => {
        const arrayProductsSelected = value.map((product) => {
            return products.find((productSelected) => {
                return productSelected.product_name === product
            })
        })
            
       
        setSelectedProductsArray(arrayProductsSelected)
        setSelectedProducts(value)
        
      }

  //===== TABLE =====
  const renderRows = () => {
    return rows.map((row) => (
        <TableRow key={row.desc}>
          <TableCell  style={{
              width: 50,
          }}>{row.desc}</TableCell>
          <TableCell align="right">
          <Input value={row.qty} onChange={(event) => handleQuantityChange(row, event)}/>
          </TableCell>
          <TableCell align="right">{ccyFormat(row.unit)}</TableCell>
          <TableCell align="right">{ccyFormat(row.price)}</TableCell>
        </TableRow>
      ))
  }
  

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const handleQuantityChange = (row, event) => {
  const newRows = [...rows];
  const index = rows.indexOf(row);
  newRows[index].qty = event.target.value;
  if(event.target.value === '') {
    event.target.value = 1;
  }
  newRows[index].price = newRows[index].qty * newRows[index].unit;
  for (let i = 0; i < selectedProductsArray.length; i++) {
    if(newRows[index].desc === selectedProductsArray[i].product_name) {
      selectedProductsArray[i].quantity = parseInt(newRows[index].qty);
    }
    
  }

  setRows(newRows);
};

const handleDiscountChange = (event) => {
  const verifyNaN = isNaN(event.target.value)

  if(verifyNaN === true) {
    setDiscount(0);
    return;
  }

  const newDiscount = parseFloat(event.target.value);
  setDiscount(newDiscount);
};


const invoiceSubtotal = subtotal(rows);
const discountValue = discount / 100 * invoiceSubtotal;
const invoiceTotal = invoiceSubtotal - discountValue;


useEffect(() => {
  const newRows = [];
  for (const product of rows) {
    newRows.push(product);
  }

  for (const selectedProduct of selectedProducts) {
    const product = products.find((product) => product.product_name === selectedProduct);


    const productExists = newRows.find((row) => row.desc === product.product_name);

    if (!productExists) {
      newRows.push(createRow(product.product_name, 1, parseFloat(product.value)));
    }
  }

  setRows(newRows);
}, [selectedProducts]);

  
    return (
      <div>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            form={form}
            autoComplete="off"
          >
            <Form.Item 
            label="Produtos"
            name="products"
            rules={[
                {
                  required: true,
                  message: 'Por favor, selecione pelo menos um produto!',
                  type: 'array',
                },
              ]}
            >

            <Select mode="multiple" placeholder="Por favor, selecione pelo menos um produto!" onClick={getAllProducts} onChange={getSelectedProducts}>
                {renderProducts()}
              </Select>  

            </Form.Item>

            <Form.Item
              label="Nome do cliente"
              name="client_name"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome do cliente!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="CPF do cliente"
              name="client_document"
              tooltip="CPF, sem pontos e traços"
              hasFeedback validateStatus={validadeStatusCpf}
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o CPF do cliente',
                },
              ]}
            >
              <Input status={validadeStatusCpf} onChange={onChangeFormatCpf} />
            </Form.Item>
            <Form.Item
              name="payment_method"
              label="Método de pagamento"
                rules={[
                    {
                    required: true,
                    message: 'Por favor, selecione o método de pagamento!',
                    },
                ]}
            >
              <Select placeholder="Por favor, selecione o método de pagamento!">
                <Option value="Dinheiro Físico">Dinheiro Físico</Option>
                <Option value="Cartão de Crédito">Cartão de Crédito</Option>
                <Option value="Cartão de Débito">Cartão de Débito</Option>
                <Option value="Pix">Pix</Option>
              </Select>
            </Form.Item>              
            <Form.Item style={{
              alignItems: 'right',
              justifyContent: 'right',
              display: 'flex',
            }}>
            </Form.Item>
            <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 20,
    }}>     
    <Button type="primary" htmlType="submit" onFinish={onFinish}>
       Gerar Orçamento
    </Button>
    </div>
    </Form>
         
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Detalhes
            </TableCell>
            <TableCell align="right">Valor</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{
              width: '60%',            
            }}>Produto</TableCell>
            <TableCell align="right" style={{
              width: 50,
            }}>Qtd.</TableCell>
            <TableCell style={{
              width: 50,
            }} align="right">Unid.</TableCell>
            <TableCell style={{
              width: 50,
            }} align="right">Valor Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRows()}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell>Desconto %</TableCell>
            <TableCell align="right">
              <Input value={discount} onChange={handleDiscountChange} />
            </TableCell>
            <TableCell align="right">{ccyFormat(discountValue)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
     </div>
    );
  }
  
  export default NewBudgetsModule;
  