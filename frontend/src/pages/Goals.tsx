import React, { useState } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { GoalCard } from '../components/domain/GoalCard';
import { Card } from '../components/ui/Card';
import { goals as seedGoals } from '../data/seed';
import { fmtINR, monthsBetween } from '../utils/formatters';
export function Goals() {
  const [goals, setGoals] = useState(seedGoals);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    sip: '',
    priority: 'Medium',
    category: 'Other'
  });
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || filter === 'high' && goal.priority === 'High' || filter === 'medium' && goal.priority === 'Medium' || filter === 'low' && goal.priority === 'Low';
    return matchesSearch && matchesFilter;
  });
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.deadline || !newGoal.sip) {
      alert('Please fill all required fields');
      return;
    }
    const goal = {
      id: `g${goals.length + 1}`,
      name: newGoal.name,
      target: parseInt(newGoal.target),
      saved: 0,
      deadline: newGoal.deadline,
      sip: parseInt(newGoal.sip),
      priority: newGoal.priority,
      category: newGoal.category
    };
    setGoals([...goals, goal]);
    setIsAddModalOpen(false);
    setNewGoal({
      name: '',
      target: '',
      deadline: '',
      sip: '',
      priority: 'Medium',
      category: 'Other'
    });
  };
  const monthsToGoal = (goal: any) => {
    if (goal.sip <= 0) return '∞';
    const remaining = goal.target - goal.saved;
    return Math.ceil(remaining / goal.sip);
  };
  return <PageContainer title="Financial Goals" description="Track and manage your financial goals" action={<Button onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Goal
        </Button>}>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input placeholder="Search goals..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full" />
        </div>
        <Select value={filter} onChange={e => setFilter(e.target.value)} options={[{
        value: 'all',
        label: 'All Priorities'
      }, {
        value: 'high',
        label: 'High Priority'
      }, {
        value: 'medium',
        label: 'Medium Priority'
      }, {
        value: 'low',
        label: 'Low Priority'
      }]} className="sm:w-48" />
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => <GoalCard key={goal.id} goal={goal} onClick={() => setSelectedGoal(goal)} />)}
        </div> : <Card className="text-center py-12">
          <p className="text-slate-600 mb-4">No goals found</p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Your First Goal
          </Button>
        </Card>}

      {/* Add Goal Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Goal" size="md">
        <div className="space-y-4">
          <Input label="Goal Name" placeholder="e.g., Home Down Payment" value={newGoal.name} onChange={e => setNewGoal({
          ...newGoal,
          name: e.target.value
        })} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Amount (₹)" type="number" placeholder="1500000" value={newGoal.target} onChange={e => setNewGoal({
            ...newGoal,
            target: e.target.value
          })} />
            <Input label="Monthly SIP (₹)" type="number" placeholder="12000" value={newGoal.sip} onChange={e => setNewGoal({
            ...newGoal,
            sip: e.target.value
          })} />
          </div>

          <Input label="Target Date" type="date" value={newGoal.deadline} onChange={e => setNewGoal({
          ...newGoal,
          deadline: e.target.value
        })} />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" value={newGoal.priority} onChange={e => setNewGoal({
            ...newGoal,
            priority: e.target.value
          })} options={[{
            value: 'High',
            label: 'High'
          }, {
            value: 'Medium',
            label: 'Medium'
          }, {
            value: 'Low',
            label: 'Low'
          }]} />
            <Select label="Category" value={newGoal.category} onChange={e => setNewGoal({
            ...newGoal,
            category: e.target.value
          })} options={[{
            value: 'Property',
            label: 'Property'
          }, {
            value: 'Education',
            label: 'Education'
          }, {
            value: 'Lifestyle',
            label: 'Lifestyle'
          }, {
            value: 'Retirement',
            label: 'Retirement'
          }, {
            value: 'Other',
            label: 'Other'
          }]} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddGoal} className="flex-1">
              Add Goal
            </Button>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Goal Details Modal */}
      {selectedGoal && <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)} title={selectedGoal.name} size="md">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Target Amount</p>
                <p className="text-xl font-bold text-slate-900">
                  {fmtINR(selectedGoal.target)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Saved So Far</p>
                <p className="text-xl font-bold text-success-600">
                  {fmtINR(selectedGoal.saved)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Monthly SIP</p>
                <p className="text-xl font-bold text-primary-600">
                  {fmtINR(selectedGoal.sip)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Months to Goal</p>
                <p className="text-xl font-bold text-slate-900">
                  {monthsToGoal(selectedGoal)}
                </p>
              </div>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-2">Projection</h4>
              <p className="text-sm text-slate-700">
                At your current SIP of {fmtINR(selectedGoal.sip)}/month, you'll
                reach your goal of {fmtINR(selectedGoal.target)} in
                approximately{' '}
                <span className="font-semibold">
                  {monthsToGoal(selectedGoal)} months
                </span>
                .
              </p>
            </div>

            <Button onClick={() => setSelectedGoal(null)} className="w-full">
              Close
            </Button>
          </div>
        </Modal>}
    </PageContainer>;
}