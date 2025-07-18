-- Schema SQL para Supabase - Sistema de Investimentos CryptoGlass
-- Execute este script no SQL Editor do Supabase

-- Tabela para armazenar os investimentos do usuário
CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Nome do ativo (ex: Bitcoin, Ethereum)
    purchase_price DECIMAL(20, 8) NOT NULL, -- Preço de compra com alta precisão para crypto
    purchase_date DATE NOT NULL,
    amount DECIMAL(20, 8) NOT NULL, -- Quantidade comprada
    type VARCHAR(50) DEFAULT 'Cryptocurrency', -- Tipo do investimento
    invested_amount DECIMAL(15, 2) NOT NULL, -- Valor total investido em USD/BRL
    current_price DECIMAL(20, 8) DEFAULT 0, -- Preço atual (atualizado via API)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar as metas de investimento
CREATE TABLE IF NOT EXISTS investment_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_name VARCHAR(100) NOT NULL, -- Nome do ativo
    purchase_price DECIMAL(20, 8) NOT NULL, -- Preço de compra
    target_price DECIMAL(20, 8) NOT NULL, -- Preço alvo
    deadline DATE NOT NULL, -- Data limite para atingir a meta
    achieved BOOLEAN DEFAULT FALSE, -- Se a meta foi atingida
    percentage_to_target DECIMAL(5, 2) DEFAULT 0, -- Percentual para atingir a meta
    invested_amount DECIMAL(15, 2) NOT NULL, -- Valor investido
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_name ON investments(name);
CREATE INDEX IF NOT EXISTS idx_investments_purchase_date ON investments(purchase_date);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON investment_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_asset_name ON investment_goals(asset_name);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON investment_goals(deadline);
CREATE INDEX IF NOT EXISTS idx_goals_achieved ON investment_goals(achieved);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_investments_updated_at 
    BEFORE UPDATE ON investments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_goals_updated_at 
    BEFORE UPDATE ON investment_goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) para garantir que usuários só vejam seus próprios dados
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_goals ENABLE ROW LEVEL SECURITY;

-- Política para investments - usuários só podem ver/editar seus próprios investimentos
CREATE POLICY "Users can view their own investments" ON investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments" ON investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments" ON investments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments" ON investments
    FOR DELETE USING (auth.uid() = user_id);

-- Política para investment_goals - usuários só podem ver/editar suas próprias metas
CREATE POLICY "Users can view their own goals" ON investment_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON investment_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON investment_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON investment_goals
    FOR DELETE USING (auth.uid() = user_id);

-- View para facilitar consultas com dados calculados
CREATE OR REPLACE VIEW investment_summary AS
SELECT 
    i.*,
    CASE 
        WHEN i.current_price > 0 THEN (i.current_price * i.amount) 
        ELSE (i.purchase_price * i.amount) 
    END as current_value,
    CASE 
        WHEN i.current_price > 0 THEN 
            ROUND(((i.current_price * i.amount) - i.invested_amount) / i.invested_amount * 100, 2)
        ELSE 0 
    END as return_percentage,
    CASE 
        WHEN i.current_price > 0 THEN 
            (i.current_price * i.amount) - i.invested_amount
        ELSE 0 
    END as gain_loss_amount
FROM investments i
WHERE i.user_id = auth.uid();

-- Comentários para documentação
COMMENT ON TABLE investments IS 'Tabela para armazenar os investimentos em criptomoedas dos usuários';
COMMENT ON TABLE investment_goals IS 'Tabela para armazenar as metas de investimento dos usuários';
COMMENT ON VIEW investment_summary IS 'View que calcula automaticamente valores atuais, percentuais de retorno e ganhos/perdas';