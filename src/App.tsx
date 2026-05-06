import { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, DollarSign, Activity, Percent } from "lucide-react";

type Dado = {
  data: string;
  valor: number;
};

export default function App() {
  const [ipca, setIpca] = useState<Dado[]>([]);
  const [selic, setSelic] = useState<Dado[]>([]);
  const [dolar, setDolar] = useState<Dado[]>([]);
  
  const [updates, setUpdates] = useState({ ipca: "", selic: "", dolar: "" });

  const [previsoes, setPrevisoes] = useState({
  ipca: null as number | null,
  selic: null as number | null,
  dolar: null as number | null
});

const [activeIndex, setActiveIndex] = useState(0);
  const carregarDados = () => {
  fetch("/ipca")
    .then((res) => res.json())
    .then((data) => {
      setIpca(data.dados_ultimos_12_meses || []);

      setUpdates((prev) => ({
        ...prev,
        ipca: data.ultima_data_real,
      }));

      setPrevisoes((prev) => ({
        ...prev,
        ipca: data.previsao_proximo_mes,
      }));
    });

  fetch("/selic")
    .then((res) => res.json())
    .then((data) => {
      setSelic(data.dados_ultimos_12_registros || []);

      setUpdates((prev) => ({
        ...prev,
        selic: data.ultima_data_real,
      }));

      setPrevisoes((prev) => ({
        ...prev,
        selic: data.previsao_proxima_taxa,
      }));
    });

  fetch("/dolar")
    .then((res) => res.json())
    .then((data) => {
      setDolar(data.dados_ultimos_30_dias || []);

      setUpdates((prev) => ({
        ...prev,
        dolar: data.ultima_data_real,
      }));

      setPrevisoes((prev) => ({
        ...prev,
        dolar: data.previsao_proximo_dia,
      }));
    });
};
  useEffect(() => {
    carregarDados(); 

    const interval = setInterval(carregarDados, 60000); 
    
    return () => clearInterval(interval); 
  }, []);
useEffect(() => {
  if (!ipca.length) return;

  const interval = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % ipca.length);
  }, 1500); 

  return () => clearInterval(interval);
}, [ipca]);
  const ultimoIPCA = ipca[ipca.length - 1]?.valor;
  const ultimaSelic = selic[selic.length - 1]?.valor;
  const ultimoDolar = dolar[dolar.length - 1]?.valor;
  const tendenciaIPCA =
  previsoes.ipca && ultimoIPCA
    ? previsoes.ipca > ultimoIPCA
      ? "alta"
      : previsoes.ipca < ultimoIPCA
      ? "queda"
      : "estavel"
    : null;
    const tendenciaSelic =
  previsoes.selic !== null && ultimaSelic !== undefined
    ? previsoes.selic > ultimaSelic
      ? "alta"
      : previsoes.selic < ultimaSelic
      ? "queda"
      : "estavel"
    : null;
    const tendenciaDolar =
  previsoes.dolar !== null && ultimoDolar !== undefined
    ? previsoes.dolar > ultimoDolar
      ? "alta"
      : previsoes.dolar < ultimoDolar
      ? "queda"
      : "estavel"
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-4 md:p-8 min-[1901px]:px-[90px]">
      
      <div className="max-w-[1400px] min-[1901px]:max-w-none mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/20">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Inteligência e Macrotendências
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Análise de indicadores econômicos em tempo real via API Banco Central
            </p>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD IPCA */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-blue-500/40 transition-all">
  <div>
    <div className="flex justify-between items-start mb-4">
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        Inflação (IPCA)
      </p>
      <Percent size={18} className="text-blue-400" />
    </div>

    <h2 className="text-3xl font-bold text-blue-400">
      {ultimoIPCA ? `${ultimoIPCA}%` : "--"}
    </h2>
  {previsoes.ipca && tendenciaIPCA && (
  <div className="flex items-center gap-2 mt-2 text-xs font-medium">

    {/* TEXTO FIXO */}
    <span className="text-slate-400">
      Previsão:
    </span>

    {/* VALOR + SETA DINÂMICA */}
    <div
      className={`flex items-center gap-1 font-semibold ${
        tendenciaIPCA === "alta"
          ? "text-red-400"
          : tendenciaIPCA === "queda"
          ? "text-green-400"
          : "text-slate-400"
      }`}
    >
      {tendenciaIPCA === "alta" && <FiArrowUpRight size={14} />}
      {tendenciaIPCA === "queda" && <FiArrowDownRight size={14} />}

      <span>{previsoes.ipca}%</span>
    </div>

  </div>
)}
  </div>

<div className="mt-6 pt-3 border-t border-slate-800/50 flex items-center justify-end">
  <div className="flex items-center gap-1 text-slate-600">
    <span className="text-[12px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
      Atualização API BCB {updates.ipca || "Carregando..."}
    </span>
  </div>
