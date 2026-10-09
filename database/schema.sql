-- Run once: psql $DATABASE_URL -f database/schema.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE users(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), mobile text UNIQUE NOT NULL, name text, email text, role text NOT NULL DEFAULT 'user', disabled boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE profiles(user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE, language text DEFAULT 'en', location text, crops text[] DEFAULT '{}', avatar_url text, updated_at timestamptz DEFAULT now());
CREATE TABLE otp_verifications(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), mobile text NOT NULL, code_hash text NOT NULL, expires_at timestamptz NOT NULL, attempts int NOT NULL DEFAULT 0, verified boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON otp_verifications(mobile, created_at DESC);
CREATE TABLE conversations(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE, title text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
CREATE INDEX ON conversations(user_id, updated_at DESC);
CREATE TABLE messages(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES conversations ON DELETE CASCADE, role text NOT NULL CHECK (role IN ('user','assistant')), content text NOT NULL, created_at timestamptz DEFAULT now());
CREATE INDEX ON messages(conversation_id, created_at);
CREATE TABLE saved_answers(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE, message_id uuid REFERENCES messages ON DELETE SET NULL, title text, content text NOT NULL, created_at timestamptz DEFAULT now());
CREATE TABLE crop_categories(id serial PRIMARY KEY, slug text UNIQUE NOT NULL, name jsonb NOT NULL); -- name: {"en":"","te":""}
-- Content tables keep flexible JSON "data" so admin can add fields without migrations.
CREATE TABLE crops(id serial PRIMARY KEY, category_id int REFERENCES crop_categories, name jsonb NOT NULL, image_url text, data jsonb NOT NULL DEFAULT '{}', published boolean DEFAULT true, updated_at timestamptz DEFAULT now());
CREATE TABLE organic_inputs(id serial PRIMARY KEY, slug text UNIQUE, name jsonb NOT NULL, data jsonb NOT NULL DEFAULT '{}', published boolean DEFAULT true);
CREATE TABLE pests(id serial PRIMARY KEY, crop_id int REFERENCES crops, name jsonb NOT NULL, data jsonb NOT NULL DEFAULT '{}', published boolean DEFAULT true);
CREATE TABLE diseases(id serial PRIMARY KEY, crop_id int REFERENCES crops, name jsonb NOT NULL, data jsonb NOT NULL DEFAULT '{}', published boolean DEFAULT true);
CREATE TABLE articles(id serial PRIMARY KEY, slug text UNIQUE, title jsonb NOT NULL, body jsonb NOT NULL, published boolean DEFAULT false, created_at timestamptz DEFAULT now());
CREATE TABLE faqs(id serial PRIMARY KEY, question jsonb NOT NULL, answer jsonb NOT NULL, sort int DEFAULT 0, published boolean DEFAULT true);
CREATE TABLE site_settings(key text PRIMARY KEY, value jsonb NOT NULL); -- hero, footer, contact, logo...
CREATE TABLE feature_flags(key text PRIMARY KEY, enabled boolean NOT NULL);
CREATE TABLE admin_users(user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE, created_at timestamptz DEFAULT now());
