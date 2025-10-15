// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

// TODO: Adicione as credenciais do seu projeto Firebase aqui
// Você pode encontrar essas credenciais no Console do Firebase > Configurações do Projeto
const firebaseConfig = {
  apiKey: "AIzaSyDbyNu2icVVSRKE6qwCsMbigEs9X0xZ0AE",
  authDomain: "semear-biblia-68996880-aa7ff.firebaseapp.com",
  projectId: "semear-biblia-68996880-aa7ff",
  storageBucket: "semear-biblia-68996880-aa7ff.firebasestorage.app",
  messagingSenderId: "595173862677",
  appId: "1:595173862677:web:fe65288a80d28234c38d1c"
};

// Inicializa o Firebase com as credenciais
const app = initializeApp(firebaseConfig);

// Exporta a instância dos serviços do Firebase que você usará
// Isso garante que você está usando a mesma instância em todo o seu aplicativo
export const functions = getFunctions(app);
