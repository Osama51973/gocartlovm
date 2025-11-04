-- Make user_id NOT NULL
ALTER TABLE public.stores 
ALTER COLUMN user_id SET NOT NULL;

-- Add missing columns for store details
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS address text;

-- Additional RLS policy for sellers to view their own stores
DROP POLICY IF EXISTS "Sellers can view their own stores" ON public.stores;
CREATE POLICY "Sellers can view their own stores"
ON public.stores
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  public.has_role(auth.uid(), 'admin')
);