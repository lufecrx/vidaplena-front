@AGENTS.md
Com base em tudo que já mapeamos, vou listar todas as telas de forma direta e organizada.

---

## 🔐 AUTENTICAÇÃO

**Login**
Campos de e-mail e senha, botão entrar, link "esqueci minha senha". Após login redireciona por perfil do usuário.

**Recuperação de Senha**
Campo de e-mail para envio do link. Segunda etapa com campos de nova senha e confirmação via token do e-mail.

**Primeiro Acesso / Onboarding**
Stepper de 3 etapas: definir senha → aceitar termos (LGPD) → completar perfil básico e preferências de notificação.

**Configuração de 2FA**
Toggle para ativar, exibe QR code para app autenticador, campo de código de 6 dígitos para validar, geração de códigos de backup.

---

## 🏠 DASHBOARDS

**Dashboard — Paciente**
Próximas consultas, métricas de saúde recentes (pressão, peso, glicemia), checklist de medicamentos do dia, notificações não lidas, atalhos rápidos para agendar, chat e prontuário.

**Dashboard — Profissional de Saúde**
Agenda do dia com status de cada atendimento, lista de pacientes aguardando, alertas de pacientes críticos, acesso rápido a prontuários recentes, contador de mensagens não respondidas.

**Dashboard — Administrador / Gestor**
KPIs operacionais (consultas realizadas, cancelamentos, ocupação), KPIs financeiros (faturamento, inadimplência), gráficos de tendência por período, alertas do sistema, botões de ação rápida.

**Dashboard — Empresa Parceira**
Total de beneficiários ativos, utilização de benefícios por categoria, relatório mensal resumido, funcionários com alertas de saúde (dados anonimizados).

---

## 👥 GESTÃO DE USUÁRIOS

**Lista de Usuários**
Tabela com nome, perfil, status e data de cadastro. Filtros por perfil e status, busca por nome/CPF/e-mail, ações de ativar/inativar, exportação.

**Cadastro / Edição de Usuário**
Formulário em abas: Dados Pessoais, Acesso e Perfil Profissional. Upload de foto, seleção de perfil, campos dinâmicos conforme o perfil (CRM para médico, CREFITO para fisioterapeuta etc.), botão salvar e convidar.

**Perfil do Usuário**
Exibe todos os dados, histórico de acessos, permissões ativas, aba de dependentes. Admin vê versão completa, usuário comum vê versão simplificada.

**Gestão de Permissões**
Matriz de permissões por módulo e perfil com checkboxes. Criar novo perfil, clonar perfil existente, salvar em lote.

**Cadastro de Dependentes**
Formulário com nome, data de nascimento e tipo (criança, idoso, PcD). Lista de dependentes já cadastrados em cards, opções de editar e remover.

**Log de Auditoria**
Tabela com data/hora, usuário, módulo, ação e IP. Filtros por período, perfil e módulo. Exportação em CSV/PDF. Somente leitura.

---

## 📅 AGENDAMENTOS

**Busca de Profissionais e Horários**
Campo de busca por especialidade ou nome, filtros por data, convênio e modalidade (presencial/teleconsulta). Grade de horários disponíveis, cards de profissional com foto.

**Confirmação de Agendamento**
Resumo do agendamento selecionado, validação de convênio em tempo real, campo de observações, botão confirmar, modal com comprovante para download ou envio por e-mail.

**Minha Agenda — Paciente**
Tabs de Próximos e Histórico. Cards por agendamento com status colorido, botões de cancelar e remarcar, link de acesso para teleconsultas, opção de adicionar ao Google/iCal.

**Agenda do Profissional**
Calendário com visões diária, semanal e mensal. Modal de detalhe por consulta, registrar encaixe, bloquear horários, link direto para prontuário do paciente.

**Configuração de Disponibilidade**
Grade de dias da semana com toggles de horário por unidade, duração padrão da consulta, intervalo mínimo entre atendimentos, calendário de bloqueios (férias, feriados).

**Lista de Espera**
Card mostrando posição na fila, profissional e especialidade. Botão de confirmar vaga com contador regressivo após notificação de disponibilidade.

**Gestão de Convênios**
Formulário de convênio com coberturas e carências, associação a profissionais e serviços, validação de elegibilidade, listagem de serviços cobertos.

---

## 🗂️ PRONTUÁRIO ELETRÔNICO

