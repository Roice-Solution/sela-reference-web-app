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
    const { data, error } = await supabase
      .from("companies")
      .select(
        "*,created_by_user:profiles!companies_created_by_fkey(id,email,full_name),updated_by_user:profiles!companies_updated_by_fkey(id,email,full_name)"
      )
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  count: async () => {
    const { count, error } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
  },
  latestUpdated: async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("updated_at,created_at")
      .order("updated_at", { ascending: false, nullsLast: true })
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    const row = data?.[0];
    return row?.updated_at || row?.created_at || null;
  },
  create: async (payload) => {
    const normalized = { ...(payload || {}) };
    delete normalized.company_code;
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
    const { data, error } = await supabase.from("companies").insert(normalized).select();
    if (error) throw error;
    return data || [];
  },
  update: async (companyCode, payload) => {
    const normalized = { ...(payload || {}) };
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
    const { data, error } = await supabase
      .from("companies")
      .update(normalized)
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
    const { data, error } = await supabase
      .from("master_products")
      .select(
        "*,created_by_user:profiles!master_products_created_by_fkey(id,email,full_name),updated_by_user:profiles!master_products_updated_by_fkey(id,email,full_name)"
      )
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  count: async () => {
    const { count, error } = await supabase
      .from("master_products")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
  },
  create: async (payload) => {
    const normalized = Object.fromEntries(
      Object.entries(payload || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
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
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
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
    const { data, error } = await supabase
      .from("master_agents")
      .select(
        "*,created_by_user:profiles!master_agents_created_by_fkey(id,email,full_name),updated_by_user:profiles!master_agents_updated_by_fkey(id,email,full_name)"
      )
      .limit(50);
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
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
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
  count: async () => {
    const { count, error } = await supabase
      .from("master_agents")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
  },
  update: async (code, payload) => {
    const normalized = Object.fromEntries(
      Object.entries(payload || {}).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    );
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
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
    const { data, error } = await supabase
      .from("products_per_company")
      .select(
        "*,company:companies(company_code,company_name),master_product:master_products(master_product_code,master_product_name),created_by_user:profiles!products_per_company_created_by_fkey(id,email,full_name),updated_by_user:profiles!products_per_company_updated_by_fkey(id,email,full_name)"
      )
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  count: async () => {
    const { count, error } = await supabase
      .from("products_per_company")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
  },
  latestUpdated: async () => {
    const { data, error } = await supabase
      .from("products_per_company")
      .select("updated_at,created_at")
      .order("updated_at", { ascending: false, nullsLast: true })
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    const row = data?.[0];
    return row?.updated_at || row?.created_at || null;
  },
  create: async (payload) => {
    const { company_code, master_product_code, company_product_name } = payload || {};
    const normalized = { company_code, master_product_code, company_product_name };
    const { data, error } = await supabase.from("products_per_company").insert(normalized).select();
    if (error) throw error;
    return data || [];
  },
  update: async (id, payload) => {
    const { company_code, master_product_code, company_product_name } = payload || {};
    const normalized = { company_code, master_product_code, company_product_name };
    const { data, error } = await supabase
      .from("products_per_company")
      .update(normalized)
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
    const { data, error } = await supabase
      .from("agents_per_company")
      .select(
        "*,company:companies(company_code,company_name),master_agent:master_agents(master_agent_code,full_agent_name),master_product:master_products(master_product_code,master_product_name),created_by_user:profiles!agents_per_company_created_by_fkey(id,email,full_name),updated_by_user:profiles!agents_per_company_updated_by_fkey(id,email,full_name)"
      )
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  count: async () => {
    const { count, error } = await supabase
      .from("agents_per_company")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
  },
  latestUpdated: async () => {
    const { data, error } = await supabase
      .from("agents_per_company")
      .select("updated_at,created_at")
      .order("updated_at", { ascending: false, nullsLast: true })
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    const row = data?.[0];
    return row?.updated_at || row?.created_at || null;
  },
  create: async (payload) => {
    const normalized = { ...(payload || {}) };
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
    const { data, error } = await supabase.from("agents_per_company").insert(normalized).select();
    if (error) throw error;
    return data || [];
  },
  update: async (id, payload) => {
    const normalized = { ...(payload || {}) };
    delete normalized.created_by_user;
    delete normalized.updated_by_user;
    const { data, error } = await supabase
      .from("agents_per_company")
      .update(normalized)
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

export const agentCommissionsApi = {
  list: async () => {
    const { data, error } = await supabase
      .from("agent_commissions")
      .select(
        "*,company:companies(company_code,company_name),master_agent:master_agents(master_agent_code,full_agent_name),master_product:master_products(master_product_code,master_product_name),tier:agent_commission_tiers(id,tier_sequence_number,from_amount,to_amount,one_time_commission)"
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  },
  getById: async (agreementId) => {
    const { data, error } = await supabase
      .from("agent_commissions")
      .select(
        "*,company:companies(company_code,company_name),master_agent:master_agents(master_agent_code,full_agent_name),master_product:master_products(master_product_code,master_product_name),tier:agent_commission_tiers(id,tier_sequence_number,from_amount,to_amount,one_time_commission)"
      )
      .eq("id", agreementId)
      .limit(1);
    if (error) throw error;
    return data?.[0] || null;
  },
  create: async (payload) => {
    const normalized = { ...(payload || {}) };
    const parseBoolean = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (lower === "true") return true;
        if (lower === "false") return false;
      }
      return Boolean(value);
    };
    delete normalized.id;
    if (normalized.tier_id !== undefined && normalized.tier_id !== null) {
      normalized.tier_id = Number(normalized.tier_id);
    }
    if (normalized.one_time_commission_value !== undefined && normalized.one_time_commission_value !== null) {
      normalized.one_time_commission_value = Number(normalized.one_time_commission_value);
    }
    if (normalized.ongoing_commission_percent !== undefined && normalized.ongoing_commission_percent !== null) {
      normalized.ongoing_commission_percent = Number(normalized.ongoing_commission_percent);
    }
    if (normalized.one_time_commission_type === "fixed") {
      normalized.one_time_commission_type = "amount";
    }
    if (normalized.use_one_time_tiers !== undefined) {
      normalized.use_one_time_tiers = parseBoolean(normalized.use_one_time_tiers);
    }
    const { data, error } = await supabase.from("agent_commissions").insert(normalized).select("*");
    if (error) throw error;
    return data || [];
  },
  update: async (agreementId, payload) => {
    const normalized = { ...(payload || {}) };
    const parseBoolean = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (lower === "true") return true;
        if (lower === "false") return false;
      }
      return Boolean(value);
    };
    delete normalized.id;
    if (normalized.tier_id !== undefined && normalized.tier_id !== null) {
      normalized.tier_id = Number(normalized.tier_id);
    }
    if (normalized.one_time_commission_value !== undefined && normalized.one_time_commission_value !== null) {
      normalized.one_time_commission_value = Number(normalized.one_time_commission_value);
    }
    if (normalized.ongoing_commission_percent !== undefined && normalized.ongoing_commission_percent !== null) {
      normalized.ongoing_commission_percent = Number(normalized.ongoing_commission_percent);
    }
    if (normalized.one_time_commission_type === "fixed") {
      normalized.one_time_commission_type = "amount";
    }
    if (normalized.use_one_time_tiers !== undefined) {
      normalized.use_one_time_tiers = parseBoolean(normalized.use_one_time_tiers);
    }
    const { data, error } = await supabase
      .from("agent_commissions")
      .update(normalized)
      .eq("id", agreementId)
      .select("*");
    if (error) throw error;
    return data || [];
  },
  remove: async (agreementId) => {
    const { error } = await supabase.from("agent_commissions").delete().eq("id", agreementId);
    if (error) throw error;
  },
};

export const agentCommissionTiersApi = {
  list: async () => {
    const { data, error } = await supabase
      .from("agent_commission_tiers")
      .select("*")
      .order("tier_sequence_number", { ascending: true })
      .limit(200);
    if (error) throw error;
    return data || [];
  },
  getById: async (tierId) => {
    const { data, error } = await supabase
      .from("agent_commission_tiers")
      .select("*")
      .eq("id", tierId)
      .limit(1);
    if (error) throw error;
    return data?.[0] || null;
  },
  create: async (payload) => {
    const rows = Array.isArray(payload) ? payload : [payload];
    const normalized = rows.map((item) => {
      const row = { ...(item || {}) };
      return {
        tier_sequence_number:
          row.tier_sequence_number !== undefined && row.tier_sequence_number !== null
            ? Number(row.tier_sequence_number)
            : row.tier_sequence_number,
        from_amount:
          row.from_amount !== undefined && row.from_amount !== null
            ? Number(row.from_amount)
            : row.from_amount,
        to_amount:
          row.to_amount !== undefined && row.to_amount !== null
            ? Number(row.to_amount)
            : row.to_amount,
        one_time_commission:
          row.one_time_commission !== undefined && row.one_time_commission !== null
            ? Number(row.one_time_commission)
            : row.one_time_commission,
      };
    });
    const { data, error } = await supabase.from("agent_commission_tiers").insert(normalized).select("*");
    if (error) throw error;
    return data || [];
  },
  update: async (id, payload) => {
    const normalized = { ...(payload || {}) };
    if (normalized.tier_sequence_number !== undefined) {
      normalized.tier_sequence_number = Number(normalized.tier_sequence_number);
    }
    if (normalized.from_amount !== undefined) {
      normalized.from_amount = Number(normalized.from_amount);
    }
    if (normalized.to_amount !== undefined) {
      normalized.to_amount = Number(normalized.to_amount);
    }
    if (normalized.one_time_commission !== undefined) {
      normalized.one_time_commission = Number(normalized.one_time_commission);
    }
    const { data, error } = await supabase
      .from("agent_commission_tiers")
      .update(normalized)
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return data || [];
  },
  remove: async (id) => {
    const { error } = await supabase.from("agent_commission_tiers").delete().eq("id", id);
    if (error) throw error;
  },
};

export const userAccessApi = {
  list: async () => {
    const { data, error } = await supabase.from("user_access").select("*").limit(50);
    if (error) throw error;
    return data || [];
  },
  count: async () => {
    const { count, error } = await supabase
      .from("user_access")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
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
