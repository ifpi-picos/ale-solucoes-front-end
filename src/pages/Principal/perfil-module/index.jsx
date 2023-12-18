import React, { useEffect, useState } from "react";
import {Layout, Row, Col, Avatar, Card, Typography, message } from "antd";
import axios from "axios";
const ProfileModule = () => {
  const [user, setUser] = useState({});
const getUser = async () => {
  const result = await axios.get("http://localhost:3010/api/users/list-one/5",
  {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    }
  }).then((response) => {
    console.log(response,' responseeee')
    response.data.data[0].company_document = response.data.data[0].company_document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    response.data.data[0].postal_code = response.data.data[0].postal_code.replace(/(\d{5})(\d{3})/, "$1-$2");
    response.data.data[0].phone = response.data.data[0].phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

    setUser(response.data.data[0]);

  }).catch((error) => {
    message.error("Erro ao buscar usuário!");
    console.log(error);
  }
  );

}
useEffect(() => {
  getUser();
}
, []);

  return (
    <div>
      <Layout>
        <Row>
          <Col span={24}>
            <Card>
              <Row>
                <Col span={4} style={{
                  marginTop: 75,
                  textAlign: 'center',
                }}>
                  <Avatar  size={120} src="https://avatars.githubusercontent.com/u/38139389?v=4" />
                </Col>
                <Col span={20}>
                  <Typography.Title level={3}>{user.company_name}</Typography.Title>
                  <Typography.Text>{`${user.company_document}`}</Typography.Text>
                  <Typography.Title level={3}>Endereço</Typography.Title>
                  <Typography.Text>{`${user.street_name}, ${user.neighborhood}, ${user.city} - ${user.state}, ${user.postal_code}`}</Typography.Text>
                  <Typography.Title level={3}>Contato</Typography.Title>
                  <Typography.Text>{`${user.phone} | ${user.email}`}</Typography.Text>
                  
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Layout>
    </div>

  );
};

export default ProfileModule;