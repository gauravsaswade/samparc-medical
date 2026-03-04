import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Medicine, Appointment, Seller, SellerMedicine, Customer, CustomerCredentials, SellerCredentials } from '../backend';
import { SellerStatus } from '../backend';

export function useListMedicines() {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ['medicines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMedicines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAvailableMedicines() {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ['medicines', 'available'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableMedicines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMedicines(search: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Medicine[]>({
    queryKey: ['medicines', 'search', search],
    queryFn: async () => {
      if (!actor || !search.trim()) return [];
      return actor.searchMedicines(search);
    },
    enabled: !!actor && !isFetching && search.trim().length > 0,
  });
}

export function useAddMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description: string; price: number; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMedicine(data.name, data.description, BigInt(Math.round(data.price * 100)), data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useEditMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; description: string; price: number; category: string; available: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editMedicine(data.id, data.name, data.description, BigInt(Math.round(data.price * 100)), data.category, data.available);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useDeleteMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMedicine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });
}

export function useGetAllContent() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, string]>>({
    queryKey: ['content', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContent(section: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ['content', section],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getContent(section);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { section: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContent(data.section, data.content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', variables.section] });
      queryClient.invalidateQueries({ queryKey: ['content', 'all'] });
    },
  });
}

export function useSubmitAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      patientName: string;
      phone: string;
      email: string;
      department: string;
      preferredDate: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const submittedAt = new Date().toISOString();
      return actor.submitAppointment(
        data.patientName,
        data.phone,
        data.email,
        data.department,
        data.preferredDate,
        data.message,
        submittedAt
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useListAppointments() {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAppointmentStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAppointment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// ── Customer Queries ─────────────────────────────────────────────────────────

export function useRegisterCustomer() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; phone: string; passwordHash: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerCustomer(data.name, data.email, data.phone, data.passwordHash);
    },
  });
}

export function useLoginCustomer() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: { email: string; passwordHash: string }): Promise<Customer> => {
      if (!actor) throw new Error('Actor not available');
      return actor.loginCustomer(data.email, data.passwordHash);
    },
  });
}

export function useListCustomers() {
  const { actor, isFetching } = useActor();
  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCustomer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// ── Seller Queries ───────────────────────────────────────────────────────────

export function useRegisterSeller() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      businessName: string;
      passwordHash: string;
      documentDescriptions: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerSeller(
        data.name,
        data.email,
        data.phone,
        data.businessName,
        data.passwordHash,
        data.documentDescriptions
      );
    },
  });
}

export function useLoginSeller() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: { email: string; passwordHash: string }): Promise<Seller> => {
      if (!actor) throw new Error('Actor not available');
      return actor.loginSeller(data.email, data.passwordHash);
    },
  });
}

export function useListSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<Seller[]>({
    queryKey: ['sellers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSellerStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: SellerStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSellerStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });
}

export function useDeleteSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSeller(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });
}

// ── Seller Medicine Queries ──────────────────────────────────────────────────

export function useListSellerMedicines(sellerId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SellerMedicine[]>({
    queryKey: ['sellerMedicines', sellerId?.toString()],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.listSellerMedicines(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
  });
}

export function useListAllSellerMedicines() {
  const { actor, isFetching } = useActor();
  return useQuery<SellerMedicine[]>({
    queryKey: ['sellerMedicines', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllSellerMedicines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSellerMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sellerId: bigint;
      name: string;
      description: string;
      price: number;
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSellerMedicine(
        data.sellerId,
        data.name,
        data.description,
        BigInt(Math.round(data.price * 100)),
        data.category
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerMedicines'] });
    },
  });
}

export function useEditSellerMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      price: number;
      category: string;
      available: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editSellerMedicine(
        data.id,
        data.name,
        data.description,
        BigInt(Math.round(data.price * 100)),
        data.category,
        data.available
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerMedicines'] });
    },
  });
}

export function useDeleteSellerMedicine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSellerMedicine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerMedicines'] });
    },
  });
}

// ── Credentials Queries ──────────────────────────────────────────────────────

export function useListCustomerCredentials() {
  const { actor, isFetching } = useActor();
  return useQuery<CustomerCredentials[]>({
    queryKey: ['customerCredentials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCustomerCredentials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListSellerCredentials() {
  const { actor, isFetching } = useActor();
  return useQuery<SellerCredentials[]>({
    queryKey: ['sellerCredentials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSellerCredentials();
    },
    enabled: !!actor && !isFetching,
  });
}
