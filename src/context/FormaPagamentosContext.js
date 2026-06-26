import { createContext, useContext, useEffect, useState } from "react";
import { buscarFormasPagamento } from "../../API/produtos/buscarFormasPagamento";

const FormaPagamentoContext = createContext();

export const FormaPagamentosProvider = ({ children }) => {
  const [formasPagamentoMap, setFormasPagamentoMap] = useState({});
  const [carregandoFormasPagamento, setCarregandoFormasPagamento] = useState(true);

  useEffect(() => {
    async function carregarFormasPagamento() {
      try {
        const data = await buscarFormasPagamento()

        console.log('DATA: ', data)
        
        const mapa = {};
        data.forEach((p) => {
          mapa[p.id] = p;
        });

        setFormasPagamentoMap(mapa);
      } catch (error) {
        console.error("Erro ao carregar formas de pagamentos:", error);
      } finally {
        setCarregandoFormasPagamento(false); // ✅ corrigido
      }
    }

    carregarFormasPagamento();
  }, []);

  return (
    <FormaPagamentoContext.Provider value={{ formasPagamentoMap, carregandoFormasPagamento }}>
      {children}
    </FormaPagamentoContext.Provider>
  );
};

export const usarFormasPagamento = () => useContext(FormaPagamentoContext);
