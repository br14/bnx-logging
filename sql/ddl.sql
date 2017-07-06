
SET SCHEMA 'bianix';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS bianix.logging
(
    id uuid NOT NULL DEFAULT bianix.uuid_generate_v4(),
    name text NOT NULL,
    content text,
    level int default 1,
    logdate timestamp without time zone DEFAULT (now() at time zone 'utc'),
    createdat timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT logging_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS logging_name_idx
    ON logging USING btree
(
    name, 
    logdate
);