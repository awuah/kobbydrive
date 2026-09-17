CREATE TABLE IF NOT EXISTS kbdr_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    surname TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    title TEXT NOT NULL,
    id_type TEXT NOT NULL,
    id_number TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth TEXT NOT NULL,
    postal_address TEXT,
    house_address TEXT NOT NULL,
    nationality TEXT NOT NULL DEFAULT 'Ghanaian',
    email TEXT NOT NULL,
    electoral_area TEXT DEFAULT 'Amanful West',
    training_purpose TEXT DEFAULT 'Personal',
    house_number TEXT DEFAULT '',
    passport_photo TEXT,
    is_employed TEXT DEFAULT 'No',
    signature_data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kbdr_application_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES kbdr_applications(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    performed_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kbdr_admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    admin_code TEXT,
    action TEXT NOT NULL,
    application_id UUID,
    application_number TEXT,
    candidate_name TEXT,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kbdr_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kbdr_applications_app_no ON kbdr_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_kbdr_applications_phone ON kbdr_applications(phone_number);
CREATE INDEX IF NOT EXISTS idx_kbdr_applications_status ON kbdr_applications(status);
CREATE INDEX IF NOT EXISTS idx_kbdr_applications_created ON kbdr_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kbdr_admin_logs_created ON kbdr_admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kbdr_admin_logs_admin_id ON kbdr_admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_kbdr_admin_logs_action ON kbdr_admin_activity_logs(action);

ALTER TABLE kbdr_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kbdr_application_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kbdr_admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kbdr_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS kbdr_public_insert_policy ON kbdr_applications;
CREATE POLICY kbdr_public_insert_policy ON kbdr_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS kbdr_public_select_policy ON kbdr_applications;
CREATE POLICY kbdr_public_select_policy ON kbdr_applications FOR SELECT TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS kbdr_public_update_policy ON kbdr_applications;
CREATE POLICY kbdr_public_update_policy ON kbdr_applications FOR UPDATE TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS kbdr_public_delete_policy ON kbdr_applications;
CREATE POLICY kbdr_public_delete_policy ON kbdr_applications FOR DELETE TO anon, authenticated, service_role USING (true);

DROP POLICY IF EXISTS kbdr_logs_all ON kbdr_application_logs;
CREATE POLICY kbdr_logs_all ON kbdr_application_logs FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS kbdr_admin_logs_all ON kbdr_admin_activity_logs;
CREATE POLICY kbdr_admin_logs_all ON kbdr_admin_activity_logs FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS kbdr_settings_all ON kbdr_settings;
CREATE POLICY kbdr_settings_all ON kbdr_settings FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
