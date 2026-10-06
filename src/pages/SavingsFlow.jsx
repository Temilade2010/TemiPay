import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Plus, Sparkles, TrendingUp, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AmountInput } from '../components/ui/AmountInput';
import { Modal } from '../components/ui/Modal';
import { BottomSheet } from '../components/ui/BottomSheet';
import { useAppStore } from '../store/useAppStore';
import { formatNaira } from '../utils/formatters';

export function SavingsFlow() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const savingsGoals = useAppStore((state) => state.savingsGoals);
  const createSavingsGoal = useAppStore((state) => state.createSavingsGoal);
  const depositToGoal = useAppStore((state) => state.depositToGoal);
  const withdrawFromGoal = useAppStore((state) => state.withdrawFromGoal);
  const showToast = useAppStore((state) => state.showToast);

  // Create Goal Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('200000');
  const [newGoalCategory, setNewGoalCategory] = useState('General');

  // Deposit / Withdraw Sheet
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [actionType, setActionType] = useState('deposit'); // 'deposit' | 'withdraw'
  const [actionAmount, setActionAmount] = useState('5000');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim()) {
      showToast('Please enter a goal name', 'error');
      return;
    }
    const target = parseFloat(newGoalTarget);
    if (!target || target < 1000) {
      showToast('Minimum goal target is ₦1,000', 'error');
      return;
    }

    createSavingsGoal({
      name: newGoalName,
      targetAmount: target,
      category: newGoalCategory,
      maturityDate: 'Flexible',
    });

    setNewGoalName('');
    setNewGoalTarget('200000');
    setShowCreateModal(false);
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(actionAmount);
    if (!amt || amt <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      if (actionType === 'deposit') {
        depositToGoal(selectedGoal.id, amt);
      } else {
        withdrawFromGoal(selectedGoal.id, amt);
      }
      setIsProcessing(false);
      setSelectedGoal(null);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen select-none pb-12">
      <Header
        title="TemiSave Nest"
        subtitle="Up to 15.5% Interest Per Annum"
        showBack={true}
        onBack={() => navigate(-1)}
      />

      <div className="p-4 space-y-4">
        {/* HERO SAVINGS BALANCE CARD */}
        <div className="bg-gradient-to-br from-teal-800 via-brand-700 to-emerald-900 rounded-3xl p-6 text-white shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-100">Total Savings Balance</span>
            <span className="text-xs font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              15.5% P.A.
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight mb-4">
            {formatNaira(user.totalSaved)}
          </h2>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <p className="text-teal-200 text-[10px] uppercase font-bold tracking-wider">Estimated Daily Returns</p>
              <p className="text-sm font-extrabold text-amber-300">
                +{formatNaira((user.totalSaved * 0.155 / 365), { showDecimals: true })} / day
              </p>
            </div>
            <p className="text-[10px] text-teal-200/80 max-w-[130px] text-right">
              Paid automatically into wallet every 6:00 AM
            </p>
          </div>
        </div>

        {/* Goals Header & Create Button */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Your Savings Goals ({savingsGoals.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Goal</span>
          </button>
        </div>

        {/* GOALS LIST */}
        <div className="space-y-3">
          {savingsGoals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) || 0;

            return (
              <div
                key={goal.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: goal.color || '#00A86B' }}
                    >
                      <PiggyBank className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight">
                        {goal.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Target: {formatNaira(goal.targetAmount, { showDecimals: false })} • {goal.interestRate}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px]">Saved: </span>
                    <span className="font-bold text-slate-800">{formatNaira(goal.currentAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Left: </span>
                    <span className="font-bold text-slate-600">
                      {formatNaira(Math.max(0, goal.targetAmount - goal.currentAmount), { showDecimals: false })}
                    </span>
                  </div>
                </div>

                {/* Deposit & Withdraw Buttons */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setActionType('deposit');
                      setActionAmount('5000');
                    }}
                    icon={ArrowDownLeft}
                  >
                    Deposit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setActionType('withdraw');
                      setActionAmount(goal.currentAmount.toString());
                    }}
                    icon={ArrowUpRight}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE GOAL MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Savings Goal"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g. New iPhone 16 Pro, Rent Fund"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            required
          />

          <AmountInput
            value={newGoalTarget}
            onChange={(val) => setNewGoalTarget(val)}
            label="Target Amount (₦)"
            chips={[50000, 100000, 250000, 500000, 1000000]}
          />

          <Button type="submit" fullWidth size="lg" variant="primary">
            Start Saving with 15.5% Interest
          </Button>
        </form>
      </Modal>

      {/* DEPOSIT / WITHDRAW SHEET */}
      <BottomSheet
        isOpen={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        title={actionType === 'deposit' ? `Deposit to ${selectedGoal?.name}` : `Withdraw from ${selectedGoal?.name}`}
      >
        <form onSubmit={handleActionSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            {actionType === 'deposit'
              ? 'Transfer money from your TemiPay wallet to earn daily interest on this goal.'
              : 'Withdraw funds back into your available TemiPay wallet balance instantly.'}
          </p>

          <AmountInput
            value={actionAmount}
            onChange={(val) => setActionAmount(val)}
            availableBalance={actionType === 'deposit' ? user.balance : selectedGoal?.currentAmount}
            label={actionType === 'deposit' ? 'Amount to Save' : 'Amount to Cash Out'}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            isLoading={isProcessing}
          >
            {actionType === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
}
