# Controle Financeiro - Backend

## 💰 Visão Geral  
O Controle Financeiro é a API responsável por gerenciar transações financeiras pessoais, permitindo o registro, categorização e análise de despesas e receitas.

O projeto foi desenvolvido em Node.js com Express, utilizando SQLite como banco inicial e suporte para futura migração para PostgreSQL, garantindo escalabilidade e persistência dos dados.

Essa API serve como base para o front-end em React (em desenvolvimento), permitindo operações completas de CRUD e recursos adicionais como importação e exportação de arquivos CSV e relatórios de gastos por categoria e tipo.

## ⚙️ Funcionalidades Principais  
- **Gerenciamento de Transações:**
  - Criar, listar, atualizar e excluir transações.  
  - Classificação das transações em **entradas** e **saídas**.  

- **Categorias Dinâmicas:**
  - Cada transação é vinculada a uma categoria.  
  - As categorias são criadas automaticamente conforme o nome informado.  

- **Cálculo de Saldo:**
  - Retorna o saldo atual com base nas transações registradas.  

- **Importação e Exportação de CSV:**
  - Exporta todas as transações para um arquivo CSV.  
  - Importa arquivos CSV para criar transações automaticamente.  

- **Relatórios Detalhados:**
  - Relatórios por **categoria** e **tipo** (entrada/saída).  
  - Possibilidade de gerar estatísticas e totais agregados.  

## 🧩 Tecnologias Utilizadas  
- **Node.js + Express:** para criação de rotas e estrutura RESTful.  
- **SQLite:** banco de dados leve e rápido para desenvolvimento local.  
- **Knex.js:** ORM para abstração das queries e suporte à migração futura para PostgreSQL.  
- **Multer:** para upload e leitura de arquivos CSV.  
- **CSV-Parser:** para importação de dados.  

## 🧠 Aprendizados e Destaques  
- Estrutura modular e escalável com separação clara entre camadas.
- Uso de Knex.js para garantir compatibilidade entre bancos.
- Implementação de upload e parsing de CSV com controle de erros e validações.
- Criação de relatórios financeiros dinâmicos diretamente via SQL.

## 🚀 Próximos Passos  
- Autenticação de usuários.  
- Migração do banco de dados para PostgreSQL.
- Implementação de testes unitários.
- Integração com o frontend React.

## Atualizações
- Teste de requisições no frontend React
  

https://github.com/user-attachments/assets/93f5ba64-4dfd-4313-bd92-31c98b75b077


 

## 👨‍💻 Autor  
- [Guilherme Cesário](https://github.com/Gu1san)  
