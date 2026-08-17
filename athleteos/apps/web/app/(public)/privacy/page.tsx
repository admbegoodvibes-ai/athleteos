export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-foreground">
      <h1 className="mb-8 text-4xl font-bold">Política de Privacidade</h1>
      <p className="mb-8 text-sm text-muted-foreground">Última atualização: Agosto de 2026</p>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">1. Controlador de Dados</h2>
        <p>O AthleteOS atua como controlador dos seus dados pessoais, sendo responsável por determinar como e por que os seus dados são tratados de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">2. Dados Coletados</h2>
        <h3 className="text-xl font-medium mt-4">2.1. Dados Pessoais</h3>
        <p>Coletamos dados como nome, e-mail, data de nascimento, e informações de contato para criação e gestão da sua conta.</p>
        
        <h3 className="text-xl font-medium mt-4">2.2. Dados de Saúde e Desempenho</h3>
        <p>Coletamos métricas de desempenho esportivo, histórico de lesões, dados de bem-estar, sono, e outras informações físicas essenciais para a finalidade da plataforma.</p>

        <h3 className="text-xl font-medium mt-4">2.3. Dados de Menores</h3>
        <p>O tratamento de dados de atletas menores de idade é realizado de acordo com o Art. 14 da LGPD, exigindo o consentimento explícito e em destaque de um dos pais ou responsável legal.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">3. Finalidade do Tratamento</h2>
        <p>Os dados são tratados com o objetivo de fornecer análises de performance, relatórios de evolução, gestão de equipes, prevenção de lesões e aprimoramento contínuo dos serviços oferecidos pelo AthleteOS.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">4. Base Legal</h2>
        <p>O tratamento dos seus dados é fundamentado nas seguintes bases legais (Art. 7 da LGPD):</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Consentimento:</strong> Para o tratamento de dados de saúde e menores de idade (Art. 11 e Art. 14).</li>
          <li><strong>Execução de Contrato:</strong> Para o fornecimento dos serviços da plataforma.</li>
          <li><strong>Legítimo Interesse:</strong> Para melhoria contínua da plataforma, respeitando seus direitos.</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">5. Compartilhamento</h2>
        <p>Seus dados podem ser compartilhados com treinadores, comissões técnicas e clubes vinculados ao seu perfil, mediante sua autorização. Também compartilhamos dados com provedores de infraestrutura de nuvem com rígidos padrões de segurança.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">6. Retenção de Dados</h2>
        <p>Os dados serão armazenados apenas pelo tempo necessário para cumprir as finalidades descritas ou enquanto a sua conta estiver ativa, sendo excluídos ou anonimizados após o término da relação, salvo obrigações legais de retenção.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">7. Direitos do Titular</h2>
        <p>Nos termos do Art. 18 da LGPD, você tem direito a:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>Portabilidade dos dados;</li>
          <li>Revogação do consentimento.</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">8. Medidas de Segurança</h2>
        <p>Implementamos medidas técnicas e administrativas, como criptografia, controles de acesso e monitoramento contínuo, para proteger seus dados contra acessos não autorizados, perdas ou alterações.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">9. Contato do Encarregado (DPO)</h2>
        <p>Para exercer seus direitos ou tirar dúvidas, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através do e-mail: <strong>dpo@athleteos.com.br</strong>.</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">10. Atualizações</h2>
        <p>Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos você sobre mudanças significativas através da plataforma ou e-mail.</p>
      </section>
    </div>
  )
}
