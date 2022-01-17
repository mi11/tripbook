import React, { FC, useState } from "react";
import { Button, Form, Input, Row, Col, Alert } from "antd";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { IUser } from "../interfaces/IUser";

interface ISignInProps {
  onSignIn: (user: IUser) => void;
}

export const SignIn: FC<ISignInProps> = ({ onSignIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post<IUser>(
        `http://localhost:3050/api/users/signin`,
        {
          email,
          password,
        }
      );

      setMessage("Success");
      setMessageType("success");
      setEmail("");
      setPassword("");

      onSignIn(res.data);

      navigate("/");
    } catch (err) {
      const serverError = err as AxiosError<{ message: string }>;
      if (serverError && serverError.response) {
        setMessage(serverError.response.data.message);
      } else {
        setMessage("something went wrong!");
      }

      setMessageType("error");
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Row>
          <Col offset={8} span={8}>
            <h2>Sign In</h2>
          </Col>
        </Row>

        {message ? (
          <Row style={{ marginBottom: "24px" }}>
            <Col offset={8} span={8}>
              <Alert message={message} type={messageType} />
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Form
          name="signin"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              value={email}
              onChange={(val) => setEmail(val.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(val) => setPassword(val.target.value)}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