</div>
</div>

          {/* CARD SELIC */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Taxa SELIC</p>
                <TrendingUp size={18} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-green-400">
                {ultimaSelic !== undefined ? `${ultimaSelic}%` : "--"}
              </h2>
               {/* PREVISÃO */}
  {previsoes.selic !== null && tendenciaSelic && (
    <div className="flex items-center gap-2 mt-2 text-xs font-medium">

      {/* TEXTO FIXO */}
      <span className="text-slate-400">
        Previsão:
      </span>

      <div
        className={`flex items-center gap-1 font-semibold ${
          tendenciaSelic === "alta"
            ? "text-red-400"
            : tendenciaSelic === "queda"
            ? "text-green-400"
            : "text-slate-400"
        }`}
      >
        {tendenciaSelic === "alta" && <FiArrowUpRight size={14} />}
        {tendenciaSelic === "queda" && <FiArrowDownRight size={14} />}

        <span>{previsoes.selic}%</span>
      </div>

    </div>
  )}

            </div>
            <div className="mt-6 pt-3 border-t border-slate-800/50 flex items-center justify-end gap-1 text-slate-600">
            

    
      <span className="text-[12px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
       Atualização API BCB {updates.selic || "Carregando..."}
    </span>
            </div>
          </div>

          {/* CARD DÓLAR */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Câmbio USD</p>
                <DollarSign size={18} className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-yellow-400">
                {ultimoDolar !== undefined ? `R$ ${ultimoDolar.toFixed(2)}` : "--"}
              </h2>
              {previsoes.dolar !== null && tendenciaDolar && (
      <div className="flex items-center gap-2 mt-2 text-xs font-medium">

        {/* TEXTO FIXO */}
        <span className="text-slate-400">
          Previsão:
        </span>

        {/* VALOR + SETA */}
        <div
          className={`flex items-center gap-1 font-semibold ${
            tendenciaDolar === "alta"
              ? "text-red-400"
              : tendenciaDolar === "queda"
              ? "text-green-400"
              : "text-slate-400"
          }`}
        >
          {tendenciaDolar === "alta" && <FiArrowUpRight size={14} />}
          {tendenciaDolar === "queda" && <FiArrowDownRight size={14} />}
          {tendenciaDolar === "estavel" && <Activity size={14} />}

          <span>R$ {previsoes.dolar.toFixed(2)}</span>
        </div>

      </div>
    )}
  
            </div>
              <div className="mt-6 pt-3 border-t border-slate-800/50 flex items-center justify-end gap-1 text-slate-600">
            

    
      <span className="text-[12px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Atualização API BCB  {updates.dolar || "Carregando..."}
              </span>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 min-[1901px]:grid-cols-3 gap-8">
          
          <section className="min-[1901px]:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-8 text-slate-300">Evolução Mensal do IPCA</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
               <AreaChart 
  data={ipca}
>
  <defs>
    <linearGradient id="colorIpca" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
    </linearGradient>
  </defs>

  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />

  <XAxis 
    dataKey="data" 
    stroke="#475569" 
    fontSize={11} 
    tickLine={false} 
    axisLine={false} 
    dy={10} 
  />

  <YAxis 
    stroke="#475569" 
    fontSize={11} 
    tickLine={false} 
    axisLine={false} 
    tickFormatter={(val) => `${val}%`} 
  />

<Tooltip 
  contentStyle={{ 
    backgroundColor: '#0f172a', 
    border: '1px solid #1e293b', 
    borderRadius: '12px' 
  }} 
/>

  <Area 
    type="monotone" 
    dataKey="valor" 
    stroke="#3b82f6" 
    strokeWidth={3} 
    fillOpacity={1} 
    fill="url(#colorIpca)"
    dot={false}
   activeDot={(props: any) => {
  if (props.index === activeIndex) {
    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={6}
        fill="#3b82f6"
      />
    );
  }
  return null;
}}
  />
</AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold">Série Histórica e Variação</h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-500 uppercase text-[10px] tracking-widest sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">Período</th>
                    <th className="px-6 py-4 font-medium">Valor</th>
                    <th className="px-6 py-4 font-medium">Variação (MoM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {ipca.slice().reverse().map((item, i, arr) => {
                    const mesAnterior = arr[i + 1];
                    const delta = mesAnterior ? (item.valor - mesAnterior.valor).toFixed(2) : null;
                    const isUp = delta && parseFloat(delta) > 0;
                    const isDown = delta && parseFloat(delta) < 0;

                    return (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-300 font-medium">{item.data}</td>
                        <td className="px-6 py-4 text-blue-400 font-bold">{item.valor}%</td>
                        <td className="px-6 py-4">
                          {delta ? (
                            <div className={`flex items-center gap-1 font-semibold ${isUp ? 'text-red-400' : isDown ? 'text-green-400' : 'text-slate-500'}`}>
                              {isUp && <FiArrowUpRight size={14} />}
{isDown && <FiArrowDownRight size={14} />}
                              {Math.abs(parseFloat(delta)).toFixed(2)} pts
                            </div>
                          ) : (
                            <span className="text-slate-600">---</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}