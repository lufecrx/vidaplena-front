# 📐 Cadastro e Gerenciamento de Dependentes

Este documento detalha os diagramas de arquitetura, fluxo de telas, sequência de integração relacionados a implementação da funcionalidade de **Cadastro e Gerenciamento de Dependentes** conectada à **VidaPlena API**.

---

## 1. Diagrama de Sequência (Integração Front-end ↔ Back-end)

Demonstra a jornada desde o preenchimento do formulário, validações em tempo de digitação, disparo da requisição HTTP com token JWT, até o feedback visual e atualização de estado reativo.

```mermaid
sequenceDiagram
    autonumber
    actor Resp as 👤 Responsável (Usuário)
    participant Form as 🖥️ FormCadastroDependente
    participant Val as 🧪 ValidadorFrontEnd
    participant Store as 📦 DependenteStore / Hook
    participant Api as 🌐 ApiClient (Axios / Fetch)
    participant Back as ⚙️ VidaPlena Backend (API)

    Note over Resp, Form: 1. Preenchimento e Validação Reativa
    Resp->>Form: Digita Nome, CPF e Data de Nascimento
    Form->>Val: Valida formato do CPF e calcula idade
    Val-->>Form: Idade calculada (ex: 5 anos) -> auto-sugere tipo 'CRIANCA'
    
    Resp->>Form: Seleciona Tipo ('CRIANCA', 'IDOSO', 'NECESSIDADE_ESPECIAL')
    Form->>Val: Valida compatibilidade da idade com o tipo selecionado
    Val-->>Form: Válido (ou exibe warning se criança >= 18 ou idoso < 60)
    
    Resp->>Form: Preenche dados clínicos (Tipo Sanguíneo, Alergias, Medicamentos)
    Resp->>Form: Clica em "Salvar Dependente"

    Note over Form, Back: 2. Chamada Atômica com JWT
    Form->>Store: cadastrarDependente(formData)
    Store->>Api: POST /api/v1/dependentes (Header: Authorization Bearer <token>)
    Api->>Back: Request JSON (Payload unificado)
    
    alt Sucesso (HTTP 201 Created)
        Back-->>Api: HTTP 201 Created (DependenteResponseDTO)
        Api-->>Store: Dependente criado (vinculoId, pacienteId, etc.)
        Store->>Store: Adiciona novo dependente à lista ativa em memória
        Store-->>Form: Sucesso
        Form->>Resp: Toast de Sucesso ("Dependente cadastrado com sucesso!")
        Form->>Form: Fecha Modal / Redireciona para Lista de Dependentes
    else Erro de Negócio / Validação (HTTP 400 Bad Request)
        Back-->>Api: HTTP 400 Bad Request (Ex: "CPF já cadastrado", "Idade incompatível")
        Api-->>Store: Erro capturado
        Store-->>Form: Exibe mensagens de validação nos campos correspondentes
        Form->>Resp: Alerta inline destacando os campos com inconsistência
    else Erro de Autenticação / Sessão Expirada (HTTP 401 Unauthorized)
        Back-->>Api: HTTP 401 Unauthorized
        Api-->>Store: Token expirado
        Store->>Resp: Redireciona para Login / Refresh Token
    end
```

---

## 2. Diagrama de Fluxo de Navegação e Estados (User Flow & State Machine)

Ilustra os caminhos do usuário entre a listagem de dependentes, abertura do formulário, visualização de prontuário e confirmação de desvinculação.

```mermaid
stateDiagram-v2
    [*] --> ListaDependentes: Acessa rota /dependentes

    state ListaDependentes {
        Carregando --> ComDados: GET /api/v1/dependentes (200 OK)
        Carregando --> Vazia: Lista vazia (0 dependentes)
        Carregando --> ErroCarregamento: Falha na rede / 500
    }

    Vazia --> ModalCadastro: Clica em "Cadastrar Primeiro Dependente"
    ComDados --> ModalCadastro: Clica no botão "+ Novo Dependente"
    ComDados --> DetalhesProntuario: Clica em um card de dependente
    ComDados --> DialogDesvinculacao: Clica no ícone "Desvincular"

    state ModalCadastro {
        [*] --> DadosBasicos: Nome, CPF, Nascimento, Categoria
        DadosBasicos --> DadosClinicos: Próximo / Aba Clínica (Alergias, Remédios, Tipo Sanguíneo)
        DadosClinicos --> OpcionaisAcesso: Próximo (E-mail/Telefone opcionais)
        OpcionaisAcesso --> EnviandoFormulario: Submeter
        
        state EnviandoFormulario {
            ValidandoFrontEnd --> DisparandoApi: Tudo OK
            ValidandoFrontEnd --> ErroCampos: Erro de preenchimento
            DisparandoApi --> SucessoCriacao: HTTP 201
            DisparandoApi --> ErroApi: HTTP 400/409
        }
    }

    SucessoCriacao --> ComDados: Fecha Modal & Notifica usuário via Toast
    ErroApi --> ModalCadastro: Mantém dados digitados e exibe erro do backend
    
    state DialogDesvinculacao {
        Confirmar --> ChamadaDelete: DELETE /api/v1/dependentes/{vinculoId}
        Cancelar --> ComDados: Fecha modal sem alterar
        ChamadaDelete --> ComDados: Remove item da lista com animação
    }

    state DetalhesProntuario {
        ExibicaoDados --> HistoricoConsultas: Ver consultas do dependente
        ExibicaoDados --> EdicaoDados: Editar informações clínicas
    }
```

