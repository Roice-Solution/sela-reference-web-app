import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

function assertConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing Supabase configuration. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY."
    );
  }
}

assertConfig();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function loginWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return data;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export const companiesApi = {
  list: async () => {
    const { data, error } = await supabase.from("companies").select("*").limit(50);
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const normalized = { ...(payload || {}) };
    delete normalized.company_code;
    const { data, error } = await supabase.from("companies").insert(normalized).select();
    if (error) throw error;
    return data || [];
  },
  update: async (companyCode, payload) => {
    const { data, error } = await supabase
      .from("companies")
      .update(payload)
      .eq("company_code", companyCode)
      .select();
    if (error) throw error;
    return data || [];
  },
  remove: async (companyCode) => {
    const { error } = await supabase.from("companies").delete().eq("company_code", companyCode);
    if (error) throw error;
  },
};

export const masterProductsApi = {
  list: async () => {
    const { data, error } = await supabase.from("master_products").select("*").limit(50);
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const normalized = Object.fromEntries(
      Object.entries(payload || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );
    if (!normalized.master_product_code || String(normalized.master_product_code).trim() === "") {
      delete normalized.master_product_code;
    }
    const { data, error } = await supabase.from("master_products").insert(normalized).select();
    if (error) throw error;
    return data || [];
  },
  update: async (code, payload) => {
    const normalized = Object.fromEntries(
      Object.entries(payload || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );
    delete normalized.master_product_code;
    const { data, error } = await supabase
      .from("master_products")
      .update(normalized)
      .eq("master_product_code", code)
      .select();
    if (error) throw error;
    return data || [];
  },
  remove: async (code) => {
    const { error } = await supabase.from("master_products").delete().eq("master_product_code", code);
    if (error) throw error;
  },
};

export const masterAgentsApi = {
  list: async () => {
    const { data, error } = await supabase.from("master_agents").select("*").limit(50);
    if (error) throw error;
    return (data || []).map((agent) => ({
      ...agent,
      license_owner_phone: agent.license_owner_phone ?? agent.license_owner_phone_number ?? "",
      business_cat: agent.business_cat ?? agent.business_unit ?? "",
    }));
  },
  create: async (payload) => {
    const normalized = Object.fromEntries(
      Object.entries(payload || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );
    normalized.license_owner_phone_number =
      normalized.license_owner_phone_number ?? normalized.license_owner_phone;
    normalized.business_unit = normalized.business_unit ?? normalized.business_cat;
    if (!normalized.master_agent_code || String(normalized.master_agent_code).trim() === "") {
      delete normalized.master_agent_code;
    }
    delete normalized.license_owner_phone;
    delete normalized.business_cat;
    const { data, error } = await supabase.from("master_agents").insert(normalized).select();
    if (error) throw error;
    return data || [];
  },
  update: async (code, payload) => {
    const normalized = Object.fromEntries(
      Object.entries(payload || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );
    normalized.license_owner_phone_number =
      normalized.license_owner_phone_number ?? normalized.license_owner_phone;
    normalized.business_unit = normalized.business_unit ?? normalized.business_cat;
    delete normalized.master_agent_code;
    delete normalized.license_owner_phone;
    delete normalized.business_cat;
    const { data, error } = await supabase
      .from("master_agents")
      .update(normalized)
      .eq("master_agent_code", code)
      .select();
    if (error) throw error;
    return data || [];
  },
  remove: async (code) => {
    const { error } = await supabase.from("master_agents").delete().eq("master_agent_code", code);
    if (error) throw error;
  },
};

export const productsPerCompanyApi = {
  list: async () => {
    const { data, error } = await supabase.from("products_per_company").select("*").limit(50);
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from("products_per_company").insert(payload).select();
    if (error) throw error;
    return data || [];
  },
  update: async (id, payload) => {
    const { data, error } = await supabase
      .from("products_per_company")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data || [];
  },
  remove: async (id) => {
    const { error } = await supabase.from("products_per_company").delete().eq("id", id);
    if (error) throw error;
  },
};

export const agentsPerCompanyApi = {
  list: async () => {
    const { data, error } = await supabase.from("agents_per_company").select("*").limit(50);
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from("agents_per_company").insert(payload).select();
    if (error) throw error;
    return data || [];
  },
  update: async (id, payload) => {
    const { data, error } = await supabase
      .from("agents_per_company")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data || [];
  },
  remove: async (id) => {
    const { error } = await supabase.from("agents_per_company").delete().eq("id", id);
    if (error) throw error;
  },
};

export const userAccessApi = {
  list: async () => {
    const { data, error } = await supabase.from("user_access").select("*").limit(50);
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from("user_access").insert(payload).select();
    if (error) throw error;
    return data || [];
  },
  update: async (id, payload) => {
    const { data, error } = await supabase
      .from("user_access")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data || [];
  },
  remove: async (id) => {
    const { error } = await supabase.from("user_access").delete().eq("id", id);
    if (error) throw error;
  },
};
