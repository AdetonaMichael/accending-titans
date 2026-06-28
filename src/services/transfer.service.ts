/**
 * Transfer Service
 * Handles all transfer-related API calls: Accending titans transfers, bank transfers, and recipient management
 */

import { apiClient } from './api-client';
import {
  Bank,
  BankListResponse,
  BankTransferRequest,
  BankTransferResponse,
  AscendingTitansTransferRequest,
  AscendingTitansTransferResponse,
  VerifyRecipientRequest,
  VerifyRecipientResponse,
  RecipientsListResponse,
  AccountResolutionResponse,
  Recipient,
  RecipientUser,
} from '@/types/transfer.types';

class TransferService {
  /**
   * Fetch list of supported banks
   * Public endpoint, no auth required
   */
  async getBanks(): Promise<Bank[] | null> {
    try {
      const response = (await apiClient.get('/payment/banks')) as any;
      if (response && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching banks:', error);
      return null;
    }
  }

  /**
   * Verify recipient exists (Accending titans user)
   */
  async verifyRecipient(payload: VerifyRecipientRequest): Promise<RecipientUser | null> {
    try {
      const response = (await apiClient.post('/wallet/transfer/verify/user', payload)) as any;
      
      if (response?.success && response?.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error verifying recipient:', error);
      throw error; // Re-throw to let component handle it
    }
  }

  /**
   * Get recent Accending titans transfer recipients (quick selection)
   * limit: max 5 for quick list, can be higher for full list
   */
  async getRecentAscendingTitansRecipients(limit: number = 5): Promise<Recipient[] | null> {
    try {
      const response = (await apiClient.get('/wallet/transfer/recipients/Accending titans', {
        params: { limit, sort: 'recent' },
      })) as any;
      return response?.data?.recipients || null;
    } catch (error) {
      console.error('Error fetching recent recipients:', error);
      return null;
    }
  }

  /**
   * Get all transfer recipients with pagination
   * bank_type: 'Accending titans', 'external_bank', or 'all'
   * sort: 'recent', 'alphabetical', or 'frequency'
   */
  async getAllRecipients(
    bankType: string = 'all',
    sort: string = 'recent',
    page: number = 1,
    limit: number = 20
  ): Promise<RecipientsListResponse | null> {
    try {
      const response = (await apiClient.get('/wallet/transfer/recipients', {
        params: { bank_type: bankType, sort, page, limit },
      })) as any;
      return response?.data || null;
    } catch (error) {
      console.error('Error fetching recipients:', error);
      return null;
    }
  }

  /**
   * Initiate Accending titans-to-Accending titans transfer
   * IMPORTANT: Phone number must be normalized to 10 digits before calling
   */
  async initiateAscendingTitansTransfer(
    payload: AscendingTitansTransferRequest
  ): Promise<AscendingTitansTransferResponse | null> {
    try {
      const response = (await apiClient.post('/wallet/transfer/identifier', payload)) as any;
      // Response is already the full response body with success, reference, amount, etc.
      return response || null;
    } catch (error) {
      console.error('Error initiating Accending titans transfer:', error);
      throw error; // Re-throw for component error handling
    }
  }

  /**
   * Resolve bank account details
   * Used to verify account number and fetch account holder name
   */
  async resolveBankAccount(bankCode: string, accountNumber: string): Promise<AccountResolutionResponse | null> {
    try {
      const response = (await apiClient.post('/payment/resolve-account', {
        bank_code: bankCode,
        account_number: accountNumber,
      })) as any;
      return response || null;
    } catch (error) {
      console.error('Error resolving bank account:', error);
      throw error; // Re-throw for component error handling
    }
  }

  /**
   * Initiate bank transfer
   * Account must be verified before calling this
   */
  async initiateBankTransfer(payload: BankTransferRequest): Promise<BankTransferResponse | null> {
    try {
      const response = (await apiClient.post('/payment/initiate-transfer', payload)) as any;
      return response?.data || null;
    } catch (error) {
      console.error('Error initiating bank transfer:', error);
      throw error; // Re-throw for component error handling
    }
  }
}

export const transferService = new TransferService();