**Prontuário — Visão Geral**
Timeline vertical de consultas e eventos clínicos, seção de resumo clínico no topo (alergias graves em destaque), abas: Consultas, Receitas, Exames, Documentos, Histórico. Botão nova consulta.

**Registro de Consulta**
Campos de anamnese, evolução clínica, diagnóstico com autocomplete de CID-10, observações. Auto-save a cada 30s, rascunho e finalização. Após finalizado vira somente leitura.

**Emissão de Receita Digital**
Buscador de medicamentos por nome ou princípio ativo, lista de itens com posologia, seletor de validade, identificação de medicamentos com retenção. Assinar e emitir gera PDF com QR code verificável.

**Solicitação de Exames**
Seletor de exames por categoria (laboratório / imagem), campo de indicação clínica, toggle de urgência. Gera PDF da solicitação.

**Emissão de Atestado e Encaminhamento**
Formulário de atestado (dias, CID, observações) e formulário de encaminhamento (especialidade, motivo, urgência). Templates pré-configurados, assinatura digital.

**Registro de Alergias, Vacinas e Medicações**
Seções colapsáveis por categoria. Formulários inline, badges de severidade para alergias (leve/moderada/grave), lista cronológica de vacinas, medicações de uso contínuo.

**Anexo de Documentos**
Upload via drag & drop, seletor de categoria (laudo, exame, imagem), galeria com miniatura e preview inline de PDF/imagem, histórico de versões expandível.

**Prontuário — Visão do Paciente**
Timeline simplificada de consultas realizadas, lista de receitas e documentos disponíveis para download. Somente leitura, sem anotações clínicas restritas.

---

## 📊 MONITORAMENTO PREVENTIVO

**Painel de Métricas — Paciente**
Cards por métrica (peso, pressão, glicemia, sono, água, atividade), gráfico de linha com filtro de período (7d, 30d, 90d), botão de nova medição, tabela de histórico, alertas emitidos.

**Registro Manual de Métrica**
Modal rápido com seletor de métrica, campo numérico, data/hora (padrão = agora), observação opcional. Fluxo mínimo de ações.

**Painel de Métricas — Profissional**
Mesmos gráficos da visão paciente com faixas de referência sombreadas. Seletor de paciente, alertas emitidos, exportação de relatório em PDF.

**Configuração de Alertas**
Limites por métrica e por paciente, seletor de destinatários (paciente, familiar, profissional), toggles de ativação por alerta. Limites padrão por condição (diabetes, hipertensão).

**Aderência ao Tratamento**
Gráfico de barras de aderência por medicamento, tabela de doses com status (tomado, não confirmado, pulado). Taxa de aderência com cor (verde/amarelo/vermelho).

---

## 🏥 PLANOS E PROGRAMAS DE SAÚDE

**Lista de Planos**
Tabela com nome, modalidade, número de beneficiários e status. Filtro por tipo, ações de criar, editar e inativar.

**Cadastro / Edição de Plano**
Formulário multi-seção: Dados Gerais, Benefícios (com cotas), Parceiros e Financeiro (coparticipação, validade).

**Programas de Acompanhamento — Lista**
Tabela de programas com nome, número de inscritos, profissionais responsáveis e status. Expansão inline mostra pacientes do programa.

**Cadastro de Programa de Acompanhamento**
Formulário em etapas: identificação, profissionais responsáveis, metas e indicadores (com unidade e faixa alvo), periodicidade de avaliação.

**Acompanhamento do Paciente no Programa**
Painel de metas com indicador de progresso, formulário de evolução periódica, gráfico de evolução histórica vs. meta, timeline de registros anteriores.

**Meu Plano e Programas — Paciente**
Card do plano ativo com benefícios e saldos disponíveis, lista de programas ativos com barra de progresso, linguagem simples e visual motivacional.

**Relatório de Utilização — Empresa**
Gráficos de utilização por benefício, tabela por funcionário com dados de saúde anonimizados, filtros por período, exportação PDF/Excel.

---

## 💊 FARMÁCIAS E MEDICAMENTOS

**Consulta de Receita Digital — Farmácia**
Busca por CPF ou código da receita, exibição dos medicamentos com posologia e validade, badge de retenção obrigatória, botão dispensar com modal de confirmação, download da receita após dispensação.

**Gestão de Estoque — Farmácia**
Tabela com medicamento, lote, validade e quantidade. Badge de status (OK/Baixo/Crítico), formulário de entrada e saída, alertas de mínimo.

