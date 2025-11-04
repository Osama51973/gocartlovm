import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const CreateStore = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    description: '',
    email: '',
    contactNumber: '',
    address: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || !hasRole('seller'))) {
      navigate('/auth');
    }
  }, [user, hasRole, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: storeError } = await supabase
        .from('stores')
        .insert({
          slug: formData.username,
          user_id: user?.id,
        })
        .select()
        .single();

      if (storeError) throw storeError;

      toast({
        title: 'Success',
        description: 'Your store has been submitted for admin verification.',
      });

      navigate('/seller');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-2">Add Your Store</h1>
      <p className="text-muted-foreground mb-8">
        To become a seller on GoCart, submit your store details for review. Your
        store will be activated after admin verification.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="logo">Store Logo</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload logo</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your store username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your store name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter your store description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your store email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="Enter your store contact number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your store address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default CreateStore;