# Projeto API com Graphql

Este projeto consiste em uma API criada com o framework GraphQL, que permite aos usuários realizar consultas mais precisas e eficientes através de uma linguagem de consulta flexível e poderosa.



## Execução do projeto
Para iniciar o projeto, basta executar o comando abaixo no terminal:

```
docker-compose up -d
```
Este comando irá levantar os containers necessários para a execução da API. Em seguida, é necessário rodar o arquivo schema.sql, disponível no módulo database, em seu gerenciador de banco de dados preferido. Isso fará com que o banco de dados seja criado e populado com os dados necessários para o funcionamento da API.

```
http://localhost:3000/
```

Interface para montar a query e testar a API

### [SANDBOX APOLLO GRAPHQL](https://studio.apollographql.com/sandbox)


## Teste

Para rodar os testes, basta executar o comando abaixo, dentro do Docker:

```
docker exec ${IDCONTAINER} sh -c "npm run test"
```

