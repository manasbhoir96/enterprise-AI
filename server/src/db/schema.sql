-- NexusAI Enterprise Multi-Tenant Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types for domain integrity
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('owner', 'admin', 'employee');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE data_classification_enum AS ENUM ('public', 'internal', 'confidential', 'restricted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE workflow_status_enum AS ENUM ('idle', 'processing', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  industry VARCHAR(100),
  compliance_level VARCHAR(50) DEFAULT 'SOC2 Type II',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  department VARCHAR(100),
  role user_role_enum DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge Assets
CREATE TABLE IF NOT EXISTS knowledge_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  content_text TEXT NOT NULL,
  department_tag VARCHAR(100),
  classification data_classification_enum DEFAULT 'internal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Workflows
CREATE TABLE IF NOT EXISTS ai_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),
  name VARCHAR(150) NOT NULL,
  system_prompt TEXT NOT NULL,
  target_department VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Executions (Audit Log)
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES ai_workflows(id) ON DELETE CASCADE,
  executed_by UUID NOT NULL REFERENCES users(id),
  status workflow_status_enum DEFAULT 'processing',
  input_payload JSONB NOT NULL,
  ai_response JSONB,
  execution_time_ms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create optimized indices for multi-tenancy
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_assets_org_id ON knowledge_assets(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_workflows_org_id ON ai_workflows(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
