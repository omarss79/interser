"use client";

import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
// Se asume que tienes @supabase/supabase-js instalado para obtener este tipo.
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";

// --- Definiciones de Tipos (TypeScript) ---
interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  account_type: string | null;
  created_at: string;
}

interface FormData {
  id: string | null;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  account_type: string;
}

// Componente para un ícono SVG de edición
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-500 hover:text-yellow-600"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// Componente para un ícono SVG de eliminación
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-red-500 hover:text-red-600"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// El componente ya no recibe props. Crea su propio cliente de Supabase.
export default function BankAccountsManager() {
  // Se crea la instancia del cliente de Supabase directamente en el componente.
  // Se usa 'any' porque el tipo SupabaseClient no está disponible al importar desde CDN.
  const [supabase] = useState<any | null>(() => {
    // Es crucial que estas variables de entorno estén definidas y expuestas al cliente (con NEXT_PUBLIC_)
    // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // if (!supabaseUrl || !supabaseAnonKey) {
    //   console.error(
    //     "Supabase URL o Anon Key no están definidas en las variables de entorno."
    //   );
    //   return null;
    // }
    return createClient();
  });

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [formData, setFormData] = useState<FormData>({
    id: null,
    bank_name: "",
    account_number: "",
    account_holder_name: "",
    account_type: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener la sesión del usuario al cargar el componente
  useEffect(() => {
    if (!supabase) return;
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setError(
          "No se pudo obtener la sesión del usuario. Asegúrate de haber iniciado sesión."
        );
        setIsLoading(false);
      }
    };
    getUser();
  }, [supabase]);

  // Función para obtener las cuentas bancarias del usuario
  const fetchAccounts = useCallback(async () => {
    if (!userId || !supabase) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        setAccounts(data);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error al obtener cuentas:", error);
      setError(
        "No se pudieron cargar las cuentas bancarias. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase, userId]);

  // Cargar las cuentas cuando el ID de usuario esté disponible
  useEffect(() => {
    if (userId) {
      fetchAccounts();
    }
  }, [userId, fetchAccounts]);

  // Manejar cambios en el formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Limpiar el formulario y salir del modo de edición
  const resetForm = () => {
    setFormData({
      id: null,
      bank_name: "",
      account_number: "",
      account_holder_name: "",
      account_type: "",
    });
    setIsEditing(false);
  };

  // Manejar el envío del formulario (crear o actualizar)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !supabase) return;

    if (
      !formData.bank_name ||
      !formData.account_number ||
      !formData.account_holder_name
    ) {
      setError("Por favor, completa los campos obligatorios.");
      return;
    }
    setError(null);

    if (isEditing) {
      const { error } = await supabase
        .from("bank_accounts")
        .update({
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_holder_name: formData.account_holder_name,
          account_type: formData.account_type,
        })
        .eq("id", formData.id);

      if (error) setError("Error al actualizar la cuenta.");
      else {
        fetchAccounts();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("bank_accounts").insert([
        {
          user_id: userId,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_holder_name: formData.account_holder_name,
          account_type: formData.account_type,
        },
      ]);

      if (error) setError("Error al agregar la nueva cuenta.");
      else {
        fetchAccounts();
        resetForm();
      }
    }
  };

  // Preparar el formulario para editar una cuenta existente
  const handleEdit = (account: BankAccount) => {
    setIsEditing(true);
    setFormData({
      id: account.id,
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_holder_name: account.account_holder_name,
      account_type: account.account_type || "",
    });
    window.scrollTo(0, 0);
  };

  // Eliminar una cuenta
  const handleDelete = async (accountId: string) => {
    if (!supabase) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cuenta?")) {
      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", accountId);

      if (error) setError("Error al eliminar la cuenta.");
      else fetchAccounts();
    }
  };

  if (!supabase) {
    return (
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-4xl mx-auto font-sans text-center">
        <p className="text-red-400">
          Error: Las credenciales de Supabase no están configuradas
          correctamente. Revisa tus variables de entorno.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-4xl mx-auto font-sans">
      <div className="mb-8 p-6 bg-gray-700 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">
          {isEditing ? "Editar Cuenta Bancaria" : "Agregar Nueva Cuenta"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="bank_name"
                className="block text-sm font-medium text-gray-300"
              >
                Nombre del Banco *
              </label>
              <input
                type="text"
                name="bank_name"
                id="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="account_holder_name"
                className="block text-sm font-medium text-gray-300"
              >
                Nombre del Titular *
              </label>
              <input
                type="text"
                name="account_holder_name"
                id="account_holder_name"
                value={formData.account_holder_name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="account_number"
                className="block text-sm font-medium text-gray-300"
              >
                Número de Cuenta / CLABE *
              </label>
              <input
                type="text"
                name="account_number"
                id="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="account_type"
                className="block text-sm font-medium text-gray-300"
              >
                Tipo de Cuenta (ej. Ahorros)
              </label>
              <input
                type="text"
                name="account_type"
                id="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md font-semibold transition-colors"
            >
              {isEditing ? "Actualizar Cuenta" : "Guardar Cuenta"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md font-semibold transition-colors"
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
        {error && (
          <p className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-md">
            {error}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-t border-gray-700 pt-6">
          Mis Cuentas Registradas
        </h2>
        {isLoading ? (
          <p className="text-center text-gray-400">Cargando cuentas...</p>
        ) : accounts.length === 0 ? (
          <p className="text-center text-gray-400 bg-gray-700 p-4 rounded-lg">
            No tienes ninguna cuenta bancaria registrada.
          </p>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center shadow-md gap-4"
              >
                <div className="flex-1">
                  <p className="font-bold text-lg text-white">
                    {account.bank_name}
                  </p>
                  <p className="text-gray-300">
                    Titular:{" "}
                    <span className="font-mono">
                      {account.account_holder_name}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    Cuenta:{" "}
                    <span className="font-mono">{account.account_number}</span>
                  </p>
                  {account.account_type && (
                    <p className="text-gray-400 text-sm">
                      Tipo: {account.account_type}
                    </p>
                  )}
                </div>
                <div className="flex space-x-4 self-end md:self-center">
                  <button
                    onClick={() => handleEdit(account)}
                    aria-label="Editar"
                    className="p-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    aria-label="Eliminar"
                    className="p-2 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
