-- Create Affiliate Tables

CREATE TABLE IF NOT EXISTS affiliates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    invite_code TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('active', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS affiliate_referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    referred_user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    status TEXT CHECK (status IN ('pending_payment', 'qualified')) DEFAULT 'pending_payment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS affiliate_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    referral_id UUID REFERENCES affiliate_referrals(id) NOT NULL UNIQUE,
    course_id UUID REFERENCES courses(id) NOT NULL,
    amount numeric NOT NULL DEFAULT 2000,
    status TEXT CHECK (status IN ('pending_withdrawal', 'paid')) DEFAULT 'pending_withdrawal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS affiliate_withdrawals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(id) NOT NULL,
    amount numeric NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'rejected')) DEFAULT 'pending',
    mpesa_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_withdrawals ENABLE ROW LEVEL SECURITY;

-- Affiliates can see their own profile
CREATE POLICY "Users can view own affiliate" ON affiliates FOR SELECT USING (auth.uid() = user_id);
-- Any user can create their own affiliate profile
CREATE POLICY "Users can create own affiliate" ON affiliates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clicks
CREATE POLICY "Affiliates view own clicks" ON affiliate_clicks FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = affiliate_clicks.affiliate_id AND affiliates.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);

-- Referrals
CREATE POLICY "Affiliates view own referrals" ON affiliate_referrals FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = affiliate_referrals.affiliate_id AND affiliates.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert referrals" ON affiliate_referrals FOR INSERT WITH CHECK (true);

-- Earnings
CREATE POLICY "Affiliates view own earnings" ON affiliate_earnings FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = affiliate_earnings.affiliate_id AND affiliates.user_id = auth.uid())
);

-- Withdrawals
CREATE POLICY "Affiliates view own withdrawals" ON affiliate_withdrawals FOR SELECT USING (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = affiliate_withdrawals.affiliate_id AND affiliates.user_id = auth.uid())
);
CREATE POLICY "Affiliates can insert withdrawals" ON affiliate_withdrawals FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM affiliates WHERE affiliates.id = affiliate_withdrawals.affiliate_id AND affiliates.user_id = auth.uid())
);
