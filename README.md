# 2º Trabalho Prático 

## Unidade Curricular de Introdução à Programação na Web

#### Fase intermédia e final da 1ª parte do projeto

Nesta fase procuramos refinar as ideias pensadas, levando em conta os requisitos do enunciado ao pormenor

Próximas tarefas a serem desenvolvidas:

##### 1 -> Verificar se estão corretas e documentar rotas de API (tipo de solicitação HTTP + URL + conteúdo de resposta de exemplo) com o formato OpenAPI/Swagger.

##### 2 -> Usar a coleção do Postman (tp2) para testar rotas de API para implementar testes mais completos
* Para cada rota implementada, verificar se os testes do Postman validam o correto funcionamento daquela rota.
* Os testes únitários do módulo **seca-web-api.mjs** devem ser executados com base na criação de um mock (sem acesso acesso àAPI Ticketmaster ou a dados armazenados em memória).

##### 3 -> No módulo seca-web-api.mjs testar cada uma das rotas criadas.

##### 4 -> Verificar se os serviços de aplicação implementados no módulo seca-services.mjs estão de acordo com o pedido no enunciado.
* Os testes únitários do módulo **seca-services.mjs** devem ser executados com base na criação de um mock (sem acesso acesso àAPI Ticketmaster ou a dados armazenados em memória).

##### 6 -> Analisar se estão corretos os módulos de acesso a dados:
* tm-events-data.mjs - acesso à API Ticketmaster.
* seca-data-mem.mjs - acessar dados de grupos.