# Rent'a'Space
O Rent'a'Space é um projeto web com o intuito de disponibilizar para profissionais de diversas areas a possibilidade de conseguir uma renda extra alugando seus espaços de trabalho ao mesmo tempo que proporciona a trabalhadores que não possuem um espaço proprio a possibilidade de alugar um local já equipado, seja para praticar ou atender a clientes, sem a necessidade de investir em um ambiente, o que pode ser dificil para pessoas passando por crises financeiras, que possuem um espaço temporariamente inacessivel ou que simplesmente não possuem a demanda para um local próprio, talvez ainda iniciante na profissão.

Aqui teremos diversos espaços para incontáveis profissões, desde consultorios, oficinas, estudios de gravação; todos equipados e disponibilizados por pessoas da area que possuem estes locais e se interessam em disponibilizar para colegas de profissão, por um preço é claro.

# Definição e configuração inicial do projeto
### Descrição
A configuração inicial do projeto foi realizada utilizando Node.js com Express, sendo escrita em TypeScript para garantir maior segurança e organização do código. O projeto faz uso das seguintes dependências:
**dotenv**: Permite a utilização de variáveis de ambiente, armazenadas no arquivo .env, para configurar informações sensíveis como credenciais do banco de dados e portas utilizadas pela aplicação.
**express**: Framework para criação de APIs REST de forma simples e eficiente, facilitando a criação de rotas e o gerenciamento de requisições HTTP.
**mysql2**: Biblioteca que fornece um cliente para comunicação com bancos de dados MySQL, permitindo a execução de consultas SQL.
**Sequelize**: ORM que abstrai operações no banco de dados, permitindo trabalhar com modelos e relacionamentos sem a necessidade de escrever SQL manualmente.
**swagger-ui-express**: Integração do Swagger com o Express, permitindo a geração automática de documentação para a API e possibilitando a realização de testes diretamente pela interface web do Swagger.
A aplicação também foi conteinerizada utilizando Podman, permitindo que o banco de dados e o servidor rodem em ambientes isolados e reproduzíveis.
Esta API consiste em um sistema de locação de ambientes de trabalho, de profissionais para profissionais, como por exemplo, um dentista pode alugar sua clínica em horários vagos para outro dentista e gerar uma renda a mais, ou um marceneiro poder buscar por uma oficina disponível enquanto a sua está inacessível. Por meio desta aplicação uma variedade de ambientes e ferramentas estarão disponíveis, de clínicas ou escritórios, estúdios e oficinas.

### Instalação e Configurações
Antes de iniciar o projeto, verifique se você possui instalado:
_Node.js_ (versão 18 ou superior)
_MySQL_ (localmente ou rodando via container no Podman)
_Git_ (para clonar o repositório)
_Podman_ (caso queira rodar o banco de dados em um container)
Para a inicialização da aplicação, primeiramente realize um clone do diretório utilizando o seguinte comando em terminal:
```
> git clone https://github.com/bryerblack/projeto-principios_dev_web.git
> cd projeto-principios_dev_web 
```

No mesmo terminal, agora no diretório raiz da aplicação clonada, digite o comando abaixo para instalar as dependências necessárias para execução do projeto:
```
> npm i
```
Com isto, todas as dependências devem ser instaladas.
Crie um arquivo .env com as seguintes variáveis de ambiente:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=#SEU_MYSQL_USER
DB_PASS=#SEU_MYSQL_PASSWORD
DB_NAME=#NOME_DO_BANCO
```
Se estiver rodando o MySQL localmente, certifique-se de que:
O MySQL está instalado e rodando na porta 3306
O usuário e senha correspondem aos valores em .env
Compilação do código TypeScript
```
> npm run build
```
Isso compila os arquivos TypeScript e gerará a pasta dist/ com o código pronto para execução.
Executando o projeto em modo de desenvolvimento (atualização automática)
```
> npm run dev
```
Isso usará o nodemon para reiniciar o servidor sempre que houver mudanças nos arquivos.
Após iniciar o servidor, a API estará disponível em: http://localhost:3000
E a documentação pode ser acessada em: http://localhost:3000/api-docs

### Rotas Implementadas
- GET /users - Retorna uma lista de todos os usuários;
- POST /users - Cria um novo usuário;
- GET /users:id - Retorna um usuário específico;
- DELETE /users:id - Deletar um usuário específico;
- POST /places/ - Cria uma nova localidade;
- GET /places/ - Retorna a lista de todas as localidades;
- GET /places/:id - Retorna uma localidade específica;
- DELETE /places/:id - Deletar um  usuário específico;
- POST /places/:place_id/equipments - Adiciona equipamento ao local;
- DELETE /places/:place_id/equipmentId - Deletar equipamento específico;
- POST /rent
- GET /rent - Recupera a lista de todas as locações;
- GET /rent:id - Recupera uma locação específica;
- PUT /rent:id - Atualiza uma locação específica;
- DELETE /rent:id - Deletar uma locação específica;
- POST /ratings - Cria uma avaliação;
- GET /ratings - Recupera a lista de todas as avaliações;
- GET /ratings/:id - Recupera uma avaliação específica;
- DELETE /ratings/:id - Deletar uma avaliação específica;
