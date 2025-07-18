# 🛍️ Shop Client

Sistema de e-commerce desenvolvido em Angular 20 com estratégias de filtragem Client-Side e Server-Side para listagem de produtos, carrinho de compras completo e interface moderna.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico que demonstra:

- Implementação de duas estratégias de busca e filtragem de produtos
- Sistema completo de carrinho de compras
- Interface responsiva e moderna
- Arquitetura modular e reutilizável
- Boas práticas de Angular com Signals e Standalone Components

## 🚀 Tecnologias Utilizadas

- **Angular 20.1.1** - Framework principal
- **TypeScript** - Linguagem de programação
- **Angular Signals** - Gerenciamento de estado reativo
- **Standalone Components** - Arquitetura modular
- **Lucide Angular** - Biblioteca de ícones
- **SCSS** - Pré-processador CSS
- **RxJS** - Programação reativa

## ✨ Funcionalidades

### 🎯 Estratégias de Listagem

- **Client-Side**: Carrega todos os produtos e filtra localmente (ideal para datasets pequenos/médios)
- **Server-Side**: Busca otimizada no servidor com paginação (escalável para grandes volumes)

### 🛒 Sistema de Carrinho

- Adicionar produtos com quantidade personalizada
- Visualizar lista de produtos no carrinho
- Alterar quantidades (+/- ou input direto)
- Remover produtos individuais
- Limpar carrinho completo
- Cálculo automático do valor total
- Confirmações de segurança

### 🔍 Funcionalidades de Busca

- Filtro por nome ou descrição do produto
- Busca instantânea (Client-Side) ou otimizada (Server-Side)
- Paginação com navegação completa
- Estados de loading, erro e lista vazia

### 🎨 Interface

- Design moderno e responsivo
- Navegação intuitiva entre páginas
- Feedback visual para todas as ações
- Indicadores de estado do carrinho
- Layout consistente em todas as telas

## 📁 Estrutura do Projeto

```
src/app/
├── components/
│   ├── cart/                    # Carrinho de compras
│   ├── client-product-list/     # Listagem Client-Side
│   ├── server-product-list/     # Listagem Server-Side
│   ├── product-list/            # Componente reutilizável de listagem
│   ├── product-detail/          # Detalhes do produto
│   └── home/                    # Hub de estratégias
├── services/
│   ├── product.ts               # Serviço de produtos (API)
│   └── shopping-cart.ts         # Serviço do carrinho (estado)
├── models/
│   ├── product.ts               # Interface do produto
│   ├── cart-item.ts             # Interface do item do carrinho
│   ├── product-list-data.ts     # Interface de dados da listagem
│   ├── paginated-response.ts    # Interface de resposta paginada
│   └── search-products.ts       # Interface de parâmetros de busca
└── styles.scss                 # Estilos globais
```

## 🎯 Componentes Principais

### 🏠 HomeComponent

Hub central para escolha de estratégia de listagem com cards informativos.

### 📋 ProductListComponent

Componente reutilizável que serve como base para ambas as estratégias:

- Grid responsivo de produtos
- Campo de busca com ícone
- Paginação completa
- Estados de loading/erro/vazio

### 🖥️ ClientProductListComponent

Implementa filtragem no cliente:

- Carrega todos os produtos via `getAllProducts()`
- Filtra localmente por nome/descrição
- Paginação dos resultados filtrados
- Busca instantânea

### 🌐 ServerProductListComponent

Implementa filtragem no servidor:

- Usa endpoint paginado `searchProducts()`
- Envia parâmetros de busca para o backend
- Controla paginação pelo servidor

### 🛒 CartComponent

Sistema completo de carrinho:

- Lista todos os itens com imagens
- Controles de quantidade (+ / - / input)
- Cálculo de totais (item e geral)
- Ações de remoção e limpeza
- Estados vazio e com itens

### 📦 ProductDetailComponent

Página de detalhes do produto:

- Informações completas do produto
- Seletor de quantidade
- Botão para adicionar ao carrinho
- Navegação contextual

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend API rodando em `http://localhost:3000`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/RafaSantana/shop-client
cd shop-client

# Instale as dependências
npm install

# Execute o projeto
npm start
```

A aplicação estará disponível em `http://localhost:4200/`

## 🛠️ Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Build de produção
npm test           # Executa os testes unitários
npm run lint       # Verifica padrões de código
```

## 📡 API Endpoints

O frontend consome os seguintes endpoints:

```typescript
GET /products                    # Lista todos os produtos (Client-Side)
GET /products/search?search=...  # Busca paginada (Server-Side)
GET /products/:id                # Detalhes de um produto
```

## 🎨 Design System

### Cores Principais

- **Primary**: `#2563eb` (Azul)
- **Success**: `#10b981` (Verde)
- **Error**: `#ef4444` (Vermelho)
- **Neutros**: Escala de cinzas de 50 a 900

### Componentes Reutilizáveis

- **Buttons**: Primário, secundário, ghost
- **Cards**: Containers com sombra e bordas arredondadas
- **Badges**: Indicadores de estado
- **Forms**: Inputs com ícones e validação visual

## 🔄 Fluxo da Aplicação

1. **Home** → Escolha da estratégia (Client/Server-Side)
2. **Lista** → Visualização dos produtos com busca/filtro
3. **Detalhes** → Informações do produto + adicionar ao carrinho
4. **Carrinho** → Gerenciamento completo dos itens

## 📱 Responsividade

- **Desktop**: Layout otimizado para telas grandes
- **Tablet**: Adaptação de grid e espaçamentos
- **Mobile**: Interface touch-friendly e navegação simplificada

## 🧪 Decisões Técnicas

### Angular Signals

Escolhidos para reatividade moderna e performance otimizada em comparação aos Observables tradicionais.

### Standalone Components

Arquitetura mais modular, sem necessidade de NgModules, facilitando lazy loading e manutenção.

### Reutilização de Componentes

`ProductListComponent` serve como base para ambas as estratégias, aplicando DRY e mantendo consistência.

### Estado do Carrinho

Gerenciado centralmente via `ShoppingCartService` com Signals, garantindo sincronização entre componentes.

## 🎯 Critérios Atendidos

- ✅ **Funcionalidade**: Cadastro, seleção e carrinho funcionais
- ✅ **Qualidade do Código**: Organização, legibilidade e boas práticas
- ✅ **Angular**: Uso adequado de Signals, Standalone Components e RxJS
- ✅ **Tratamento de Erros**: Estados de loading, erro e validações
- ✅ **Design**: Interface simples, intuitiva e responsiva
- ✅ **Segurança**: Validações client-side e sanitização de dados

## 👨‍💻 Desenvolvimento

**Desenvolvido por:** Rafael Santana  
**Data:** Julho 2025  
**Contexto:** Desafio Técnico - Sistema de Produtos

---

<p align="center">
  <strong>🚀 Projeto desenvolvido com foco em qualidade, performance e boas práticas!</strong>
</p>
