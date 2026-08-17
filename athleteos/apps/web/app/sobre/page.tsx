import Link from 'next/link';
import { Activity, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar Escura igual a Landing Page para manter consistência, ou clara? 
          Vamos usar uma Navbar clara para combinar com o Sobre Nós */}
      <header className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto border-b border-slate-100">
        <Link href="/" className="font-bold text-2xl tracking-tighter flex items-center gap-2 text-slate-900">
          <div className="w-8 h-8 rounded-full bg-[#0891b2] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          ATHLETE<span className="font-light">OS</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="#" className="hover:text-[#0891b2] transition-colors">Para Atletas</Link>
          <Link href="#" className="hover:text-[#0891b2] transition-colors">Clubes e Escolinhas</Link>
          <Link href="#" className="hover:text-[#0891b2] transition-colors">Metodologia</Link>
          <Link href="/sobre" className="text-[#0891b2] font-bold transition-colors">Sobre</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-slate-600 transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register">
            <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-full px-6 font-semibold">
              Começar Agora
            </Button>
          </Link>
        </div>
      </header>

      <main className="pb-20">
        {/* Section 1: O Que Vimos */}
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">O Que Vimos</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#06b6d4] mb-6 leading-tight">
              O Futebol Exige <br/>Mais Inteligência
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Há alguns anos, antes de se tornar uma tendência óbvia, percebemos que o futebol estava exigindo jogadores com maior capacidade cognitiva e técnica desde as categorias de base.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Os números não mentem: o jogo está mais rápido, as janelas de decisão estão mais curtas, e os clubes buscam atletas preparados taticamente cada vez mais cedo. A intuição não é mais suficiente; o desenvolvimento precisa ser guiado por dados.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="w-full aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1518605368461-1ee7c5320673?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Youth Football"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 2: O Que Fizemos */}
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">O Que Fizemos</h3>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#06b6d4] mb-6 leading-tight">
              Unimos a Tecnologia <br/>à Metodologia OATHIA
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Construímos o AthleteOS trabalhando com as melhores referências. Desenvolvemos um Motor Posicional único que mapeia e avalia as competências específicas de cada posição em campo.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nossa plataforma suporta desde treinadores de base até academias de alto rendimento. Pegamos os insights táticos do mais alto nível do esporte e os destilamos nos fundamentos do desenvolvimento de jovens talentos.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="w-full aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Technology in Football"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Quem Somos e Missão (Grid) */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Quem Somos */}
            <div>
               <h3 className="text-2xl font-bold text-slate-900 mb-1">Quem Somos</h3>
               <h2 className="text-3xl md:text-4xl font-extrabold text-[#06b6d4] mb-6">
                 Uma Grande Família do Futebol
               </h2>
               <p className="text-lg text-slate-600 mb-4">
                 Frequentemente nos perguntam: somos uma empresa de tecnologia ou uma empresa de futebol?
               </p>
               <p className="text-lg text-slate-600 mb-4">
                 O que somos é uma equipe de pessoas apaixonadas pelo esporte, unidas pela visão de desenvolver tecnologias escaláveis que permitam que cada jovem jogador se beneficie de avaliações precisas.
               </p>
               <p className="text-lg text-slate-600">
                 Somos treinadores, analistas táticos, cientistas de dados, desenvolvedores, além de pais e mães de atletas.
               </p>
            </div>

            {/* Missão */}
            <div>
               <h2 className="text-3xl md:text-4xl font-extrabold text-[#06b6d4] mb-6">
                 Nossa Missão & Visão
               </h2>
               <p className="text-lg text-slate-600 mb-4">
                 O futebol é uma escola de vida. O esporte coletivo tem um impacto positivo gigante nos jovens, e a tecnologia pode ter um papel fundamental em melhorar essa experiência.
               </p>
               <p className="text-lg text-slate-600">
                 O AthleteOS acredita que o dado certo, na hora certa, apoia tanto jogadores quanto equipes a alcançarem seus objetivos. Desde o controle de carga física até a evolução tática individual.
               </p>
            </div>
          </div>
        </section>

        {/* Section 4: Tech & Community */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                 <h3 className="text-xl font-bold text-slate-900 mb-4">Tecnologia</h3>
                 <p className="text-slate-600 leading-relaxed">
                   O AthleteOS combina banco de dados estruturado e inteligência artificial para capturar e analisar performance. Nosso ecossistema web ajuda clubes a visualizar a evolução e tomar decisões baseadas em ciência de dados.
                 </p>
              </div>
              <div>
                 <h3 className="text-xl font-bold text-slate-900 mb-4">Comunidade</h3>
                 <p className="text-slate-600 leading-relaxed">
                   Colaboramos com atletas, treinadores e scouts em toda a rede global do futebol de base. Fornecemos ferramentas que conectam e capacitam as pessoas para criarem oportunidades reais no esporte.
                 </p>
              </div>
           </div>
        </section>

        {/* Newsletter Banner */}
        <section className="max-w-7xl mx-auto px-6 py-12">
           <div className="w-full bg-gradient-to-r from-[#0f172a] to-[#0891b2] rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                 <h2 className="text-3xl font-bold text-white mb-2">
                   Fique Informado
                 </h2>
                 <h3 className="text-3xl font-bold text-[#67e8f9] mb-4">
                   AthleteOS News
                 </h3>
                 <p className="text-white/80">
                   Inscreva-se na nossa newsletter semanal para atualizações sobre talentos, tendências táticas e o que está acontecendo no futebol de base.
                 </p>
              </div>
              <div className="flex-1 w-full flex gap-4">
                 <input 
                   type="email" 
                   placeholder="Seu melhor e-mail" 
                   className="flex-1 px-4 py-3 rounded-lg outline-none"
                 />
                 <Button className="bg-[#06b6d4] hover:bg-cyan-500 text-white rounded-lg px-8 h-auto font-bold">
                   Inscrever-se
                 </Button>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
