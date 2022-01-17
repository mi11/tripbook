import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Table } from "antd";
import { IUser } from "../interfaces/IUser";
import { useNavigate } from "react-router-dom";

interface IDataSource extends Omit<IUser, "admin"> {
  key: string;
  admin: string;
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Admin",
    dataIndex: "admin",
    key: "admin",
  },
];

export const Users: FC<{ authorized: boolean }> = ({ authorized }) => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<IDataSource[]>([]);

  useEffect(() => {
    if (!authorized) {
      navigate("/");
    }

    axios
      .get<IUser[]>("http://localhost:3050/api/users")
      .then((res) => res.data)
      .then((data) => {
        const records = [];
        for (const user of data) {
          records.push({
            key: user.id + "",
            ...user,
            admin: user.admin ? "TRUE" : "FALSE",
          });
        }

        setDataSource(records);
      });
  }, [authorized, navigate]);

  return (
    <Row>
      <Col offset={2} span={20}>
        <Table dataSource={dataSource} columns={columns} size="small" />
      </Col>
    </Row>
  );
};
