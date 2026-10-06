import { create } from 'zustand';
import { 
  INITIAL_USER, 
  INITIAL_TRANSACTIONS, 
  INITIAL_BENEFICIARIES, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { generateReference } from '../utils/formatters';

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('temipay_user');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_USER;
};

export const useAppStore = create((set, get) => ({
  // Authentication & User
  user: getStoredUser(),
  isAuthenticated: true,
  hideBalance: false,
  
  // App view mode: 'mobile-frame' or 'full-screen'
  viewMode: 'mobile-frame',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Actions for User & Auth
  toggleHideBalance: () => set((state) => ({ hideBalance: !state.hideBalance })),
  
  login: (phone, password) => {
    // In mock mode, any valid phone credentials succeed
    const updated = {
      ...get().user,
      phone: phone || get().user.phone
    };
    try {
      localStorage.setItem('temipay_user', JSON.stringify(updated));
    } catch (e) {}
    set({
      isAuthenticated: true,
      user: updated
    });
    get().showToast('Welcome back to TemiPay!', 'success');
    return true;
  },

  signup: ({ phone, firstName, lastName, pin }) => {
    const newUser = {
      ...INITIAL_USER,
      firstName: firstName || 'Temitope',
      lastName: lastName || 'User',
      fullName: `${firstName || 'Temitope'} ${lastName || 'User'}`.trim(),
      phone: phone,
      accountNumber: phone ? phone.slice(-10) : '8123456789',
      pin: pin || '1234',
      balance: 10000.00, // Welcome bonus!
    };
    try {
      localStorage.setItem('temipay_user', JSON.stringify(newUser));
    } catch (e) {}
    set({
      user: newUser,
      isAuthenticated: true
    });
    get().showToast('Account created! ₦10,000 welcome credit added.', 'success');
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false });
    get().showToast('Logged out successfully', 'info');
  },

  updateProfile: (updates) => {
    const updated = { ...get().user, ...updates };
    if (updates.fullName) {
      const parts = updates.fullName.trim().split(' ');
      updated.firstName = parts[0] || 'User';
      updated.lastName = parts.slice(1).join(' ') || '';
      updated.fullName = updates.fullName.trim();
    }
    set({ user: updated });
    try {
      localStorage.setItem('temipay_user', JSON.stringify(updated));
    } catch (e) {}
    get().showToast('Wallet details updated!', 'success');
  },

  setVirtualBalance: (newBalance) => {
    const num = Math.max(0, parseFloat(newBalance) || 0);
    const updated = { ...get().user, balance: num };
    set({ user: updated });
    try {
      localStorage.setItem('temipay_user', JSON.stringify(updated));
    } catch (e) {}
    get().showToast(`Virtual balance updated to ₦${num.toLocaleString()}!`, 'success');
  },

  simulateCredit: ({ senderName, senderBank, amount, narration }) => {
    const num = Math.abs(parseFloat(amount) || 10000);
    const tx = get().addTransaction({
      type: 'TRANSFER_IN',
      title: `Credit from ${senderName || 'Sender'}`,
      category: 'Money In',
      amount: num,
      fee: 0,
      sender: senderName || 'DAMILOLA ADELEKE',
      bank: senderBank || 'Guaranty Trust Bank',
      narration: narration || 'Virtual Money Deposit',
    });
    get().showToast(`Credited +₦${num.toLocaleString()} from ${senderName}!`, 'success');
    return tx;
  },

  upgradeKycTier: (tierNumber, bvnOrNin) => {
    set((state) => ({
      user: {
        ...state.user,
        kycTier: tierNumber,
        dailyLimit: tierNumber === 3 ? 10000000 : 5000000,
        bvn: bvnOrNin || state.user.bvn
      }
    }));
    get().showToast(`Upgraded to Tier ${tierNumber}! Limits increased.`, 'success');
  },

  // Transactions State & Operations
  transactions: INITIAL_TRANSACTIONS,
  
  addTransaction: (newTx) => {
    const tx = {
      id: `tx_${Date.now()}`,
      reference: newTx.reference || generateReference(),
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      ...newTx,
    };

    set((state) => {
      // adjust user balance
      const balanceChange = Number(tx.amount) || 0;
      const updatedBalance = state.user.balance + balanceChange;
      
      // Auto notification for new transaction
      const isMoneyIn = balanceChange > 0;
      const notif = {
        id: `notif_${Date.now()}`,
        title: isMoneyIn ? `Money In: +₦${Math.abs(balanceChange).toLocaleString()}` : `Debit: -₦${Math.abs(balanceChange).toLocaleString()}`,
        body: tx.title || (isMoneyIn ? 'Wallet credited successfully' : 'Transfer sent successfully'),
        type: isMoneyIn ? 'CREDIT' : 'DEBIT',
        unread: true,
        timestamp: new Date().toISOString(),
      };

      return {
        transactions: [tx, ...state.transactions],
        user: { ...state.user, balance: updatedBalance },
        notifications: [notif, ...state.notifications],
      };
    });

    return tx;
  },

  // Beneficiaries
  beneficiaries: INITIAL_BENEFICIARIES,
  addBeneficiary: (beneficiary) => {
    const exists = get().beneficiaries.some(b => b.accountNumber === beneficiary.accountNumber);
    if (exists) return;
    
    const initials = beneficiary.name ? beneficiary.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'TP';
    const newBen = {
      id: `ben_${Date.now()}`,
      initials,
      color: '#00A86B',
      ...beneficiary
    };
    set((state) => ({
      beneficiaries: [newBen, ...state.beneficiaries]
    }));
    get().showToast('Beneficiary saved', 'success');
  },

  // Savings
  savingsGoals: INITIAL_SAVINGS_GOALS,
  createSavingsGoal: (goal) => {
    const newGoal = {
      id: `sav_${Date.now()}`,
      interestRate: '15.5% p.a.',
      currentAmount: 0,
      dailyReturn: ((Number(goal.targetAmount) || 100000) * 0.155 / 365),
      color: '#00A86B',
      ...goal,
    };
    set((state) => ({
      savingsGoals: [newGoal, ...state.savingsGoals]
    }));
    get().showToast(`Goal "${goal.name}" created!`, 'success');
    return newGoal;
  },

  depositToGoal: (goalId, amount) => {
    const num = Number(amount);
    const currentUser = get().user;
    if (num > currentUser.balance) {
      get().showToast('Insufficient wallet balance', 'error');
      return false;
    }

    set((state) => ({
      user: {
        ...state.user,
        balance: state.user.balance - num,
        totalSaved: state.user.totalSaved + num
      },
      savingsGoals: state.savingsGoals.map(g => {
        if (g.id === goalId) {
          const updated = g.currentAmount + num;
          return {
            ...g,
            currentAmount: updated,
            dailyReturn: (updated * 0.155 / 365)
          };
        }
        return g;
      })
    }));

    get().addTransaction({
      type: 'SAVINGS_DEPOSIT',
      title: `Deposit to savings goal`,
      category: 'Savings',
      amount: -num,
      fee: 0,
    });

    get().showToast(`Saved ₦${num.toLocaleString()}!`, 'success');
    return true;
  },

  withdrawFromGoal: (goalId, amount) => {
    const num = Number(amount);
    const goal = get().savingsGoals.find(g => g.id === goalId);
    if (!goal || num > goal.currentAmount) {
      get().showToast('Cannot withdraw more than target current balance', 'error');
      return false;
    }

    set((state) => ({
      user: {
        ...state.user,
        balance: state.user.balance + num,
        totalSaved: Math.max(0, state.user.totalSaved - num)
      },
      savingsGoals: state.savingsGoals.map(g => {
        if (g.id === goalId) {
          const updated = g.currentAmount - num;
          return {
            ...g,
            currentAmount: updated,
            dailyReturn: (updated * 0.155 / 365)
          };
        }
        return g;
      })
    }));

    get().addTransaction({
      type: 'SAVINGS_WITHDRAWAL',
      title: `Withdrawal from ${goal.name}`,
      category: 'Money In',
      amount: num,
      fee: 0,
    });

    get().showToast(`Withdrawn ₦${num.toLocaleString()} to wallet!`, 'success');
    return true;
  },

  // Notifications
  notifications: INITIAL_NOTIFICATIONS,
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, unread: false } : n)
    }));
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, unread: false }))
    }));
  },

  // Toast System
  toasts: [],
  showToast: (message, type = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 3500);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  }
}));
