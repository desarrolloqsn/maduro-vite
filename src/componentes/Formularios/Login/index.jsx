import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import './formlogin.css';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './../../../redux/actions';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error,setError]= useState("")
  const onFinish = (values) => {
    const { username, password } = values;

    // Valida los usuarios y contraseñas específicas
    if (username === 'analistas' && password === 'qsn123') {
      const user = {
        username: 'analistas',
        roles: ['admin'],
      };

      dispatch(loginSuccess(user));
      navigate('/dashboard'); // Navega al usuario a "/dashboard"
    } else if (username === 'qsnvzla' && password === 'qsnvzla2024') {
      const user = {
        username: 'qsnvzla',
        roles: ['user'],
      };
      dispatch(loginSuccess(user));
      navigate('/dashboard'); // Navega al usuario a "/dashboard"
      setError("Ingresando..")
    } else {
      setError("Usuario o contraseña incorrecta")
      // dispatch(loginFailure('Usuario o contraseña incorrectos'));
    }

    // Guardar el usuario y la contraseña en el localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  };

  useEffect(() => {
    // Verificar si hay usuario y contraseña almacenados en el localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if(storedUsername !== "analistas" ||storedUsername !== "qsnvzla" && storedPassword !== "qsn123" || storedPassword !== "qsnvzla2023"){
      setError("Usuario o contraseña incorrecta")
    } else {
      // Si se encuentran almacenados, realizar el inicio de sesión automáticamente
      if (storedUsername === "analistas" ||storedPassword === "qsnvzla" && storedPassword === "qsn123" || storedPassword === "qsnvzla2023") {
        const user = {
          username: storedUsername,
          roles: ['user'],
        };
        dispatch(loginSuccess(user));
        navigate('/dashboard'); // Navega al usuario a "/dashboard"
      }
    }

  }, [dispatch, navigate]);

  return (
      <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
      >
        <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Por favor ingresá un usuario',
              },
            ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Usuario" />
        </Form.Item>
        <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Por favor ingresá una contraseña',
              },
            ]}
        >
          <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Contraseña"
          />
        </Form.Item>
        {error && <div className="error-message">{error}</div>}

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button boton-login">
            INGRESAR
          </Button>

        </Form.Item>
      </Form>);
};

export default FormLogin;
