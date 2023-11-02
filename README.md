# 2º Trabalho Prático 

## Unidade Curricular de Introdução à Programação na Web

#### Fase inicial do projeto

Organizamos o projeto em tópicos e fizemos colocamos as dependências entre ficheiros.

Próximas tarefas a serem desenvolvidas:

##### 1 -> Projetar e documentar rotas de API (tipo de solicitação HTTP + URL + conteúdo de resposta de exemplo) usando o formato OpenAPI/Swagger.

##### 2 -> Crie uma coleção no Postman (ex. SECA) para testar rotas de API

##### 3 -> Implemente o módulo de entrada do aplicativo do servidor: seca-server.mjs. Para este módulo não é necessária a criação de testes unitários, pois o mesmo não deve implementar nenhuma lógica além de receber alguns argumentos da linha de comando (configuração), registrar rotas e iniciar o servidor web. Este módulo pode ser construído à medida que cada rota em seca-web-api.mjs é implementada.

##### 4 -> No seca-web-api.mjsmódulo implemente as rotas da API uma por uma.
* Para cada rota implementada, utilize testes do Postman para verificar o correto funcionamento daquela rota.
* Só passe para a implementação da próxima rota quando a anterior estiver totalmente implementada e testada.
* Para cada rota, crie uma solicitação na coleção Postman que a valide.
* Nesta fase de implementação do módulo seca-web-api.mjs são utilizados dados locais (*mock-of seca-service.mjs) , ou seja, os testes devem ser realizados sem acesso à API Ticketmaster ou armazenamento em memória.

##### 5 -> Implemente serviços de aplicação no módulo seca-services.mjs.
* Siga uma abordagem semelhante à utilizada no seca-web-api.mjsdesenvolvimento das funcionalidades deste módulo e respectivos testes unitários.
* Os testes de unidade do módulo **seca-services.mjs** devem ser executados sem acesso à API Ticketmaster ( tm-events-data.mjs). Ou seja, crie um mock para esse acesso.

##### 6 -> Implemente módulos de acesso a dados:
* tm-events-data.mjs - acesso à API Ticketmaster.
* seca-data-mem.mjs - acessar dados de grupos.