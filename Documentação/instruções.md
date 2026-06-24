# Documentação PI

Rotas:
- http://localhost:3000/Login
- http://localhost:3000/cadastro
- http://localhost:3000/atualizar/1
- http://localhost:3000/deletar/1
- http://localhost:3000/Listar

## Para criar o database use 
CREATE DATABASE IF NOT EXISTS `medtime`;
USE `medtime`;

CREATE DATABASE medtime;
USE medtime;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL
);
##

## COMO USAR:
- INSTALAR DEPENDENCIA COMO? PERGUNTA PRO DAVI!
- NPM INSTALL e ja eras...
- use npm run dev
- entre na pasta do medtime(cd medtime) e de npx expo start
