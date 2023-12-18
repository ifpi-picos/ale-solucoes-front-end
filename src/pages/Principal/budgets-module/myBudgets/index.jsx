import React, {useState} from 'react';
import axios from 'axios';
import { Table, Tooltip, Button, Popconfirm, message } from 'antd';
import { format } from 'date-fns';
import { FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';



const MyBudgetsModules = () => {
    const [data, setData] = useState([]);


    function downloadPDF(pdf) {
        const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement("a");
        
        const fileName = "orçamento.pdf";
    
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        
    
    }
    
    const onClickDownloadPdf = async (record) => {
    
        const result = await axios.get(`http://localhost:3010/api/budgets/list-one/${record.key}`,
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
            }
        }
        ).then((response) => { 
          const resultPdfBase64 = response.data.data.budget_pdf;
          downloadPDF(resultPdfBase64);
        
        }).catch((error) => {
          message.error('Erro ao baixar orçamento!');
        }
        );

        return result;
          
    }
    
    const onClickDeleteBudget = async (record) => {
        const result = await axios.delete(`http://localhost:3010/api/budgets/delete/${record.key}`,
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
            }
        }).then((response) => {
          if(response.status === 200) {
              message.success('Orçamento apagado com sucesso!');                    
          }
          else {
            message.error('Erro ao apagar orçamento!');
          }
        }
        ).catch((error) => {
          message.error('Erro ao apagar orçamento!');
        }
        );
        return result;
      };
    
    
    
    const columns = [
      {
        title: 'Nome do Orçamento',
        width: 'auto',
        dataIndex: 'budget_name',
        key: 'budget_name',
        fixed: 'left',
      },
      {
        title: 'Valor',
        width: 150,
        dataIndex: 'value',
        key: 'value',
        fixed: 'left',
      },
      {
        title: 'Data de Criação',
        dataIndex: 'created_at',
        key: 'created_at',
        fixed: 'left',
      },
      {
        title: 'Visualizar',
        key: 'renderPdf',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (record) =>   
        <Tooltip title="Download Orçamento">
        <Button style={
            {border: 'none', backgroundColor: 'transparent'}
        } type="default" icon={< FilePdfOutlined/>} size='large' onClick={() => onClickDownloadPdf(record)} />
      </Tooltip>,
      },
      {
        title: 'Apagar',
        key: 'deletePdf',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (record) =>      
        <Popconfirm
        title="Apagar Orçamento"
        description="Tem certeza que deseja apagar o orçamento?"
        okText="Sim"
        cancelText="Não"
        onConfirm={() => onClickDeleteBudget(record)}
        placement='left'
      >
        <Tooltip title="Apagar Orçamento">
          <Button 
            type="default" 
            icon={<FileExcelOutlined />} 
            size='large' danger 
            style={{border: 'none', backgroundColor: 'transparent'}}
          />
        </Tooltip>
        </Popconfirm> 
      },
    ];


    
    const getAllBudgets = async () => {
        const result = await axios.get('http://localhost:3010/api/budgets/list-all',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
    
        
        const data = result.data.data.map((budget) => ({  
            key: budget.id,
            budget_name: budget.budget_name,
            value: budget.value,
            created_at: format(new Date(budget.created_at), 'dd/MM/yyyy')
        }));
        setData(data);
        return data;
    }

    
    React.useEffect(() => {
        getAllBudgets();
    }, []);

    return (
        <div>
        <Table
            columns={columns}
            dataSource={data}
            scroll={{
            x: 1300,
            }}
        />
        </div>
        );
}

export default MyBudgetsModules;