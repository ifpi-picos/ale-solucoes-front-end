import React, { useEffect, useState } from "react";
import {Layout, Row, Col, Avatar, Card, Typography } from "antd";
import axios from "axios";
const ProfileModule = () => {
  const [user, setUser] = useState({});
const getUser = async () => {
  const result = await axios.get("http://localhost:3010/api/users/list-one/5");
  console.log(result);
  result.data.data.company_document = result.data.data.company_document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  result.data.data.postal_code = result.data.data.postal_code.replace(/(\d{5})(\d{3})/, "$1-$2");
  result.data.data.phone = result.data.data.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

  setUser(result.data.data);

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