---

## 3. Diagrama de Arquitetura de Componentes Front-End

Sugestão de decomposição modular de componentes reutilizáveis para frameworks modernos (React, Vue, Angular ou Flutter):

```mermaid
graph TD
    subgraph "Camada de Roteamento e Páginas"
        Page["DependentesPage (/dependentes)"]
    end

    subgraph "Componentes de Apresentação"
        Header["DependentesHeader\n(Título, Botão '+ Novo Dependente', Filtro Ativos)"]
        Grid["DependentesGrid / List"]
        Card["DependenteCard\n- Avatar por Categoria (Ícone Criança/Idoso/PcD)\n- Badges: Tipo Sanguíneo, Alergias\n- Idade Calculada\n- Ações: Ver Prontuário, Desvincular"]
        EmptyState["EmptyDependentesState\n(Ilustração + Call to Action amigável)"]
    end

    subgraph "Modais e Formulários"
        ModalForm["CadastroDependenteModal"]
        StepBasics["DadosPessoaisStep\n- Input Nome Completo\n- Input CPF (Máscara)\n- DatePicker Nascimento\n- Radio/Select Tipo Dependente"]
        StepClinical["DadosClinicosStep\n- Select Tipo Sanguíneo (A+, O-, etc.)\n- TagInput Alergias\n- TextArea Medicamentos Contínuos\n- TextArea Histórico Familiar"]
        DialogUnlink["ConfirmacaoDesvinculacaoModal\n(Dialog de confirmação com aviso de desativação)"]
        DrawerDetail["ProntuarioDependenteDrawer\n(Visualização detalhada dos dados clínicos)"]
    end

    subgraph "Camada de Estado e Serviços (Data Access)"
        Store["useDependentes / DependenteStore\n- dependentes: DependenteResponseDTO[]\n- loading: boolean\n- error: string | null"]
        ApiService["DependenteService\n- listar(apenasAtivos)\n- cadastrar(dto)\n- obterPorId(vinculoId)\n- desvincular(vinculoId)"]
        Http["HttpClient (Axios / Fetch)\n- Interceptor JWT Bearer\n- Tratamento global de erros HTTP"]
    end

    Page --> Header
    Page --> Grid
    Grid --> Card
    Grid --> EmptyState
    Header --> ModalForm
    Card --> DialogUnlink
    Card --> DrawerDetail

    ModalForm --> StepBasics
    ModalForm --> StepClinical

    Page --> Store
    ModalForm --> Store
    DialogUnlink --> Store
    Store --> ApiService
    ApiService --> Http
```

---

## 4. Mapeamento de Campos e Regras de Validação de Interface

| Campo | Componente UI Recomendado | Obrigatoriedade | Regra de Validação / Comportamento no Front-End |
| :--- | :--- | :---: | :--- |
| **`nome`** | `Input (text)` | **Obrigatório** | Min. 2 caracteres, trim de espaços duplos. |
| **`cpf`** | `Input (text)` com máscara | **Obrigatório** | Máscara `999.999.999-99`. Validação de algoritmo dos dígitos verificadores antes do submit. |
| **`dataNascimento`** | `DatePicker` | **Obrigatório** | Data passada (não permite datas futuras). Dispara cálculo imediato de idade na UI. |
| **`tipo`** | `RadioGroup` / `Select` | **Obrigatório** | Opções: `CRIANCA`, `IDOSO`, `NECESSIDADE_ESPECIAL`. Sugerir automaticamente com base na idade: <br>• `< 18` $\rightarrow$ `CRIANCA`<br>• `$\ge 60$` $\rightarrow$ `IDOSO`. |
| **`tipoSanguineo`** | `Select` | *Opcional* | Opções: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`. |
| **`alergias`** | `TagInput` ou `TextArea` | *Opcional* | Permite registrar substâncias/alimentos separados por vírgula. Ex: *"Dipirona, Glúten"*. |
| **`medicamentosContinuos`** | `TextArea` | *Opcional* | Descrição de remédios de rotina e dosagens. |
| **`historicoFamiliar`** | `TextArea` | *Opcional* | Informações relevantes (ex: *"Diabetes tipo 2 na família"*). |
| **`email`** e **`senha`** | `Accordion` colapsado | *Opcional* | **Ocultar por padrão**. Se for um bebê ou idoso, o back-end gera credencial técnica de forma transparente. |

---
