import { createContext, useContext, useEffect, useState } from "react";
import { buscarProdutos } from "../../API/produtos/buscarProdutos";

const ProdutosContext = createContext();

export const ProdutosProvider = ({ children }) => {
  const [produtosMap, setProdutosMap] = useState({});
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const data = await buscarProdutos();
        
        const mapa = {};
        data.forEach((p) => {
          mapa[p.id] = p;
        });

        setProdutosMap(mapa);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setCarregandoProdutos(false); // ✅ corrigido
      }
    }

    carregarProdutos();
  }, []);

  return (
    <ProdutosContext.Provider value={{ produtosMap, carregandoProdutos }}>
      {children}
    </ProdutosContext.Provider>
  );
};

export const usarProdutos = () => useContext(ProdutosContext);