**Pedido de Entrega Domiciliar — Paciente**
Seleção de medicamentos da receita, mapa de farmácias parceiras, formulário de endereço, prazo estimado de entrega, acompanhamento de status em tempo real.

**Medicamentos em Uso — Paciente**
Cards com nome, posologia e farmácia, botão de solicitar renovação (ativo perto do vencimento), aba de histórico de compras.

---

## 🏠 ATENDIMENTO DOMICILIAR

**Solicitação de Visita**
Seletor de tipo de serviço, endereço com geolocalização (padrão do perfil), date picker e seletor de turno, campo de observações, confirmação por e-mail e push.

**Gestão de Visitas — Gestor**
Tabela de visitas por status (Solicitada, Atribuída, Em andamento, Concluída, Cancelada), mapa com pins das equipes em campo, painel lateral de detalhes, botão atribuir profissional.

**App de Campo — Profissional**
Lista de visitas do dia com mapa, detalhes de cada visita (endereço, paciente, serviço), botão check-in com geolocalização, formulário de procedimentos e materiais, área de assinatura touch, botão check-out. Otimizado para mobile com suporte offline básico.

**Relatório de Visita**
PDF formatado com dados da visita, procedimentos realizados, materiais consumidos, assinatura digital, duração, quilometragem e custo calculado.

**Controle de Frota e Quilometragem**
Tabela de veículos, registro de uso por visita, gráfico de quilometragem por profissional, relatório de custos de deslocamento.

---

## 💰 FINANCEIRO E FATURAMENTO

**Emissão de Cobranças**
Geração de cobrança para paciente particular, fatura consolidada para empresa ou faturamento para convênio. Status visual: verde (pago), amarelo (pendente), vermelho (vencido).

**Pagamento — Paciente**
Lista de faturas em aberto, modal com abas Cartão e PIX (QR code dinâmico), parcelas disponíveis conforme plano, download de comprovante.

**Histórico Financeiro — Paciente**
Tabela de pagamentos com data, descrição, valor e status. Filtro por período, download de comprovante por item.

**Reembolsos e Estornos**
Formulário de solicitação, lista com status (pendente/aprovado/rejeitado/processado), modal de análise com campo de motivo. Aprovação em dois níveis para valores acima do limite.

**Regras Financeiras**
Configuração de coparticipação por plano e serviço, opções de parcelamento e valor mínimo, tabela de regras vigentes, histórico de alterações.

**Relatórios de Faturamento**
Gráfico de barras por período, tabela detalhada por serviço, filtros por unidade e convênio, drill-down ao clicar na barra, exportação Excel/PDF.

**Dashboard Financeiro**
Cards KPI (receita bruta, líquida, inadimplência, ticket médio), gráfico de evolução mensal, custo por serviço, indicadores de ocupação e produtividade. Exportação em PDF.

**Auditoria de Faturamento**
Tabela comparando serviços cobrados vs. realizados, inconsistências destacadas por criticidade, fluxo de revisão com status, exportação do relatório.

---

## 💬 COMUNICAÇÃO E ENGAJAMENTO

**Chat — Paciente com Profissional**
Lista de conversas com preview da última mensagem, janela de chat com bolhas, envio de arquivos (exames, fotos), indicador de leitura, badge de mensagens não lidas. Aviso para não usar em emergências.

**Central de Notificações**
Lista de todas as notificações com ícone por tipo (consulta, medicamento, alerta, campanha), filtro por categoria, marcar como lida individualmente ou em lote.

**Configuração de Notificações**
Toggles por tipo e canal (push, e-mail, SMS), configuração de modo silencioso por horário. Notificações críticas de saúde não podem ser desativadas.

**Campanhas Educativas — Criação**
Editor rich text, seletor de público-alvo com filtros (perfil, plano, programa), agendamento de disparo, preview mobile/desktop, público estimado antes de disparar.

**Campanhas Educativas — Resultados**
Tabela de campanhas enviadas com métricas (entregues, abertos, clicados), gráfico de funil, exportação de relatório.

---

## ⚙️ CONFIGURAÇÕES E ADMINISTRAÇÃO

**Configurações Gerais do Sistema**
Dados da organização (nome, logo, CNPJ), módulos ativos via toggles, parâmetros globais (prazo de cancelamento, tempo de sessão), integrações (gateway de pagamento, e-mail, SMS), editor de termos de uso e política de privacidade.

