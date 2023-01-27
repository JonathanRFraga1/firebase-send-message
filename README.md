# Firebase Beasy

Serviço de disparo de notificações para o Firebase Cloud 

---

### Funcionalidades

##### *Funções Síncronas*
-- Disparo de notificações para um único dispositivo

-- Disparo de notificações para multiplos dispositivos

##### *Funções Assíncronas*
-- Disparo de notificações agendadas para qualquer quantidade de dispositivos

---

### Instalação:

- Faça o clone do projeto
- `$ cd ./firebase-beasy`
- `$ npm install`
- Crie o **.env** a partir do **example.env**
- `$ npm run dev`
- Adicione as configurações dos projetos firebase na rota `POST /project`
- Faça o download da Private Key do projeto em `https://console.firebase.google.com/u/1/project/_/settings/serviceaccounts/adminsdk?hl=pt-br`
