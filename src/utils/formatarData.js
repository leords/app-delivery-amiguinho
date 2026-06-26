import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// date-fns só aceita objetos DATE válidos

//apenas data 01/01/2025
export const dataFormatada = (data = new Date()) => {
  return format(data, "dd/MM/yyyy", { locale: ptBR });
};

export const dataHoraFormatada = (data = new Date()) => {
  return format(data, "dd/MM/yyyy HH:mm", { locale: ptBR });
};

export const dataFormatadaCalendario = (data = new Date()) => {
  return format(data, "yyyy-MM-dd", { locale: ptBR });
};