**Gestão de Unidades / Clínicas**
Tabela de unidades, formulário de cadastro com mapa de endereço, vínculos de profissionais e serviços por unidade.

**Gestão de Especialidades e Serviços**
Tabela de especialidades e serviços, formulário com restrições (faixa etária, encaminhamento obrigatório), associação a convênios.

**Gestão de Parceiros**
Tabela filtrada por tipo (academia, laboratório, farmácia), formulário de cadastro, vínculo a planos, ativar/inativar.

**Meu Perfil**
Edição de dados pessoais, upload de foto com crop, alteração de senha, lista de sessões ativas com botão de encerrar sessão em outro dispositivo.

---

**Total: 68 telas** distribuídas em 12 módulos. Quer que eu detalhe os fluxos de navegação entre elas, ou prefere partir para a estrutura de componentes e pastas do projeto React?


registro-atendimento-controller


GET
/api/registros-atendimento/{id}


PUT
/api/registros-atendimento/{id}


DELETE
/api/registros-atendimento/{id}


POST
/api/registros-atendimento


POST
/api/registros-atendimento/{id}/retificar


GET
/api/registros-atendimento/prontuario/{prontuarioId}

profissional-controller


GET
/api/profissionais/{id}


PUT
/api/profissionais/{id}


DELETE
/api/profissionais/{id}


GET
/api/profissionais


POST
/api/profissionais

paciente-controller


GET
/api/pacientes/{id}


PUT
/api/pacientes/{id}


DELETE
/api/pacientes/{id}


GET
/api/pacientes


POST
/api/pacientes

agendamento-controller


PUT
/api/agendamentos/{id}/confirmar


PUT
/api/agendamentos/{id}/cancelar


POST
/api/agendamentos


GET
/api/agendamentos/profissional/{id}

vinculo-dependencia-controller


POST
/api/vinculos


DELETE
/api/vinculos/{id}

usuario-controller


POST
/api/v1/usuarios


PATCH
/api/v1/usuarios/{usuarioId}/tipos


PATCH
/api/v1/usuarios/{usuarioId}/status


GET
/api/v1/usuarios/me


PATCH
/api/v1/usuarios/me


GET
/api/v1/usuarios/{usuarioId}

auth-controller


POST
/api/v1/auth/reset-password


POST
/api/v1/auth/register


POST
/api/v1/auth/login


POST
/api/v1/auth/forgot-password

prontuario-controller


POST
/api/prontuarios


GET
/api/prontuarios/{id}


GET
/api/prontuarios/paciente/{pacienteId}


GET
/api/prontuarios/paciente/{pacienteId}/historico

familia-controller


POST
/api/familias


GET
/api/familias/{id}

empresa-controller


GET
/api/empresas


POST
/api/empresas


GET
/api/empresas/{id}

clinica-controller


GET
/api/clinicas


POST
/api/clinicas


GET
/api/clinicas/{id}


Schemas
RegistroAtendimentoDTOExpand allobject
NotaRetificacaoResponseDTOExpand allobject
RegistroAtendimentoResponseDTOExpand allobject
ProfissionalDTOExpand allobject
ProfissionalResponseDTOExpand allobject
PacienteDTOExpand allobject
PacienteResponseDTOExpand allobject
AgendamentoResponseDTOExpand allobject
VinculoDependenciaRequestDTOExpand allobject
VinculoDependenciaResponseDTOExpand allobject
CadastroUsuarioRequestExpand allobject
UsuarioResponseExpand allobject
ResetPasswordRequestExpand allobject
MessageResponseExpand allobject
LoginRequestExpand allobject
AuthResponseExpand allobject
ForgotPasswordRequestExpand allobject
NotaRetificacaoDTOExpand allobject
ProntuarioDTOExpand allobject
ProntuarioResponseDTOExpand allobject
FamiliaRequestDTOExpand allobject
FamiliaResponseDTOExpand allobject
MembroResumoExpand allobject
EmpresaRequestDTOExpand allobject
EmpresaResponseDTOExpand allobject
ClinicaRequestDTOExpand allobject
ClinicaResponseDTOExpand allobject
AgendamentoRequestDTOExpand allobject
AlterarTiposUsuarioRequestExpand allobject
AlterarStatusUsuarioRequestExpand allobject