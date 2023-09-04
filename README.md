# API de Reserva de Hotel

API para gerenciar reservas de hotéis. Permite que os usuários façam reservas, enviem comprovantes e baixem informações da reserva em PDF.

## Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Recursos Adicionais](#recursos-adicionais)

## Requisitos

- Node.js v18.17.1
- MongoDB +v5 (ou superior)
- Redis v6 (ou superior)

## Instalação


# Clonar o repositório
```bash
git clone https://github.com/lluanbs/celestial-resort
```

# Acessar o diretório do projeto
```bash
cd celestial-resort
```

# Instalar as dependências
```bash
npm install
```

## Configuração

1. Renomeie o arquivo .env.example para .env.
2. Preencha as variáveis de ambiente no arquivo .env:

## Execução

# Realizar o processo de build da aplicação
```bash
npm run build
```

# Para iniciar a API
```bash
npm run start
```
## Endpoints

Todos os endpoints estão localizados na pasta `endpoints` na raiz do projeto:
- O arquivo `cr.postman_collection.json` é uma coleção no Postman.
- O arquivo `CLR - Local.postman_environment.json` contém as variáveis de ambiente local do Postman.

## Testes
```bash
npm run test
```

## Recursos Adicionais
- Autenticação JWT: Esta API utiliza JSON Web Tokens para autenticação e autorização.
- Cache com Redis: Alguns endpoints têm cache para melhorar o desempenho.

Se tiver problemas ou perguntas, abra uma "issue" que irei responder assim que possível!